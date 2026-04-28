"use server";

import { sourceInsertInputSchema } from "@shared/schemas";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

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

const parseGenericConfig = (value: string) => {
  if (!value) {
    return {};
  }

  const parsed = JSON.parse(value) as unknown;

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Config JSON must be an object.");
  }

  return parsed;
};

const getValidationMessage = (error: unknown) => {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? "Please check the source fields and try again.";
  }

  if (error instanceof SyntaxError) {
    return "Config JSON is not valid.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Please check the source fields and try again.";
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

  let body: z.infer<typeof sourceInsertInputSchema>;

  try {
    if (type === "html") {
      body = sourceInsertInputSchema.parse({
        ...baseFields,
        config: {
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
        },
        type,
      });
    } else {
      body = sourceInsertInputSchema.parse({
        ...baseFields,
        config: parseGenericConfig(getString(formData, "configJson")),
        type,
      });
    }
  } catch (error) {
    return {
      error: getValidationMessage(error),
      success: null,
    };
  }

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
};
