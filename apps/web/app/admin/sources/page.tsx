import { Activity, Globe, Plus, RadioTower, ShieldCheck } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  Button,
  CollectionsPageLayout,
  Container,
  FeatureGrid,
  Link,
  StatGrid,
  SummaryCardGrid,
} from "@/components";
import { getAuthCookieHeader, getCurrentUser } from "@/lib/auth";
import { formatDate, getApiBaseUrl } from "@/lib/utils";

import type { SourceRecord } from "./_components/SourceForm.types";
import type { FeatureGridItem, StatGridItem, SummaryCardGridItem } from "@/components";

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
  const authUser = await getCurrentUser(cookieStore);
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

  const features: FeatureGridItem[] = [
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

  const stats: StatGridItem[] = [
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

  const sourceCards: SummaryCardGridItem[] = sources.map((source) => ({
    details: [
      {
        key: "base-url",
        label: "Base URL",
        value: source.baseUrl,
        valueClassName: "break-all",
      },
      ...(source.type === "html"
        ? [
            {
              key: "list-path",
              label: "List path",
              value: source.config.listPath,
              valueClassName: "break-all",
            },
          ]
        : []),
    ],
    footer: (
      <>
        <Button href={`/admin/sources/${source.id}/edit`}>Edit source</Button>
        <Link href={source.baseUrl} target="_blank">
          <span className="inline-flex items-center gap-2">
            <Globe className="size-4" />
            Open origin
          </span>
        </Link>
      </>
    ),
    header: (
      <>
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow">{source.type.toUpperCase()}</span>
          <span
            className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-[0.18em] uppercase ${
              source.isEnabled
                ? "border-success/40 bg-success/10 text-success"
                : "border-border bg-background/65 text-text-muted"
            }`}
          >
            {source.isEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>
        <h3 className="hs-3">{source.name}</h3>
        <p className="text-text-muted font-mono text-xs">{source.key}</p>
      </>
    ),
    id: source.id,
    meta: (
      <p className="text-text-muted text-right text-xs tracking-[0.18em] uppercase">
        Created
        <span className="mt-2 block tracking-normal normal-case">
          {formatDate(source.createdAt, { invalidValueFallback: "Date unavailable" }) ??
            "Date unavailable"}
        </span>
      </p>
    ),
  }));

  return (
    <CollectionsPageLayout
      description="Review ingest sources, check which feeds are active, and jump straight into source configuration updates."
      eyebrow="Admin"
      gridClassName="xl:grid-cols-[1.15fr_0.85fr]"
      headerActions={
        <div className="flex flex-wrap gap-3">
          <Button href="/admin/sources/create">Create source</Button>
          <Button href="/dashboard">Back to dashboard</Button>
          {authUser?.role === "admin" && <Button href="/admin">Back to admin</Button>}
        </div>
      }
      icon={ShieldCheck}
      leftPanelContent={<StatGrid stats={stats} />}
      partialData={partialData}
      resourceLabelPlural="sources"
      rightPanelEyebrow="Source workflow"
      rightPanelTitle="Admin actions"
      rightPanelContent={<FeatureGrid features={features} />}
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
            <SummaryCardGrid items={sourceCards} />
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
