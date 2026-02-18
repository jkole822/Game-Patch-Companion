import { games, users } from "@db/schema";
import { rolePermissionConflictSchema } from "@shared/schemas";
import {
  gameConflictSchema,
  gameNotFoundConflictSchema,
  gameResponseSchema,
} from "@shared/schemas";
import { eq } from "drizzle-orm";

import type { AppDb, JwtUser } from "@api-utils";
import type { gameUpdateInputSchema } from "@shared/schemas";
import type { z } from "zod";

type UpdateGameInput = z.infer<typeof gameUpdateInputSchema>;
type UpdateGameSuccess = z.infer<typeof gameResponseSchema>;
type UpdateGameConflict = z.infer<typeof gameConflictSchema>;
type UpdateGameNotFoundConflict = z.infer<typeof gameNotFoundConflictSchema>;
type UpdateRolePermissionConflict = z.infer<typeof rolePermissionConflictSchema>;

type UpdateGameResult =
  | { ok: true; data: UpdateGameSuccess }
  | { ok: false; error: UpdateGameConflict }
  | { ok: false; error: UpdateGameNotFoundConflict }
  | { ok: false; error: UpdateRolePermissionConflict };

export const updateGame = async ({
  db,
  gameId,
  user,
  ...input
}: UpdateGameInput & {
  db: AppDb;
  gameId: string;
  user: JwtUser;
}): Promise<UpdateGameResult> => {
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
          message: "You do not have permission to update games.",
        }),
      };
    }

    const [updatedGame] = await db.update(games).set(input).where(eq(games.id, gameId)).returning({
      createdAt: games.createdAt,
      id: games.id,
      key: games.key,
      title: games.title,
    });

    if (!updatedGame) {
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
      data: gameResponseSchema.parse(updatedGame),
    };
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") {
      return {
        ok: false,
        error: gameConflictSchema.parse({
          error: "GAME_KEY_ALREADY_EXISTS",
          message: "A game with this key already exists.",
        }),
      };
    }

    throw error;
  }
};
