export const SOURCE_CREATE_FIELD_NAMES = [
  "baseUrl",
  "configJson",
  "contentFormat",
  "contentSelector",
  "entrySelector",
  "excludeTitleRegex",
  "includeTitleRegex",
  "key",
  "linkSelector",
  "listPath",
  "name",
  "publishedAtAttribute",
  "publishedAtRegex",
  "publishedAtSelector",
  "region",
  "structureMode",
  "titleSelector",
  "type",
  "versionRegex",
] as const;

export type SourceCreateFieldName = (typeof SOURCE_CREATE_FIELD_NAMES)[number];

export type CreateSourceActionState = {
  error: string | null;
  success: string | null;
};

export const INITIAL_CREATE_SOURCE_STATE: CreateSourceActionState = {
  error: null,
  success: null,
};
