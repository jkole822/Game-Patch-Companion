import { DatabaseZap, ShieldCheck } from "lucide-react";

import { Container } from "@/components";

import type { ResourceManagementLayoutProps } from "./ResourceManagementLayout.types";

export const ResourceManagementLayout = ({
  badgeIcon: BadgeIcon = ShieldCheck,
  badgeLabel = "Admin",
  children,
  description,
  formEyebrow,
  formTitle,
  heading,
  sidebarContent,
  supportCopy,
  supportIcon: SupportIcon = DatabaseZap,
}: ResourceManagementLayoutProps) => {
  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundImage: "url(/gpc-background.png)" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(145,92,255,0.18),transparent_40%),linear-gradient(180deg,rgba(7,10,18,0.2),rgba(7,10,18,0.88))]" />
      <div className="page-margins relative flex flex-col gap-8 pt-8 pb-16 sm:pt-12">
        <section className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
          <Container className="w-full" contentClassName="space-y-6 p-7 sm:p-10">
            <div className="border-primary/35 bg-primary/10 text-primary-light inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.24em] uppercase">
              <BadgeIcon className="size-3.5" />
              {badgeLabel}
            </div>
            <div className="space-y-3">
              <h1 className="hs-1">{heading}</h1>
              <p className="text-text-muted max-w-xl text-base leading-7 sm:text-lg">
                {description}
              </p>
            </div>

            {supportCopy ? (
              <div className="border-border bg-surface-alt/75 rounded-3xl border px-5 py-5">
                <SupportIcon className="text-primary-light mb-4 size-6" />
                <div className="text-text-muted text-sm leading-6">{supportCopy}</div>
              </div>
            ) : null}

            {sidebarContent}
          </Container>

          <Container className="w-full" contentClassName="space-y-6 p-7 sm:p-8">
            <div className="space-y-2">
              <p className="eyebrow">{formEyebrow}</p>
              <h2 className="hs-2">{formTitle}</h2>
            </div>
            {children}
          </Container>
        </section>
      </div>
    </main>
  );
};
