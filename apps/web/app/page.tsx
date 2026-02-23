import { Binoculars, Eye, Gamepad2 } from "lucide-react";

import { FeatureCard } from "@/components";

const features = [
  {
    title: "Watch Any Update",
    description:
      "Get alerts for your classes, dungeons, legendaries, and anything else in your watchlists.",
    icon: <Eye size={22} strokeWidth={2.2} />,
  },
  {
    title: "Exacts, Synonyms or Fuzzy",
    description: "Define keywords, but match updates even when the terms change.",
    icon: <Binoculars size={22} strokeWidth={2.2} />,
  },
  {
    title: "Retail, Classic & More",
    description:
      "Supports Retail, Wrath Classic, Season of Discovery, Burning Crusade, Diablo IV, and more.",
    icon: <Gamepad2 size={22} strokeWidth={2.2} />,
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_10%,rgba(108,71,255,0.2),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(69,88,255,0.16),transparent_45%),linear-gradient(180deg,#06070f_0%,#090c18_45%,#070811_100%)]">
      <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.12)_0.6px,transparent_0.6px)] [background-size:16px_16px] opacity-25" />

      <section className="page-margins relative mx-auto flex min-h-screen max-w-[1400px] items-center py-16">
        <div className="w-full space-y-8">
          <div className="grid gap-5 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>

          <p className="font-display text-center text-2xl tracking-wide text-white/90 sm:text-3xl">
            Secure. Fast. Built for you.
          </p>
        </div>
      </section>
    </main>
  );
}
