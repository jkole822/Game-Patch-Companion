import { Binoculars, Eye, Gamepad2 } from "lucide-react";

import { FeatureCard } from "./FeatureCard";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Foundations/FeatureCard",
  component: FeatureCard,
  args: {
    title: "Watch Any Update",
    description:
      "Get alerts for your classes, dungeons, legendaries, and anything else in your watchlists.",
    icon: <Eye size={22} strokeWidth={2.2} />,
  },
  argTypes: {
    icon: {
      control: false,
    },
  },
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "night",
      values: [{ name: "night", value: "#070811" }],
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,rgba(108,71,255,0.2),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(69,88,255,0.16),transparent_45%),linear-gradient(180deg,#06070f_0%,#090c18_45%,#070811_100%)] p-6 md:p-12">
        <div className="mx-auto max-w-5xl">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof FeatureCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ThreeUp: Story = {
  render: () => {
    const cards = [
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

    return (
      <div className="grid gap-5 lg:grid-cols-3">
        {cards.map((card) => (
          <FeatureCard key={card.title} {...card} />
        ))}
      </div>
    );
  },
};
