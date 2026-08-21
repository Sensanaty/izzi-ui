import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";
import skipFormatting from "eslint-config-prettier/flat";
import pluginOxlint from "eslint-plugin-oxlint";
import pluginVue from "eslint-plugin-vue";
import { globalIgnores } from "eslint/config";

import type { Linter } from "eslint";

export default defineConfigWithVueTs(
  {
    name: "app/files-to-lint",
    files: ["**/*.{vue,ts,mts,tsx}"],
    rules: {
      "vue/max-attributes-per-line": ["warn", { singleline: 5, multiline: 1 }],
      "@typescript-eslint/no-unused-vars": "off",
      "vue/block-order": [
        "warn",
        {
          order: ["template", "script", "style"],
        },
      ],
      "padding-line-between-statements": [
        "warn",
        { blankLine: "always", prev: "*", next: "return" },
        { blankLine: "always", prev: "*", next: "block-like" },
        { blankLine: "always", prev: "block-like", next: "*" },
        { blankLine: "always", prev: "*", next: "if" },
        { blankLine: "always", prev: "if", next: "*" },
        { blankLine: "any", prev: "if", next: "if" },
      ],
    },
  },

  globalIgnores(["**/dist/**", "**/dist-ssr/**", "**/coverage/**"]),

  ...pluginVue.configs["flat/strongly-recommended"],
  vueTsConfigs.recommended,
  ...pluginOxlint.buildFromOxlintConfigFile(".oxlintrc.json"),

  skipFormatting,
) as Linter.Config[];
