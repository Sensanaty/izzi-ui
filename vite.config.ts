import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueMacros from "unplugin-vue-macros/vite";

const resolvedPath = path.resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueMacros({
      plugins: {
        vue: vue({
          include: [/\.vue$/],
          reactivityTransform: true
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
