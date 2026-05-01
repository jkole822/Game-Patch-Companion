import { Boxes, Database, ShieldCheck, Wrench } from "lucide-react";

import { Button, CollectionsPageLayout, Container, FeatureGrid } from "@/components";

import { AdminCardGrid } from "./_components/AdminCardGrid";

import type { AdminCardGridItem } from "./_components/AdminCardGrid.types";
import type { FeatureGridItem } from "@/components/composites/FeatureGrid";

const adminResourceCards: AdminCardGridItem[] = [
  {
    ctaHref: "/admin/games",
    ctaLabel: "Go to games",
    description:
      "Review the canonical title roster, tighten naming, and jump into edits when a game record needs cleanup.",
    icon: Boxes,
    title: "Games",
  },
  {
    ctaHref: "/admin/sources",
    ctaLabel: "Go to sources",
    description:
      "Check feed coverage, confirm enabled sources, and move straight into source configuration updates.",
    icon: Database,
    title: "Sources",
  },
];

const adminWorkflowCards: FeatureGridItem[] = [
  {
    description:
      "Games are the canonical records used across watchlists and patch entries. Sources define where ingest looks for updates.",
    icon: Wrench,
    title: "Start from the resource you need to change",
  },
  {
    description:
      "This hub keeps the global nav tidy while still giving admins a fast path to the tools they use most.",
    icon: ShieldCheck,
    title: "Keep admin navigation contained",
  },
];

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
      leftPanelContent={<AdminCardGrid items={adminResourceCards} />}
      partialData={false}
      resourceLabelPlural="admin resources"
      rightPanelEyebrow="Admin workflow"
      rightPanelTitle="How to use this area"
      rightPanelContent={<FeatureGrid features={adminWorkflowCards} />}
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
