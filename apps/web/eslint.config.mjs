// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import importPlugin from "eslint-plugin-import";
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

  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/build/**",
      "**/.turbo/**",
      "**/coverage/**",
      "**/.output/**",
      "**/drizzle/**",
    ],
    plugins: {
      import: importPlugin,
    },
    rules: {
      /* TypeScript */
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/ban-ts-comment": "warn",

      /* Imports */
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index", "type"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["*.ts", "*.tsx", "*.js", "*.jsx", "*.mjs", "*.cjs"],
              message: "Do not include file extensions in import/export specifiers.",
            },
          ],
        },
      ],

      /* Code quality */
      "no-nested-ternary": "error",
      "prefer-const": "error",
    },
  },

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
