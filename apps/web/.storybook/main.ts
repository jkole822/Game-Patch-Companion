import { dirname } from "path";
import { fileURLToPath } from "url";

import { mergeConfig } from "vite";
import svgr from "vite-plugin-svgr";

import type { StorybookConfig } from "@storybook/nextjs-vite";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const config: StorybookConfig = {
  stories: ["../app/components/**/*.mdx", "../app/components/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-vitest"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-onboarding"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/nextjs-vite"),
    options: {
      image: {
        excludeFiles: ["**/*.svg"],
      },
    },
  },
  staticDirs: ["../public"],
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          react: getAbsolutePath("react"),
          "react-dom": getAbsolutePath("react-dom"),
        },
        dedupe: ["react", "react-dom"],
      },
      plugins: [
        svgr({
          include: "**/*.svg?react",
        }),
      ],
    });
  },
};
export default config;
