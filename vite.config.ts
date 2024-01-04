import vue from "@vitejs/plugin-vue";
import path from "path";
import VueMacros from "unplugin-vue-macros/vite";
import { defineConfig } from "vite";

const resolvedPath = path.resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueMacros({
      plugins: {
        vue: vue({
          include: [/\.vue$/],
        }),
      }
    })
  ],
  resolve: {
    alias: {
      "~/": `${resolvedPath}/`,
      "~components/": `${resolvedPath}/components/`,
    }
  }
});
