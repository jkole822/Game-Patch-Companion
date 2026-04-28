import { Checkbox } from "./Checkbox";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Foundations/Checkbox",
  component: Checkbox,
  args: {
    defaultChecked: true,
    label: "Enabled",
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
