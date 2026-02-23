import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import storybook from "eslint-plugin-storybook";
import tseslint from "typescript-eslint";

const baseConfig = {
  plugins: {
    import: importPlugin,
    react,
    "react-hooks": reactHooks,
  },
  rules: {
    /* TypeScript */
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/ban-ts-comment": "warn",

    /* Safety */
    "no-debugger": "error",
    "no-console": ["warn", { allow: ["warn", "error"] }],
    eqeqeq: ["error", "always"],

    /* React */
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",

    /* React Hooks */
    ...reactHooks.configs.recommended.rules,
    "react-hooks/set-state-in-effect": "warn",

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
};

export default [
  {
    ignores: [
      "**/.next/**",
      "**/.output/**",
      "**/.turbo/**",
      "**/build/**",
      "**/coverage/**",
      "**/dist/**",
      "**/drizzle/**",
      "**/next-env.d.ts",
      "**/node_modules/**",
      "**/storybook-static/**",
      "apps/cms/**",
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  baseConfig,

  ...storybook.configs["flat/recommended"].map((config) => ({
    ...config,
    files: ["**/*.stories.tsx"],
    rules: {
      ...baseConfig.rules,
      ...config.rules,
      "no-console": "off",
      "react-hooks/rules-of-hooks": "off",
      "storybook/context-in-play-function": "off",
    },
  })),
];
