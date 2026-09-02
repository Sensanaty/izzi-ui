import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { defineConfig } from "vitest/config";

import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ command }) => ({
  plugins: [tailwindcss(), vue(), ...(command === "serve" ? [vueDevTools()] : [])],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/__tests__/**/*.test.ts"],
  },
}));
