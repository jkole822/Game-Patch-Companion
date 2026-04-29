import { Activity, Globe, Plus, RadioTower, ShieldCheck } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Button, Container, Link } from "@/components";
import { getAuthCookieHeader } from "@/lib/auth";
import { getApiBaseUrl } from "@/lib/utils";

import type { SourceRecord } from "./_components/sourceForm.types";

const EMPTY_SOURCES: SourceRecord[] = [];
const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

const formatDate = (value: string | Date) => {
  const timestamp = new Date(value);

  if (Number.isNaN(timestamp.getTime())) {
    return "Date unavailable";
  }

  return DATE_FORMATTER.format(timestamp);
};

const formatTypeLabel = (value: SourceRecord["type"]) => {
  return value.toUpperCase();
};

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

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundImage: "url(/gpc-background.png)" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(145,92,255,0.2),transparent_40%),linear-gradient(180deg,rgba(7,10,18,0.22),rgba(7,10,18,0.84))]" />
      <div className="page-margins relative flex flex-col gap-8 pt-8 pb-16 sm:pt-12">
        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Container className="w-full" contentClassName="space-y-6 p-7 sm:p-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl space-y-4">
                <div className="border-primary/35 bg-primary/10 text-primary-light inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.24em] uppercase">
                  <ShieldCheck className="size-3.5" />
                  Admin
                </div>
                <div className="space-y-3">
                  <h1 className="hs-1">Sources</h1>
                  <p className="text-text-muted max-w-xl text-base leading-7 sm:text-lg">
                    Review ingest sources, check which feeds are active, and jump straight into
                    source configuration updates.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button href="/admin/sources/create">Create source</Button>
                <Button href="/dashboard">Back to dashboard</Button>
              </div>
            </div>

            {partialData && (
              <div className="border-warning/45 bg-warning/10 text-text rounded-2xl border px-4 py-3 text-sm leading-6">
                Some source data could not be loaded, so this view may be incomplete.
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-3">
              <div className="border-border bg-surface/80 rounded-[1.75rem] border px-5 py-5">
                <p className="text-primary-light text-xs font-semibold tracking-[0.22em] uppercase">
                  Total
                </p>
                <p className="font-display mt-3 text-4xl text-white">{sources.length}</p>
                <p className="text-text-muted mt-2 text-sm">Registered source records</p>
              </div>
              <div className="border-border bg-surface/80 rounded-[1.75rem] border px-5 py-5">
                <p className="text-primary-light text-xs font-semibold tracking-[0.22em] uppercase">
                  Enabled
                </p>
                <p className="font-display mt-3 text-4xl text-white">{enabledCount}</p>
                <p className="text-text-muted mt-2 text-sm">Currently available to ingest</p>
              </div>
              <div className="border-border bg-surface/80 rounded-[1.75rem] border px-5 py-5">
                <p className="text-primary-light text-xs font-semibold tracking-[0.22em] uppercase">
                  Disabled
                </p>
                <p className="font-display mt-3 text-4xl text-white">
                  {sources.length - enabledCount}
                </p>
                <p className="text-text-muted mt-2 text-sm">Saved without active ingest</p>
              </div>
            </div>
          </Container>

          <Container className="w-full" contentClassName="space-y-6 p-7 sm:p-8">
            <div className="space-y-2">
              <p className="text-primary-light text-xs font-semibold tracking-[0.24em] uppercase">
                Source workflow
              </p>
              <h2 className="font-display text-3xl font-semibold text-white">Admin actions</h2>
            </div>

            <div className="space-y-4">
              <div className="border-border bg-surface/80 rounded-[1.75rem] border px-5 py-5">
                <div className="flex items-start gap-3">
                  <Plus className="text-primary-light mt-0.5 size-5" />
                  <div className="space-y-2">
                    <h3 className="font-display text-xl text-white">Add a source</h3>
                    <p className="text-text-muted text-sm leading-6">
                      Register a new HTML, RSS, or API source and provide the ingest config it
                      needs.
                    </p>
                  </div>
                </div>
              </div>
              <div className="border-border bg-surface/80 rounded-[1.75rem] border px-5 py-5">
                <div className="flex items-start gap-3">
                  <Activity className="text-primary-light mt-0.5 size-5" />
                  <div className="space-y-2">
                    <h3 className="font-display text-xl text-white">Edit safely</h3>
                    <p className="text-text-muted text-sm leading-6">
                      Update selectors, JSON config, and enabled state without rebuilding the entire
                      source from scratch.
                    </p>
                  </div>
                </div>
              </div>
              <div className="border-border bg-surface/80 rounded-[1.75rem] border px-5 py-5">
                <div className="flex items-start gap-3">
                  <RadioTower className="text-primary-light mt-0.5 size-5" />
                  <div className="space-y-2">
                    <h3 className="font-display text-xl text-white">Check feed health</h3>
                    <p className="text-text-muted text-sm leading-6">
                      Use the origin links below to quickly inspect whether a source still points at
                      the right public page or feed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section>
          <Container className="w-full" contentClassName="space-y-6 p-7 sm:p-8">
            <div className="flex items-end justify-between gap-4">
              <div className="space-y-2">
                <p className="text-primary-light text-xs font-semibold tracking-[0.24em] uppercase">
                  Source inventory
                </p>
                <h2 className="font-display text-3xl font-semibold text-white">Configured feeds</h2>
              </div>
              <p className="text-text-muted text-sm">{sources.length} sources loaded</p>
            </div>

            {sources.length > 0 ? (
              <div className="grid gap-4 xl:grid-cols-2">
                {sources.map((source) => (
                  <article
                    className="border-border bg-surface/80 rounded-[1.75rem] border px-5 py-5"
                    key={source.id}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-primary-light text-xs font-semibold tracking-[0.22em] uppercase">
                            {formatTypeLabel(source.type)}
                          </span>
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
                        <h3 className="font-display text-2xl text-white">{source.name}</h3>
                        <p className="text-text-muted font-mono text-xs">{source.key}</p>
                      </div>
                      <p className="text-text-muted text-right text-xs tracking-[0.18em] uppercase">
                        Created
                        <span className="mt-2 block tracking-normal normal-case">
                          {formatDate(source.createdAt)}
                        </span>
                      </p>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-[auto_1fr]">
                      <div className="text-text-muted text-xs font-semibold tracking-[0.18em] uppercase">
                        Base URL
                      </div>
                      <div className="text-text text-sm leading-6 break-all">{source.baseUrl}</div>
                    </div>

                    {source.type === "html" && (
                      <div className="mt-3 grid gap-3 sm:grid-cols-[auto_1fr]">
                        <div className="text-text-muted text-xs font-semibold tracking-[0.18em] uppercase">
                          List path
                        </div>
                        <div className="text-text text-sm leading-6 break-all">
                          {source.config.listPath}
                        </div>
                      </div>
                    )}

                    <div className="mt-5 flex flex-wrap gap-3">
                      <Button href={`/admin/sources/${source.id}/edit`}>Edit source</Button>
                      <Link href={source.baseUrl} rel="noreferrer" target="_blank">
                        <span className="inline-flex items-center gap-2">
                          <Globe className="size-4" />
                          Open origin
                        </span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="border-border text-text-muted rounded-3xl border border-dashed px-5 py-8 text-sm leading-6">
                No sources have been configured yet. Create your first source to start wiring feeds
                into the ingest pipeline.
              </div>
            )}
          </Container>
        </section>
      </div>
    </main>
  );
}
