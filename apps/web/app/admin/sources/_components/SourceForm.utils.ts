import type { SourceRecord } from "./SourceForm.types";

export const getString = (formData: FormData, key: string) => {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
};

export const getOptionalString = (formData: FormData, key: string) => {
  const value = getString(formData, key);

  return value.length > 0 ? value : undefined;
};

export const parseGenericConfig = (value: string): Record<string, unknown> => {
  if (!value) {
    return {};
  }

  const parsed = JSON.parse(value) as unknown;

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Config JSON must be an object.");
  }

  return parsed as Record<string, unknown>;
};

export const buildSourcePayload = (formData: FormData) => {
  const type = getString(formData, "type");
  const baseFields = {
    baseUrl: getString(formData, "baseUrl"),
    isEnabled: formData.get("isEnabled") === "on",
    key: getString(formData, "key"),
    name: getString(formData, "name"),
  };

  if (!baseFields.baseUrl || !baseFields.key || !baseFields.name) {
    return {
      error: "Please check the source fields and try again.",
      payload: null,
    } as const;
  }

  if (type !== "html" && type !== "rss" && type !== "api") {
    return {
      error: "Please choose a valid source type.",
      payload: null,
    } as const;
  }

  let config: Record<string, unknown>;

  if (type === "html") {
    config = {
      contentFormat: getString(formData, "contentFormat"),
      contentSelector: getString(formData, "contentSelector"),
      entrySelector: getString(formData, "entrySelector"),
      excludeTitleRegex: getOptionalString(formData, "excludeTitleRegex"),
      includeTitleRegex: getOptionalString(formData, "includeTitleRegex"),
      linkSelector: getString(formData, "linkSelector") || "a",
      listPath: getString(formData, "listPath"),
      publishedAtAttribute: getString(formData, "publishedAtAttribute") || "datetime",
      publishedAtRegex: getOptionalString(formData, "publishedAtRegex"),
      publishedAtSelector: getString(formData, "publishedAtSelector") || "time[datetime]",
      region: getOptionalString(formData, "region"),
      structureMode: getOptionalString(formData, "structureMode"),
      titleSelector: getString(formData, "titleSelector"),
      versionRegex: getOptionalString(formData, "versionRegex"),
    };
  } else {
    try {
      config = parseGenericConfig(getString(formData, "configJson"));
    } catch (error) {
      return {
        error:
          error instanceof SyntaxError
            ? "Config JSON is not valid."
            : "Config JSON must be an object.",
        payload: null,
      } as const;
    }
  }

  return {
    error: null,
    payload: {
      ...baseFields,
      config,
      type,
    },
  } as const;
};

export const getInitialSourceType = (source?: SourceRecord) => {
  return source?.type ?? "html";
};

export const getConfigJsonValue = (source?: SourceRecord) => {
  if (!source || source.type === "html") {
    return "{}";
  }

  return JSON.stringify(source.config, null, 2);
};
