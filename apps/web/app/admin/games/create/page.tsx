import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { FieldGuidePanel, ResourceManagementLayout } from "@/components";
import { hasAuthCookie } from "@/lib/auth";

import { GAME_FIELD_GUIDE_SECTIONS } from "../_components/GameFieldGuide";
import { GameForm } from "../_components/GameForm";

import { createGameAction } from "./actions";

export default async function CreateGamePage() {
  const cookieStore = await cookies();

  if (!hasAuthCookie(cookieStore)) {
    redirect("/login");
  }

  return (
    <ResourceManagementLayout
      description="Register a canonical game record so watchlists, patch entries, and source mappings all refer to the same title."
      formEyebrow="Game details"
      formTitle="New game record"
      heading="Create game"
      supportCopy="Game creation is limited to admin accounts. The API will reject this submission when the signed-in user does not have access."
      sidebarContent={<FieldGuidePanel sections={GAME_FIELD_GUIDE_SECTIONS} />}
    >
      <GameForm action={createGameAction} cancelHref="/admin/games" submitLabel="Create game" />
    </ResourceManagementLayout>
  );
}
