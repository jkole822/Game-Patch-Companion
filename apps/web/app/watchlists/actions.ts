"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getAuthCookieHeader } from "@/lib/auth";
import { getApiBaseUrl } from "@/lib/utils";

import { INITIAL_WATCHLISTS_PAGE_ACTION_STATE } from "./watchlists.types";
import { buildWatchlistItemPayload, buildWatchlistPayload } from "./watchlists.utils";

import type { WatchlistsPageActionState } from "./watchlists.types";

const revalidateWatchlistViews = () => {
  revalidatePath("/dashboard");
  revalidatePath("/watchlists");
};

const getAuthenticatedHeaders = async () => {
  const cookieStore = await cookies();
  const authCookieHeader = getAuthCookieHeader(cookieStore);

  if (!authCookieHeader) {
    redirect("/login");
  }

  return authCookieHeader;
};

const parseResponseJson = async <T>(response: Response): Promise<T | null> => {
  return (await response.json().catch(() => null)) as T | null;
};

export const createWatchlistAction = async (
  _: WatchlistsPageActionState = INITIAL_WATCHLISTS_PAGE_ACTION_STATE,
  formData: FormData,
): Promise<WatchlistsPageActionState> => {
  const authCookieHeader = await getAuthenticatedHeaders();
  const { error, payload } = buildWatchlistPayload(formData);

  if (error || !payload) {
    return {
      error: error ?? "Please check the watchlist fields and try again.",
      success: null,
    };
  }

  let response: Response;
  let responsePayload: { id?: string; message?: string; name?: string } | null;

  try {
    response = await fetch(`${getApiBaseUrl()}/watchlists/create`, {
      method: "POST",
      headers: {
        Cookie: authCookieHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    responsePayload = await parseResponseJson(response);
  } catch {
    return {
      error: "Unable to create the watchlist right now.",
      success: null,
    };
  }

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok || !responsePayload?.id) {
    return {
      error: responsePayload?.message ?? "Unable to create the watchlist right now.",
      success: null,
    };
  }

  revalidateWatchlistViews();
  redirect(`/watchlists?watchlistId=${responsePayload.id}`);
};

export const updateWatchlistAction = async (
  watchlistId: string,
  _: WatchlistsPageActionState = INITIAL_WATCHLISTS_PAGE_ACTION_STATE,
  formData: FormData,
): Promise<WatchlistsPageActionState> => {
  const authCookieHeader = await getAuthenticatedHeaders();
  const { error, payload } = buildWatchlistPayload(formData);

  if (error || !payload) {
    return {
      error: error ?? "Please check the watchlist fields and try again.",
      success: null,
    };
  }

  let response: Response;
  let responsePayload: { message?: string } | null;

  try {
    response = await fetch(`${getApiBaseUrl()}/watchlists/update/${watchlistId}`, {
      method: "PATCH",
      headers: {
        Cookie: authCookieHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    responsePayload = await parseResponseJson(response);
  } catch {
    return {
      error: "Unable to update the watchlist right now.",
      success: null,
    };
  }

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    return {
      error: responsePayload?.message ?? "Unable to update the watchlist right now.",
      success: null,
    };
  }

  revalidateWatchlistViews();
  redirect(`/watchlists?watchlistId=${watchlistId}`);
};

export const deleteWatchlistAction = async (
  watchlistId: string,
  nextWatchlistId: string | null,
  _: WatchlistsPageActionState = INITIAL_WATCHLISTS_PAGE_ACTION_STATE,
  _formData: FormData,
): Promise<WatchlistsPageActionState> => {
  const authCookieHeader = await getAuthenticatedHeaders();

  let response: Response;
  let responsePayload: { message?: string } | null;

  try {
    response = await fetch(`${getApiBaseUrl()}/watchlists/delete/${watchlistId}`, {
      method: "DELETE",
      headers: {
        Cookie: authCookieHeader,
      },
      cache: "no-store",
    });

    responsePayload = await parseResponseJson(response);
  } catch {
    return {
      error: "Unable to delete the watchlist right now.",
      success: null,
    };
  }

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    return {
      error: responsePayload?.message ?? "Unable to delete the watchlist right now.",
      success: null,
    };
  }

  revalidateWatchlistViews();
  redirect(nextWatchlistId ? `/watchlists?watchlistId=${nextWatchlistId}` : "/watchlists");
};

export const createWatchlistItemAction = async (
  _: WatchlistsPageActionState = INITIAL_WATCHLISTS_PAGE_ACTION_STATE,
  formData: FormData,
): Promise<WatchlistsPageActionState> => {
  const authCookieHeader = await getAuthenticatedHeaders();
  const { error, payload } = buildWatchlistItemPayload(formData);

  if (error || !payload) {
    return {
      error: error ?? "Please check the keyword and try again.",
      success: null,
    };
  }

  let response: Response;
  let responsePayload: { message?: string; watchlistId?: string } | null;

  try {
    response = await fetch(`${getApiBaseUrl()}/watchlist-items/create`, {
      method: "POST",
      headers: {
        Cookie: authCookieHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    responsePayload = await parseResponseJson(response);
  } catch {
    return {
      error: "Unable to add the keyword right now.",
      success: null,
    };
  }

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    return {
      error: responsePayload?.message ?? "Unable to add the keyword right now.",
      success: null,
    };
  }

  revalidateWatchlistViews();
  redirect(`/watchlists?watchlistId=${responsePayload?.watchlistId ?? payload.watchlistId}`);
};

export const updateWatchlistItemAction = async (
  watchlistItemId: string,
  selectedWatchlistId: string,
  _: WatchlistsPageActionState = INITIAL_WATCHLISTS_PAGE_ACTION_STATE,
  formData: FormData,
): Promise<WatchlistsPageActionState> => {
  const authCookieHeader = await getAuthenticatedHeaders();
  const keywordValue = formData.get("keyword");
  const keyword = typeof keywordValue === "string" ? keywordValue.trim() : "";

  if (!keyword) {
    return {
      error: "Keyword is required.",
      success: null,
    };
  }

  let response: Response;
  let responsePayload: { message?: string; watchlistId?: string } | null;

  try {
    response = await fetch(`${getApiBaseUrl()}/watchlist-items/update/${watchlistItemId}`, {
      method: "PATCH",
      headers: {
        Cookie: authCookieHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keyword }),
      cache: "no-store",
    });

    responsePayload = await parseResponseJson(response);
  } catch {
    return {
      error: "Unable to update the keyword right now.",
      success: null,
    };
  }

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    return {
      error: responsePayload?.message ?? "Unable to update the keyword right now.",
      success: null,
    };
  }

  revalidateWatchlistViews();
  redirect(`/watchlists?watchlistId=${responsePayload?.watchlistId ?? selectedWatchlistId}`);
};

export const deleteWatchlistItemAction = async (
  watchlistItemId: string,
  selectedWatchlistId: string,
  _: WatchlistsPageActionState = INITIAL_WATCHLISTS_PAGE_ACTION_STATE,
  _formData: FormData,
): Promise<WatchlistsPageActionState> => {
  const authCookieHeader = await getAuthenticatedHeaders();

  let response: Response;
  let responsePayload: { message?: string } | null;

  try {
    response = await fetch(`${getApiBaseUrl()}/watchlist-items/delete/${watchlistItemId}`, {
      method: "DELETE",
      headers: {
        Cookie: authCookieHeader,
      },
      cache: "no-store",
    });

    responsePayload = await parseResponseJson(response);
  } catch {
    return {
      error: "Unable to delete the keyword right now.",
      success: null,
    };
  }

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    return {
      error: responsePayload?.message ?? "Unable to delete the keyword right now.",
      success: null,
    };
  }

  revalidateWatchlistViews();
  redirect(`/watchlists?watchlistId=${selectedWatchlistId}`);
};
