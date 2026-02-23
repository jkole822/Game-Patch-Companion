import { Button, FeatureCard, Navigation } from "@/components";
import { sanity } from "@/lib/utils";

import type { LandingPage, SiteSettings } from "@cms/sanity.types";

const landingPageQuery = `*[_type == "landingPage"][0] {
  heading,
  subheading,
  cta,
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
        <section className="flex max-w-190 flex-col gap-3 pt-15 pb-30">
          {Boolean(landingPage?.heading) && (
            <h1 className="font-display text-4xl font-bold capitalize sm:text-6xl">
              {landingPage.heading}
            </h1>
          )}
          {Boolean(landingPage?.subheading) && <p className="text-xl">{landingPage.subheading}</p>}
          {Boolean(landingPage?.cta?.href && landingPage.cta.label) && (
            <Button className="mt-6 translate-x-[12.5%] scale-125" href={landingPage.cta?.href}>
              {landingPage.cta?.label}
            </Button>
          )}
        </section>
        <section className="flex w-full flex-col items-center gap-8">
          <div className="grid w-full gap-5 lg:grid-cols-3">
            {landingPage?.featureCards?.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
          {Boolean(landingPage?.bottomText) && (
            <p className="font-display text-center text-2xl tracking-wide text-white/90 sm:text-3xl">
              {landingPage.bottomText}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
