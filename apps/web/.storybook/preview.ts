import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { createElement } from "react";

import type { Preview } from "@storybook/nextjs-vite";
import "../app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const preview: Preview = {
  decorators: [
    (Story) =>
      createElement(
        "div",
        {
          className: `${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} antialiased`,
        },
        createElement(Story),
      ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
      image: {
        unoptimized: true,
      },
    },
  },
};

export default preview;
