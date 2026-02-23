import { FeatureCard, Navigation } from "@/components";
import { sanity } from "@/lib/utils";

import type { LandingPage, SiteSettings } from "@cms/sanity.types";

const landingPageQuery = `*[_type == "landingPage"][0] {
  bottomText,
  featureCards
}`;

const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  navLoggedIn,
  navLoggedOut
}`;

export default async function Home() {
  const landingPage: LandingPage = await sanity.fetch(landingPageQuery);
  const siteSettingsResults: SiteSettings = await sanity.fetch(siteSettingsQuery);
  const navLoggedIn = siteSettingsResults?.navLoggedIn;

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundImage: "url(/gpc-landing-background.png)" }}
    >
      {navLoggedIn && <Navigation {...navLoggedIn} />}
      <div className="page-margins">
        <section className="flex w-full flex-col items-center gap-8">
          <div className="grid w-full gap-5 lg:grid-cols-3">
            {landingPage?.featureCards?.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
          <p className="font-display text-center text-2xl tracking-wide text-white/90 sm:text-3xl">
            {landingPage?.bottomText ?? ""}
          </p>
        </section>
      </div>
    </main>
  );
}
