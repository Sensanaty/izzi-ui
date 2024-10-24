import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      "borderColor": { "DEFAULT": "rgb(64 64 64 / 0.6)" },
    },
  },
  plugins: [],
} satisfies Config;

