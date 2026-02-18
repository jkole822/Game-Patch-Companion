import { users } from "@db/schema";
import { deleteUserConflictSchema, deleteUserResponseSchema } from "@shared/schemas";
import { eq } from "drizzle-orm";

import type { AppDb } from "@api-utils";
import type { z } from "zod";

type DeleteUserSuccess = z.infer<typeof deleteUserResponseSchema>;
type DeleteUserConflict = z.infer<typeof deleteUserConflictSchema>;
type DeleteUserResult =
  | { ok: true; data: DeleteUserSuccess }
  | { ok: false; error: DeleteUserConflict };

export const deleteUser = async ({
  db,
  userId,
}: {
  db: AppDb;
  userId: string;
}): Promise<DeleteUserResult> => {
  const [deletedUser] = await db
    .delete(users)
    .where(eq(users.id, userId))
    .returning({ id: users.id });

  if (!deletedUser) {
    return {
      ok: false,
      error: deleteUserConflictSchema.parse({
        error: "USER_NOT_FOUND",
        message: "User not found.",
      }),
    };
  }

  return {
    ok: true,
    data: deleteUserResponseSchema.parse({
      message: "User deleted successfully.",
    }),
  };
};
