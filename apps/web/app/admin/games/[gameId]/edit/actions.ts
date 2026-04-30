"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getAuthCookieHeader } from "@/lib/auth";
import { getApiBaseUrl } from "@/lib/utils";

import { INITIAL_GAME_ACTION_STATE } from "../../_components/GameForm.types";
import { buildGamePayload } from "../../_components/GameForm.utils";

import type { GameActionState } from "../../_components/GameForm.types";

export const updateGameAction = async (
  gameId: string,
  _: GameActionState = INITIAL_GAME_ACTION_STATE,
  formData: FormData,
): Promise<GameActionState> => {
  const cookieStore = await cookies();
  const authCookieHeader = getAuthCookieHeader(cookieStore);

  if (!authCookieHeader) {
    redirect("/login");
  }

  const { error, payload } = buildGamePayload(formData);

  if (error || !payload) {
    return {
      error: error ?? "Please check the game fields and try again.",
      success: null,
    };
  }

  let response: Response;
  let responsePayload: {
    message?: string;
    title?: string;
  } | null;

  try {
    response = await fetch(`${getApiBaseUrl()}/games/update/${gameId}`, {
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
      title?: string;
    } | null;
  } catch {
    return {
      error: "Unable to update the game right now.",
      success: null,
    };
  }

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    return {
      error: responsePayload?.message ?? "Unable to update the game right now.",
      success: null,
    };
  }

  return {
    error: null,
    success: `Updated ${responsePayload?.title ?? payload.title}.`,
  };
};

export const deleteGameAction = async (
  gameId: string,
  _: GameActionState = INITIAL_GAME_ACTION_STATE,
  _formData: FormData,
): Promise<GameActionState> => {
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
    response = await fetch(`${getApiBaseUrl()}/games/delete/${gameId}`, {
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
      error: "Unable to delete the game right now.",
      success: null,
    };
  }

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    return {
      error: responsePayload?.message ?? "Unable to delete the game right now.",
      success: null,
    };
  }

  redirect("/admin/games");
};
