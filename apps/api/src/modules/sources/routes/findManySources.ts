import { sources } from "@db/schema";
import { sourcesResponseSchema } from "@shared/sources";
import { and, eq } from "drizzle-orm";

import type { AppDb } from "@api-utils";
import type { sourceQuerySchema } from "@shared/sources";
import type { z } from "zod";

type FindManySourcesInput = z.infer<typeof sourceQuerySchema>;
type FindManySourcesSuccess = z.infer<typeof sourcesResponseSchema>;

export const findManySources = async ({
  db,
  ...query
}: FindManySourcesInput & { db: AppDb }): Promise<{ ok: true; data: FindManySourcesSuccess }> => {
  const filters = [
    query.baseUrl ? eq(sources.baseUrl, query.baseUrl) : undefined,
    query.key ? eq(sources.key, query.key) : undefined,
    query.name ? eq(sources.name, query.name) : undefined,
    query.type ? eq(sources.type, query.type) : undefined,
  ];

  const records = await db
    .select({
      baseUrl: sources.baseUrl,
      config: sources.config,
      createdAt: sources.createdAt,
      id: sources.id,
      isEnabled: sources.isEnabled,
      key: sources.key,
      name: sources.name,
      type: sources.type,
    })
    .from(sources)
    .where(and(...filters));

  return {
    ok: true,
    data: sourcesResponseSchema.parse(records),
  };
};
