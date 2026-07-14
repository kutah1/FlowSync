/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Plus Jakarta Sans",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        // Primary brand (violet) — the ONLY violet. Replaces the ad-hoc
        // #635BFF / #5B4BDB / #6B5BEB / violet-600 / indigo-600 drift.
        brand: {
          DEFAULT: "#6554E8",
          dark: "#5041C4",
          light: "#8A74FF",
          soft: "#F2F0FF",
          deep: "#24006D",
        },
        // App surfaces — one cream, not six
        sand: {
          DEFAULT: "#F7F6F5",
          field: "#F6F3EF", // input fill
          deep: "#ECE9E7", // recessed panels
        },
        // Accent surfaces. `ink` is the text/icon color that passes AA on it.
        mint: {
          DEFAULT: "#D7F0CB",
          ink: "#41603C",
        },
        blush: {
          DEFAULT: "#F8D8EB",
          ink: "#7A3B5E",
        },
        mauve: "#8D7785",
        // Cycle phase colors
        phase: {
          follicular: "#22C55E",
          ovulation: "#F59E0B",
          luteal: "#8B5CF6",
          menstrual: "#EC4899",
        },
      },
      maxWidth: {
        content: "72ch",
      },
      boxShadow: {
        brand: "0 12px 30px rgba(101,84,232,0.28)",
      },
    },
  },
  plugins: [],
}
