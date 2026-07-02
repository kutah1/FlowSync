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
        // Primary brand (violet) — consolidates the ad-hoc #6554E8 / #635BFF / #5B4BDB
        brand: {
          DEFAULT: "#6554E8",
          dark: "#5041C4",
          light: "#8A74FF",
          soft: "#F2F0FF",
        },
        // App surfaces
        sand: "#F7F6F5",
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
