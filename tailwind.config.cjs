/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}"
  ],
  theme: {
    extend: { },
    fontFamily: {
      'mono': ["Aeonik", "JetBrains Mono NL", "JetBrains Mono", "Roboto Mono", "monospace"]
    }
  },
  plugins: [],
}
