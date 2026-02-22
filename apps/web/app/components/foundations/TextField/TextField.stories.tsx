import { useState } from "react";

import { TextField } from "./TextField";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Foundations/TextField",
  component: TextField,
  args: {
    label: "Username",
    onChange: () => {},
    errorMessage: "Lorem ipsum dolor sit amet consectetur, adipiscing elit est porttitor.",
    name: "username",
    required: true,
    value: "",
  },
  argTypes: {
    type: {
      control: "select",
      options: ["email", "password", "text"],
    },
  },
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render(args) {
    const [value, setValue] = useState("");

    return (
      <div>
        <TextField {...args} onChange={setValue} value={value} />
        <div>Value: {value}</div>
      </div>
    );
  },
};
