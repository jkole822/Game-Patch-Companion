import { Navigation } from "./Navigation";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Foundations/Navigation",
  component: Navigation,
  args: {
    links: [
      {
        label: "Home",
        href: "#",
      },
      {
        label: "Dashboard",
        href: "#",
      },
      {
        label: "Watch Lists",
        href: "#",
      },
      {
        label: "Patch Notes",
        href: "#",
      },
      {
        label: "Admin",
        href: "#",
      },
    ],
    cta: {
      label: "Account",
      href: "#",
    },
  },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Navigation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render(args) {
    return (
      <div
        className="min-h-[200vh] min-w-screen"
        style={{ backgroundImage: "url(/gpc-landing-background.png)" }}
      >
        <Navigation {...args} />
      </div>
    );
  },
};
