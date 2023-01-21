/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}"
  ],
  theme: {
    extend: { },
    fontFamily: {
      'mono': ["JetBrains Mono NL", "JetBrains Mono", "Roboto Mono", "monospace"],
      'standard': ["Aeonik", "sans-serif"]
    }
  },
  plugins: [],
}
