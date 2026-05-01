import { Activity, Gamepad2, Plus, ShieldCheck } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  Button,
  CollectionsPageLayout,
  Container,
  FeatureGrid,
  StatGrid,
  SummaryCardGrid,
} from "@/components";
import { getAuthCookieHeader } from "@/lib/auth";
import { formatDate, getApiBaseUrl } from "@/lib/utils";

import type { GameRecord } from "./_components/GameForm.types";
import type { FeatureGridItem, StatGridItem, SummaryCardGridItem } from "@/components";

const EMPTY_GAMES: GameRecord[] = [];

const fetchGames = async (cookieHeader: string) => {
  try {
    const response = await fetch(`${getApiBaseUrl()}/games/find-many`, {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (response.status === 401) {
      return {
        data: EMPTY_GAMES,
        ok: false,
        unauthorized: true,
      };
    }

    if (!response.ok) {
      return {
        data: EMPTY_GAMES,
        ok: false,
      };
    }

    return {
      data: (await response.json()) as GameRecord[],
      ok: true,
    };
  } catch {
    return {
      data: EMPTY_GAMES,
      ok: false,
    };
  }
};

export default async function GamesPage() {
  const cookieStore = await cookies();
  const authCookieHeader = getAuthCookieHeader(cookieStore);

  if (!authCookieHeader) {
    redirect("/login");
  }

  const gamesResult = await fetchGames(authCookieHeader);

  if (gamesResult.unauthorized) {
    redirect("/login");
  }

  const games = [...gamesResult.data].sort((left, right) => left.title.localeCompare(right.title));
  const partialData = !gamesResult.ok;
  const thisMonthStart = new Date();
  thisMonthStart.setDate(1);
  thisMonthStart.setHours(0, 0, 0, 0);
  const recentlyAddedCount = games.filter(
    (game) => new Date(game.createdAt).getTime() >= thisMonthStart.getTime(),
  ).length;

  const features: FeatureGridItem[] = [
    {
      icon: Plus,
      description:
        "Add the canonical game titles and keys that watchlists, patch entries, and ingest flows should reference.",
      title: "Create a roster entry",
    },
    {
      icon: Activity,
      description:
        "Adjust naming without rebuilding related resources, keeping downstream references anchored to the same record.",
      title: "Refine metadata",
    },
    {
      icon: Gamepad2,
      description:
        "Review the library in one place before connecting new watchlists or source mappings to a game.",
      title: "Keep coverage tidy",
    },
  ];

  const stats: StatGridItem[] = [
    {
      description: "Registered game records",
      eyebrow: "Total",
      value: games.length,
    },
    {
      description: "Added during the current month",
      eyebrow: "New",
      value: recentlyAddedCount,
    },
    {
      description: "Ready for linking across the app",
      eyebrow: "Keyed",
      value: games.length,
    },
  ];

  const gameCards: SummaryCardGridItem[] = games.map((game) => ({
    details: [
      {
        key: "canonical-title",
        label: "Canonical title",
        value: game.title,
      },
      {
        key: "registry-key",
        label: "Registry key",
        value: game.key,
        valueClassName: "font-mono break-all",
      },
    ],
    footer: <Button href={`/admin/games/${game.id}/edit`}>Edit game</Button>,
    header: (
      <>
        <span className="eyebrow">Game</span>
        <h3 className="hs-3">{game.title}</h3>
        <p className="text-text-muted font-mono text-xs">{game.key}</p>
      </>
    ),
    id: game.id,
    meta: (
      <p className="text-text-muted text-right text-xs tracking-[0.18em] uppercase">
        Created
        <span className="mt-2 block tracking-normal normal-case">
          {formatDate(game.createdAt, { invalidValueFallback: "Date unavailable" }) ??
            "Date unavailable"}
        </span>
      </p>
    ),
  }));

  return (
    <CollectionsPageLayout
      description="Review the canonical game catalog, keep naming consistent, and jump straight into updates when the library changes."
      eyebrow="Admin"
      gridClassName="xl:grid-cols-[1.15fr_0.85fr]"
      headerActions={
        <div className="flex flex-wrap gap-3">
          <Button href="/admin/games/create">Create game</Button>
          <Button href="/dashboard">Back to dashboard</Button>
          <Button href="/admin">Back to admin</Button>
        </div>
      }
      icon={ShieldCheck}
      leftPanelContent={<StatGrid stats={stats} />}
      partialData={partialData}
      resourceLabelPlural="games"
      rightPanelEyebrow="Game workflow"
      rightPanelTitle="Admin actions"
      rightPanelContent={<FeatureGrid features={features} />}
      title="Games"
    >
      <section>
        <Container className="w-full" contentClassName="space-y-6 p-7 sm:p-8">
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="eyebrow">Game inventory</p>
              <h2 className="hs-2">Tracked titles</h2>
            </div>
            <p className="text-text-muted text-sm">{games.length} games loaded</p>
          </div>

          {games.length > 0 ? (
            <SummaryCardGrid items={gameCards} />
          ) : (
            <div className="border-border text-text-muted rounded-3xl border border-dashed px-5 py-8 text-sm leading-6">
              No games have been configured yet. Create your first game record to start linking
              watchlists and patch entries to a canonical title.
            </div>
          )}
        </Container>
      </section>
    </CollectionsPageLayout>
  );
}
