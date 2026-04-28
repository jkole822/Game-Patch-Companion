import { useState } from "react";

import { SelectField } from "./SelectField";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Foundations/SelectField",
  component: SelectField,
  args: {
    label: "Source type",
    onChange: () => {},
    errorMessage: "Please choose a source type.",
    name: "type",
    required: true,
    value: "",
  },
} satisfies Meta<typeof SelectField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render(args) {
    const [value, setValue] = useState("");
    const { defaultValue: _defaultValue, onChange: _onChange, value: _value, ...restArgs } = args;

    return (
      <div>
        <SelectField {...restArgs} onChange={setValue} value={value}>
          <option value="">Choose one</option>
          <option value="html">HTML</option>
          <option value="rss">RSS</option>
          <option value="api">API</option>
        </SelectField>
        <div>Value: {value}</div>
      </div>
    );
  },
};
