import pluginVue from "eslint-plugin-vue";
import stylistic from "@stylistic/eslint-plugin";
import vueTsEslintConfig from "@vue/eslint-config-typescript";
import tailwind from "eslint-plugin-tailwindcss";

export default [
  {
    plugins: { "@stylistic": stylistic },
  },

  ...pluginVue.configs["flat/recommended"],
  ...vueTsEslintConfig(),
  ...tailwind.configs["flat/recommended"],

  {
    name: "app/files-to-lint",
    files: ["**/*.{js,ts,mjs,mts,tsx,vue}"],
    ignores: ["**/*.json"],
    rules: {
      "@stylistic/quotes": ["warn", "double"],
      "@stylistic/semi": ["warn", "always"],
      "@stylistic/brace-style": ["warn", "1tbs"],
      "@stylistic/comma-dangle": ["warn", "always-multiline"],
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/member-delimiter-style": ["warn", {
        multiline: {
          delimiter: "semi",
          requireLast: true,
        },
        singleline: {
          delimiter: "semi",
          requireLast: false,
        },
      }],
      "@typescript-eslint/no-unused-vars": "off",
      "vue/max-attributes-per-line": ["warn", { singleline: 5, multiline: 1 }],
      "tailwindcss/no-custom-classname": "off",
    },
  },

  {
    name: "app/files-to-ignore",
    ignores: ["**/dist/**", "**/dist-ssr/**", "**/coverage/**"],
  },
];
