import { users } from "@db/schema";
import { currentUserResponseSchema } from "@shared/schemas";
import { eq } from "drizzle-orm";

import type { AppDb, JwtUser } from "@api-utils";
import type { z } from "zod";

type CurrentUserSuccess = z.infer<typeof currentUserResponseSchema>;

export const currentUser = async ({
  db,
  user,
}: {
  db: AppDb;
  user: JwtUser;
}): Promise<CurrentUserSuccess> => {
  const [authUser] = await db
    .select({
      email: users.email,
      id: users.id,
      role: users.role,
    })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  if (!authUser) {
    throw new Error("Authenticated user could not be loaded.");
  }

  return currentUserResponseSchema.parse(authUser);
};
