import { ShieldCheck } from "lucide-react";

import { CollectionsPageLayout } from "./CollectionsPageLayout";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Composites/CollectionsPageLayout",
  component: CollectionsPageLayout,
  argTypes: {
    children: { control: false },
    icon: { control: false },
    leftPanelContent: { control: false },
    partialData: { control: "boolean" },
    rightPanelContent: { control: false },
  },
} satisfies Meta<typeof CollectionsPageLayout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <div>Children</div>,
    createHref: "#",
    description:
      "Review ingest sources, check which feeds are active, and jump straight into source configuration updates.",
    eyebrow: "Admin",
    gridClassName: "xl:grid-cols-[1.15fr_0.85fr]",
    icon: ShieldCheck,
    leftPanelContent: <div>Left Panel Content</div>,
    partialData: true,
    resourceLabelPlural: "sources",
    resourceLabelSingular: "source",
    rightPanelContent: <div>Right Panel Content</div>,
    rightPanelEyebrow: "Source workflow",
    rightPanelTitle: "Admin actions",
    title: "Sources",
  },
};
