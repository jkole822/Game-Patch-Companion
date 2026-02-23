// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import storybook from "eslint-plugin-storybook";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  ...storybook.configs["flat/recommended"].map((config) => ({
    ...config,
    files: ["**/*.stories.tsx"],
    rules: {
      ...config.rules,
      "no-console": "off",
      "react-hooks/rules-of-hooks": "off",
      "storybook/context-in-play-function": "off",
    },
  })),
]);

export default eslintConfig;
