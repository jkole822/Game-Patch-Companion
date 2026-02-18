import { games, users } from "@db/schema";
import { rolePermissionConflictSchema } from "@shared/schemas";
import {
  gameDeleteResponseSchema,
  gameInUseConflictSchema,
  gameNotFoundConflictSchema,
} from "@shared/schemas";
import { eq } from "drizzle-orm";

import type { AppDb, JwtUser } from "@api-utils";
import type { z } from "zod";

type DeleteGameSuccess = z.infer<typeof gameDeleteResponseSchema>;
type DeleteGameNotFoundConflict = z.infer<typeof gameNotFoundConflictSchema>;
type DeleteGameInUseConflict = z.infer<typeof gameInUseConflictSchema>;
type DeleteRolePermissionConflict = z.infer<typeof rolePermissionConflictSchema>;

type DeleteGameResult =
  | { ok: true; data: DeleteGameSuccess }
  | { ok: false; error: DeleteGameNotFoundConflict }
  | { ok: false; error: DeleteGameInUseConflict }
  | { ok: false; error: DeleteRolePermissionConflict };

export const deleteGame = async ({
  db,
  gameId,
  user,
}: {
  db: AppDb;
  gameId: string;
  user: JwtUser;
}): Promise<DeleteGameResult> => {
  try {
    const [authUser] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);

    if (!authUser) {
      throw new Error("User not found");
    }

    if (authUser.role !== "admin") {
      return {
        ok: false,
        error: rolePermissionConflictSchema.parse({
          error: "NO_PERMISSION_FOR_ROLE",
          message: "You do not have permission to delete games.",
        }),
      };
    }

    const [deletedGame] = await db
      .delete(games)
      .where(eq(games.id, gameId))
      .returning({ id: games.id });

    if (!deletedGame) {
      return {
        ok: false,
        error: gameNotFoundConflictSchema.parse({
          error: "GAME_NOT_FOUND",
          message: "Game not found.",
        }),
      };
    }

    return {
      ok: true,
      data: gameDeleteResponseSchema.parse({
        message: "Game deleted successfully.",
      }),
    };
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "23503") {
      return {
        ok: false,
        error: gameInUseConflictSchema.parse({
          error: "GAME_IN_USE",
          message: "Game cannot be deleted because it is referenced by patch entries.",
        }),
      };
    }

    throw error;
  }
};
