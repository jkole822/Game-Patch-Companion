import { watchlists } from "@db/schema";
import { watchlistResponseSchema } from "@shared/schemas";

import type { AppDb, JwtUser } from "@api-utils";
import type { watchlistInsertInputSchema } from "@shared/schemas";
import type { z } from "zod";

type CreateWatchlistInput = z.infer<typeof watchlistInsertInputSchema>;
type CreateWatchlistSuccess = z.infer<typeof watchlistResponseSchema>;

export const createWatchlist = async ({
  db,
  user,
  ...input
}: CreateWatchlistInput & {
  db: AppDb;
  user: JwtUser;
}): Promise<{ ok: true; data: CreateWatchlistSuccess }> => {
  const [createdWatchlist] = await db
    .insert(watchlists)
    .values({ ...input, userId: user.id })
    .returning({
      createdAt: watchlists.createdAt,
      id: watchlists.id,
      name: watchlists.name,
      userId: watchlists.userId,
    });

  return {
    ok: true,
    data: watchlistResponseSchema.parse(createdWatchlist),
  };
};
