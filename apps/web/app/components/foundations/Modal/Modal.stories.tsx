import { Button } from "@/components";

import { Modal } from "./Modal";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Foundations/Modal",
  component: Modal,
  args: {
    title: "Delete watchlist?",
    description: "This action removes the watchlist and all of its tracked filters.",
    trigger: (
      <button
        className="border-border bg-surface-alt text-text hover:border-primary inline-flex cursor-pointer items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        type="button"
      >
        Open Modal
      </button>
    ),
    children: (
      <div className="space-y-4">
        <p className="text-text-muted text-sm leading-relaxed">
          Modals are centered dialogs for focused tasks, confirmations, and short forms.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button>Confirm</Button>
          <Button>Cancel</Button>
        </div>
      </div>
    ),
  },
  argTypes: {
    children: { control: false },
    trigger: { control: false },
  },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render(args) {
    return <Modal {...args} />;
  },
};
