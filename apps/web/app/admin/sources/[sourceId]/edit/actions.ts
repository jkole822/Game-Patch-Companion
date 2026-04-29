"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getAuthCookieHeader } from "@/lib/auth";
import { getApiBaseUrl } from "@/lib/utils";

import { INITIAL_SOURCE_ACTION_STATE } from "../../_components/sourceForm.types";
import { buildSourcePayload } from "../../_components/sourceForm.utils";

import type { SourceActionState } from "../../_components/sourceForm.types";

export const updateSourceAction = async (
  sourceId: string,
  _: SourceActionState = INITIAL_SOURCE_ACTION_STATE,
  formData: FormData,
): Promise<SourceActionState> => {
  const cookieStore = await cookies();
  const authCookieHeader = getAuthCookieHeader(cookieStore);

  if (!authCookieHeader) {
    redirect("/login");
  }

  const { error, payload } = buildSourcePayload(formData);

  if (error || !payload) {
    return {
      error: error ?? "Please check the source fields and try again.",
      success: null,
    };
  }

  let response: Response;
  let responsePayload: {
    message?: string;
    name?: string;
  } | null;

  try {
    response = await fetch(`${getApiBaseUrl()}/sources/update/${sourceId}`, {
      method: "PATCH",
      headers: {
        Cookie: authCookieHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    responsePayload = (await response.json().catch(() => null)) as {
      message?: string;
      name?: string;
    } | null;
  } catch {
    return {
      error: "Unable to update the source right now.",
      success: null,
    };
  }

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    return {
      error: responsePayload?.message ?? "Unable to update the source right now.",
      success: null,
    };
  }

  return {
    error: null,
    success: `Updated ${responsePayload?.name ?? payload.name}.`,
  };
};

export const deleteSourceAction = async (
  sourceId: string,
  _: SourceActionState = INITIAL_SOURCE_ACTION_STATE,
  _formData: FormData,
): Promise<SourceActionState> => {
  const cookieStore = await cookies();
  const authCookieHeader = getAuthCookieHeader(cookieStore);

  if (!authCookieHeader) {
    redirect("/login");
  }

  let response: Response;
  let responsePayload: {
    message?: string;
  } | null;

  try {
    response = await fetch(`${getApiBaseUrl()}/sources/delete/${sourceId}`, {
      method: "DELETE",
      headers: {
        Cookie: authCookieHeader,
      },
      cache: "no-store",
    });

    responsePayload = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
  } catch {
    return {
      error: "Unable to delete the source right now.",
      success: null,
    };
  }

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    return {
      error: responsePayload?.message ?? "Unable to delete the source right now.",
      success: null,
    };
  }

  redirect("/admin/sources");
};
