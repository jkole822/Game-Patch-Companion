import { Activity, Plus, RadioTower, ShieldCheck } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { CollectionsPageLayout, Container } from "@/components";
import { getAuthCookieHeader } from "@/lib/auth";
import { getApiBaseUrl } from "@/lib/utils";

import { SourceFeatureGrid } from "./_components/SourceFeatureGrid";
import { SourceStatGrid } from "./_components/SourceStatGrid";
import { SourceSummaryCards } from "./_components/SourceSummaryCards";

import type { SourceRecord } from "./_components/SourceForm.types";
import type { SourceFeature, SourceStat } from "./sources.types";

const EMPTY_SOURCES: SourceRecord[] = [];

const fetchSources = async (cookieHeader: string) => {
  try {
    const response = await fetch(`${getApiBaseUrl()}/sources/find-many`, {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (response.status === 401) {
      return {
        data: EMPTY_SOURCES,
        ok: false,
        unauthorized: true,
      };
    }

    if (!response.ok) {
      return {
        data: EMPTY_SOURCES,
        ok: false,
      };
    }

    return {
      data: (await response.json()) as SourceRecord[],
      ok: true,
    };
  } catch {
    return {
      data: EMPTY_SOURCES,
      ok: false,
    };
  }
};

export default async function SourcesPage() {
  const cookieStore = await cookies();
  const authCookieHeader = getAuthCookieHeader(cookieStore);

  if (!authCookieHeader) {
    redirect("/login");
  }

  const sourcesResult = await fetchSources(authCookieHeader);

  if (sourcesResult.unauthorized) {
    redirect("/login");
  }

  const sources = [...sourcesResult.data].sort((left, right) =>
    left.name.localeCompare(right.name),
  );

  const enabledCount = sources.filter((source) => source.isEnabled).length;
  const partialData = !sourcesResult.ok;

  const features: SourceFeature[] = [
    {
      icon: Plus,
      description:
        "Register a new HTML, RSS, or API source and provide the ingest config it needs.",
      title: "Add a source",
    },
    {
      icon: Activity,
      description:
        "Update selectors, JSON config, and enabled state without rebuilding the entire source from scratch.",
      title: "Edit safely",
    },
    {
      icon: RadioTower,
      description:
        "Use the origin links below to quickly inspect whether a source still points at the right public page or feed.",
      title: "Check feed health",
    },
  ];

  const stats: SourceStat[] = [
    {
      description: "Registered source records",
      eyebrow: "Total",
      value: sources.length,
    },
    {
      description: "Currently available to ingest",
      eyebrow: "Enabled",
      value: enabledCount,
    },
    {
      description: "Saved without active ingest",
      eyebrow: "Disabled",
      value: sources.length - enabledCount,
    },
  ];

  return (
    <CollectionsPageLayout
      createHref="/admin/sources/create"
      description="Review ingest sources, check which feeds are active, and jump straight into source configuration updates."
      eyebrow="Admin"
      gridClassName="xl:grid-cols-[1.15fr_0.85fr]"
      icon={ShieldCheck}
      leftPanelContent={<SourceStatGrid stats={stats} />}
      partialData={partialData}
      resourceLabelPlural="sources"
      resourceLabelSingular="source"
      rightPanelEyebrow="Source workflow"
      rightPanelTitle="Admin actions"
      rightPanelContent={<SourceFeatureGrid features={features} />}
      title="Sources"
    >
      <section>
        <Container className="w-full" contentClassName="space-y-6 p-7 sm:p-8">
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="eyebrow">Source inventory</p>
              <h2 className="hs-2">Configured feeds</h2>
            </div>
            <p className="text-text-muted text-sm">{sources.length} sources loaded</p>
          </div>

          {sources.length > 0 ? (
            <SourceSummaryCards sources={sources} />
          ) : (
            <div className="border-border text-text-muted rounded-3xl border border-dashed px-5 py-8 text-sm leading-6">
              No sources have been configured yet. Create your first source to start wiring feeds
              into the ingest pipeline.
            </div>
          )}
        </Container>
      </section>
    </CollectionsPageLayout>
  );
}
