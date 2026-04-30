import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { FieldGuidePanel, ResourceManagementLayout } from "@/components";
import { getAuthCookieHeader, hasAuthCookie } from "@/lib/auth";
import { getApiBaseUrl } from "@/lib/utils";

import { GAME_FIELD_GUIDE_SECTIONS } from "../../_components/GameFieldGuide";
import { GameForm } from "../../_components/GameForm";

import { deleteGameAction, updateGameAction } from "./actions";

import type { GameRecord } from "../../_components/GameForm.types";

const getGame = async (gameId: string): Promise<GameRecord> => {
  const cookieStore = await cookies();
  const authCookieHeader = getAuthCookieHeader(cookieStore);

  if (!authCookieHeader) {
    redirect("/login");
  }

  const response = await fetch(`${getApiBaseUrl()}/games/find-one/${gameId}`, {
    headers: {
      Cookie: authCookieHeader,
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    redirect("/login");
  }

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Unable to load game.");
  }

  return (await response.json()) as GameRecord;
};

export default async function EditGamePage({ params }: { params: Promise<{ gameId: string }> }) {
  const cookieStore = await cookies();

  if (!hasAuthCookie(cookieStore)) {
    redirect("/login");
  }

  const { gameId } = await params;
  const game = await getGame(gameId);

  return (
    <ResourceManagementLayout
      description="Update a canonical game record without rebuilding the related watchlists and patch entry references around it."
      formEyebrow="Game details"
      formTitle="Edit game record"
      heading="Edit game"
      supportCopy="Game updates and deletions are limited to admin accounts. The API will reject these actions when the signed-in user does not have access."
      sidebarContent={<FieldGuidePanel sections={GAME_FIELD_GUIDE_SECTIONS} />}
    >
      <GameForm
        action={updateGameAction.bind(null, gameId)}
        cancelHref="/admin/games"
        deleteAction={deleteGameAction.bind(null, gameId)}
        initialGame={game}
        submitLabel="Save changes"
      />
    </ResourceManagementLayout>
  );
}
