"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getAuthCookieHeader } from "@/lib/auth";
import { getApiBaseUrl } from "@/lib/utils";

import { INITIAL_GAME_ACTION_STATE } from "../_components/GameForm.types";
import { buildGamePayload } from "../_components/GameForm.utils";

import type { GameActionState } from "../_components/GameForm.types";

export const createGameAction = async (
  _: GameActionState = INITIAL_GAME_ACTION_STATE,
  formData: FormData,
): Promise<GameActionState> => {
  const cookieStore = await cookies();
  const authCookieHeader = getAuthCookieHeader(cookieStore);

  if (!authCookieHeader) {
    redirect("/login");
  }

  const { error, payload: requestBody } = buildGamePayload(formData);

  if (error || !requestBody) {
    return {
      error: error ?? "Please check the game fields and try again.",
      success: null,
    };
  }

  let response: Response;
  let responsePayload: {
    key?: string;
    message?: string;
    title?: string;
  } | null;

  try {
    response = await fetch(`${getApiBaseUrl()}/games/create`, {
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
      title?: string;
    } | null;
  } catch {
    return {
      error: "Unable to create the game right now.",
      success: null,
    };
  }

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    return {
      error: responsePayload?.message ?? "Unable to create the game right now.",
      success: null,
    };
  }

  return {
    error: null,
    success: `Created ${responsePayload?.title ?? requestBody.title}.`,
  };
};
