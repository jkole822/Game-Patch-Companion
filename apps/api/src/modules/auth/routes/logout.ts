import { users } from "@db/schema";
import { logoutResponseSchema } from "@shared/schemas";
import { eq, sql } from "drizzle-orm";

import type { AppDb } from "@api-utils";
import type { z } from "zod";

type LogoutSuccess = z.infer<typeof logoutResponseSchema>;
type LogoutResult = { ok: true; data: LogoutSuccess };

export const logout = async ({
  db,
  userId,
}: {
  db: AppDb;
  userId: string;
}): Promise<LogoutResult> => {
  await db
    .update(users)
    .set({
      tokenVersion: sql`${users.tokenVersion} + 1`,
    })
    .where(eq(users.id, userId));

  return {
    ok: true,
    data: logoutResponseSchema.parse({
      message: "Logged out successfully.",
    }),
  };
};
