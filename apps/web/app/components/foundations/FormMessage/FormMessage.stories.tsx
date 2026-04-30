import { FormMessage } from "./FormMessage";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Foundations/FormMessage",
  component: FormMessage,
  args: {},
  argTypes: {},
} satisfies Meta<typeof FormMessage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Error: Story = {
  args: {
    error:
      "Lorem ipsum dolor sit amet consectetur adipiscing, elit inceptos lacus mollis accumsan.",
  },
};

export const Success: Story = {
  args: {
    success:
      "Lorem ipsum dolor sit amet consectetur adipiscing, elit inceptos lacus mollis accumsan.",
  },
};
