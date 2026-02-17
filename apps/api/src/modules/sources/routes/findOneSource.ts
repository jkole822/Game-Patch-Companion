import { sources } from "@db/schema";
import { sourceNotFoundConflictSchema, sourceResponseSchema } from "@shared/sources";
import { eq } from "drizzle-orm";

import type { AppDb } from "@api-utils";
import type { z } from "zod";

type FindOneSourceSuccess = z.infer<typeof sourceResponseSchema>;
type FindOneSourceNotFoundConflict = z.infer<typeof sourceNotFoundConflictSchema>;
type FindOneSourceResult =
  | { ok: true; data: FindOneSourceSuccess }
  | { ok: false; error: FindOneSourceNotFoundConflict };

export const findOneSource = async ({
  db,
  sourceId,
}: {
  db: AppDb;
  sourceId: string;
}): Promise<FindOneSourceResult> => {
  const [source] = await db
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
    .where(eq(sources.id, sourceId))
    .limit(1);

  if (!source) {
    return {
      ok: false,
      error: sourceNotFoundConflictSchema.parse({
        error: "SOURCE_NOT_FOUND",
        message: "Source not found.",
      }),
    };
  }

  return {
    ok: true,
    data: sourceResponseSchema.parse(source),
  };
};
