import { Link } from "./Link";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Foundations/Link",
  component: Link,
  args: {
    children: "Lorem ipsum",
    href: "#",
    target: "_blank",
  },
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
