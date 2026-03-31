import { AuthForm } from "./AuthForm";

import type { AuthFormAction } from "./AuthForm.types";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const mockAction: AuthFormAction = async () => ({ error: null });

const meta = {
  title: "Composites/AuthForm",
  component: AuthForm,
  args: {
    action: mockAction,
    title: "Sign In",
    variant: "register",
  },
  argTypes: {
    action: { control: false },
    variant: {
      control: "select",
      options: ["register", "login"],
    },
  },
} satisfies Meta<typeof AuthForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
