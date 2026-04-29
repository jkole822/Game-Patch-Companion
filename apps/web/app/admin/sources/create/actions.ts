"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getAuthCookieHeader } from "@/lib/auth";
import { getApiBaseUrl } from "@/lib/utils";

import { INITIAL_SOURCE_ACTION_STATE } from "../_components/sourceForm.types";
import { buildSourcePayload } from "../_components/sourceForm.utils";

import type { SourceActionState } from "../_components/sourceForm.types";

export const createSourceAction = async (
  _: SourceActionState = INITIAL_SOURCE_ACTION_STATE,
  formData: FormData,
): Promise<SourceActionState> => {
  const cookieStore = await cookies();
  const authCookieHeader = getAuthCookieHeader(cookieStore);

  if (!authCookieHeader) {
    redirect("/login");
  }

  const { error, payload: requestBody } = buildSourcePayload(formData);

  if (error || !requestBody) {
    return {
      error: error ?? "Please check the source fields and try again.",
      success: null,
    };
  }

  let response: Response;
  let responsePayload: {
    key?: string;
    message?: string;
    name?: string;
  } | null;

  try {
    response = await fetch(`${getApiBaseUrl()}/sources/create`, {
      method: "POST",
      headers: {
        Cookie: authCookieHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      cache: "no-store",
    });

    responsePayload = (await response.json().catch(() => null)) as {
      key?: string;
      message?: string;
      name?: string;
    } | null;
  } catch {
    return {
      error: "Unable to create the source right now.",
      success: null,
    };
  }

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    return {
      error: responsePayload?.message ?? "Unable to create the source right now.",
      success: null,
    };
  }

  return {
    error: null,
    success: `Created ${responsePayload?.name ?? requestBody.name}.`,
  };
};
