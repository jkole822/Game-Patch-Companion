import { Drawer } from "./Drawer";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "@/components";

const meta = {
  title: "Foundations/Drawer",
  component: Drawer,
  args: {
    title: "Patch Notes Filters",
    description: "Filter the feed by game, patch version, and content type.",
    trigger: (
      <button
        className="border-border bg-surface-alt text-text hover:border-primary inline-flex cursor-pointer items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        type="button"
      >
        Open Drawer
      </button>
    ),
    children: (
      <div className="space-y-4">
        <p className="text-text-muted text-sm">
          This drawer slides in from the left using Radix Dialog primitives.
        </p>
        <div className="space-y-2">
          <Button>Apply Filters</Button>
          <div>
            <Button>Reset</Button>
          </div>
        </div>
      </div>
    ),
  },
  argTypes: {
    children: { control: false },
    trigger: { control: false },
  },
} satisfies Meta<typeof Drawer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render(args) {
    return <Drawer {...args} />;
  },
};
