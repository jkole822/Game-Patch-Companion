import { eq } from "@db/orm";
import { users } from "@db/schema";
import { rolePermissionConflictSchema } from "@shared/schemas";

import type { AppDb, JwtUser } from "@api-utils";

export const requireAdminUser = async ({ db, user }: { db: AppDb; user: JwtUser | null }) => {
  if (!user) {
    throw new Error("Guarded route missing authenticated user.");
  }

  const [authUser] = await db
    .select({ id: users.id, role: users.role })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  if (!authUser) {
    throw new Error("User not found");
  }

  if (authUser.role !== "admin") {
    return {
      ok: false as const,
      error: rolePermissionConflictSchema.parse({
        error: "NO_PERMISSION_FOR_ROLE",
        message: "You do not have permission to run ingest jobs.",
      }),
    };
  }

  return {
    ok: true as const,
  };
};
