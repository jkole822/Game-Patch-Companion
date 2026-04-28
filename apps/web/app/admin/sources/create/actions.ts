"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getApiBaseUrl } from "@/lib/utils";

import { INITIAL_CREATE_SOURCE_STATE } from "./types";

import type { CreateSourceActionState } from "./types";

const getString = (formData: FormData, key: string) => {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
};

const getOptionalString = (formData: FormData, key: string) => {
  const value = getString(formData, key);

  return value.length > 0 ? value : undefined;
};

const parseGenericConfig = (value: string): Record<string, unknown> => {
  if (!value) {
    return {};
  }

  const parsed = JSON.parse(value) as unknown;

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Config JSON must be an object.");
  }

  return parsed as Record<string, unknown>;
};

export const createSourceAction = async (
  _: CreateSourceActionState = INITIAL_CREATE_SOURCE_STATE,
  formData: FormData,
): Promise<CreateSourceActionState> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

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
      success: null,
    };
  }

  if (type !== "html" && type !== "rss" && type !== "api") {
    return {
      error: "Please choose a valid source type.",
      success: null,
    };
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
        success: null,
      };
    }
  }

  const body = {
    ...baseFields,
    config,
    type,
  };

  try {
    const response = await fetch(`${getApiBaseUrl()}/sources/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => null)) as {
      key?: string;
      message?: string;
      name?: string;
    } | null;

    if (response.status === 401) {
      redirect("/login");
    }

    if (!response.ok) {
      return {
        error: payload?.message ?? "Unable to create the source right now.",
        success: null,
      };
    }

    return {
      error: null,
      success: `Created ${payload?.name ?? body.name}.`,
    };
  } catch {
    return {
      error: "Unable to create the source right now.",
      success: null,
    };
  }
};
