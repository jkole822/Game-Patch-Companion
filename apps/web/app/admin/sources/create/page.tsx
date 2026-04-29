import { DatabaseZap, ShieldCheck } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Container } from "@/components";
import { hasAuthCookie } from "@/lib/auth";

import { SOURCE_CREATE_FIELD_GUIDE, SOURCE_CREATE_FIELD_GUIDE_GROUPS } from "./fieldGuide";
import { SourceCreateForm } from "./SourceCreateForm";

export default async function CreateSourcePage() {
  const cookieStore = await cookies();

  if (!hasAuthCookie(cookieStore)) {
    redirect("/login");
  }

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
              <ShieldCheck className="size-3.5" />
              Admin
            </div>
            <div className="space-y-3">
              <h1 className="hs-1">Create source</h1>
              <p className="text-text-muted max-w-xl text-base leading-7 sm:text-lg">
                Register a source for the ingest pipeline and keep patch discovery pointed at the
                right feeds.
              </p>
            </div>
            <div className="border-border bg-surface-alt/75 rounded-3xl border px-5 py-5">
              <DatabaseZap className="text-primary-light mb-4 size-6" />
              <p className="text-text-muted text-sm leading-6">
                Source creation is limited to admin accounts. The API will reject this submission
                when the signed-in user does not have access.
              </p>
            </div>
            <div className="border-border bg-surface-alt/75 rounded-3xl border px-5 py-5">
              <div className="space-y-2">
                <h2 className="font-display text-xl font-semibold text-white">Field guide</h2>
                <p className="text-text-muted text-sm leading-6">
                  Each form control is linked to its matching note here so the guidance stays
                  visible without crowding the form.
                </p>
              </div>
              <div className="mt-5 space-y-5">
                {SOURCE_CREATE_FIELD_GUIDE_GROUPS.map((group) => (
                  <section key={group.title} className="space-y-3">
                    <h3 className="text-primary-light text-xs font-semibold tracking-[0.2em] uppercase">
                      {group.title}
                    </h3>
                    <dl className="space-y-3">
                      {group.fields.map((fieldKey) => {
                        const field = SOURCE_CREATE_FIELD_GUIDE[fieldKey];

                        return (
                          <div key={field.id} className="space-y-1">
                            <dt className="text-sm font-semibold text-white">{field.fieldLabel}</dt>
                            <dd className="text-text-muted text-sm leading-6" id={field.id}>
                              {field.text}
                            </dd>
                          </div>
                        );
                      })}
                    </dl>
                  </section>
                ))}
              </div>
            </div>
          </Container>

          <Container className="w-full" contentClassName="space-y-6 p-7 sm:p-8">
            <div className="space-y-2">
              <p className="text-primary-light text-xs font-semibold tracking-[0.24em] uppercase">
                Source details
              </p>
              <h2 className="font-display text-3xl font-semibold text-white">New ingest source</h2>
            </div>
            <SourceCreateForm />
          </Container>
        </section>
      </div>
    </main>
  );
}
