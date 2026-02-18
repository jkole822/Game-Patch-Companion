import { z } from "zod";

export const PatchEntryIdSchema = z.uuid();
export const GameIdSchema = z.uuid().nullable();
export const PatchEntryDateInputSchema = z.coerce.date().nullable().optional();
export const PatchEntryTextNullableSchema = z.string().nullable();
