import { AuthForm } from "./AuthForm";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Composites/AuthForm",
  component: AuthForm,
  args: {
    action: "/api/auth/login",
    title: "Sign In",
    variant: "login",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["register", "login"],
    },
  },
} satisfies Meta<typeof AuthForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
