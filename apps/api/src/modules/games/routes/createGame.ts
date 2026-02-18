import { games, users } from "@db/schema";
import { rolePermissionConflictSchema } from "@shared/schemas";
import { gameConflictSchema, gameResponseSchema } from "@shared/schemas";
import { eq } from "drizzle-orm";

import type { AppDb, JwtUser } from "@api-utils";
import type { gameInsertInputSchema } from "@shared/schemas";
import type { z } from "zod";

type CreateGameInput = z.infer<typeof gameInsertInputSchema>;
type CreateGameSuccess = z.infer<typeof gameResponseSchema>;
type CreateGameConflict = z.infer<typeof gameConflictSchema>;
type CreateRolePermissionConflict = z.infer<typeof rolePermissionConflictSchema>;

type CreateGameResult =
  | { ok: true; data: CreateGameSuccess }
  | { ok: false; error: CreateGameConflict }
  | { ok: false; error: CreateRolePermissionConflict };

export const createGame = async ({
  db,
  user,
  ...input
}: CreateGameInput & { db: AppDb; user: JwtUser }): Promise<CreateGameResult> => {
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
          message: "You do not have permission to create games.",
        }),
      };
    }

    const [createdGame] = await db.insert(games).values(input).returning({
      createdAt: games.createdAt,
      id: games.id,
      key: games.key,
      title: games.title,
    });

    return {
      ok: true,
      data: gameResponseSchema.parse(createdGame),
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
