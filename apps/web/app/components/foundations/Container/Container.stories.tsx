import { Container } from "./Container";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Foundations/Container",
  component: Container,
  args: {
    children: (
      <p>
        Lorem ipsum dolor sit amet consectetur adipiscing elit est purus, libero donec pellentesque
        semper fringilla sollicitudin vehicula tellus, bibendum quis blandit tincidunt cubilia dui
        mauris non. Ad nostra blandit nullam accumsan tincidunt orci senectus semper conubia, montes
        sagittis cum ornare id pretium neque leo praesent, taciti egestas quisque felis aliquam
        potenti vulputate ac. Bibendum donec porttitor elementum sed semper suscipit duis vitae
        torquent, dictum mauris nec enim ligula vivamus quam turpis, feugiat tristique sociis litora
        diam aenean ultricies tempus. Vulputate nam scelerisque ultrices semper velit malesuada
        curabitur, porta donec blandit pellentesque faucibus leo iaculis penatibus, enim pulvinar a
        purus nec senectus. Dis a faucibus non vulputate massa sed sapien facilisis nibh facilisi
        sollicitudin, orci dignissim vehicula lacus mattis consequat erat quam ac parturient libero,
        condimentum lobortis molestie augue etiam enim arcu netus proin donec.
      </p>
    ),
  },
  argTypes: {
    children: {
      control: false,
    },
  },
} satisfies Meta<typeof Container>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
