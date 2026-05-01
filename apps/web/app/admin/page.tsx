import { Boxes, Database, ShieldCheck, Wrench } from "lucide-react";

import { Button, CollectionsPageLayout, Container } from "@/components";

export default function AdminPage() {
  return (
    <CollectionsPageLayout
      description="Manage the internal resources that power matching, ingest, and admin workflows from one place."
      eyebrow="Admin"
      gridClassName="xl:grid-cols-[1.15fr_0.85fr]"
      headerActions={
        <div className="flex flex-wrap gap-3">
          <Button href="/admin/games">Open games</Button>
          <Button href="/admin/sources">Open sources</Button>
        </div>
      }
      icon={ShieldCheck}
      leftPanelContent={
        <div className="grid gap-4 md:grid-cols-2">
          <Container className="w-full" contentClassName="space-y-4 p-6">
            <div className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <Boxes className="text-primary-light size-5" />
            </div>
            <div className="space-y-2">
              <h2 className="hs-2">Games</h2>
              <p className="text-text-muted text-sm leading-6">
                Review the canonical title roster, tighten naming, and jump into edits when a game
                record needs cleanup.
              </p>
            </div>
            <Button href="/admin/games">Go to games</Button>
          </Container>

          <Container className="w-full" contentClassName="space-y-4 p-6">
            <div className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <Database className="text-primary-light size-5" />
            </div>
            <div className="space-y-2">
              <h2 className="hs-2">Sources</h2>
              <p className="text-text-muted text-sm leading-6">
                Check feed coverage, confirm enabled sources, and move straight into source
                configuration updates.
              </p>
            </div>
            <Button href="/admin/sources">Go to sources</Button>
          </Container>
        </div>
      }
      partialData={false}
      resourceLabelPlural="admin resources"
      rightPanelEyebrow="Admin workflow"
      rightPanelTitle="How to use this area"
      rightPanelContent={
        <div className="space-y-4">
          <div className="border-border bg-surface/80 rounded-[1.75rem] border px-5 py-5">
            <div className="flex items-start gap-3">
              <Wrench className="text-primary-light mt-0.5 size-5" />
              <div className="space-y-2">
                <h3 className="hs-3">Start from the resource you need to change</h3>
                <p className="text-text-muted text-sm leading-6">
                  Games are the canonical records used across watchlists and patch entries. Sources
                  define where ingest looks for updates.
                </p>
              </div>
            </div>
          </div>
          <div className="border-border bg-surface/80 rounded-[1.75rem] border px-5 py-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="text-primary-light mt-0.5 size-5" />
              <div className="space-y-2">
                <h3 className="hs-3">Keep admin navigation contained</h3>
                <p className="text-text-muted text-sm leading-6">
                  This hub keeps the global nav tidy while still giving admins a fast path to the
                  tools they use most.
                </p>
              </div>
            </div>
          </div>
        </div>
      }
      title="Admin"
    >
      <section>
        <Container className="w-full" contentClassName="space-y-4 p-7 sm:p-8">
          <div className="space-y-2">
            <p className="eyebrow">Quick return</p>
            <h2 className="hs-2">Back to the main app</h2>
          </div>
          <p className="text-text-muted text-sm leading-6">
            Once you finish updating internal resources, head back to the dashboard to review the
            live watchlist and patch activity.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/dashboard">Back to dashboard</Button>
            <Button href="/">View landing page</Button>
          </div>
        </Container>
      </section>
    </CollectionsPageLayout>
  );
}
