import { z } from "zod";

export const patchEntryStateSchema = z.enum(["new", "assigned", "ignored", "error"]);

export const PatchEntryIdSchema = z.uuid();
export const PatchIdSchema = z.uuid().nullable();
export const PatchEntryDateInputSchema = z.coerce.date().nullable().optional();
export const PatchEntryTextNullableSchema = z.string().nullable();
