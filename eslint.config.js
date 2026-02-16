import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,

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
      "import/extensions": [
        "error",
        "never",
        {
          js: "never",
          jsx: "never",
          ts: "never",
          tsx: "never",
          mjs: "never",
          cjs: "never",
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
];
