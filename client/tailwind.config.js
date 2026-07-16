/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#e8f8f7",
          100: "#c0eeea",
          200: "#8de0da",
          400: "#4ECDC4",
          500: "#38b2ac",
          600: "#2a9d96",
          700: "#1a7a74"
        },
        navy: {
          50:  "#eef0f8",
          100: "#c8ceea",
          600: "#3D4F8A",
          700: "#2d3d7a",
          800: "#1B2A6B",
          900: "#111f55"
        },
        amber: {
          50:  "#fff8e8",
          100: "#fdecc4",
          200: "#fbd98a",
          400: "#FAC858",
          500: "#F5A623",
          600: "#e09412"
        },
        coral: {
          50:  "#fff1ee",
          100: "#fdd5cc",
          200: "#fab5a3",
          400: "#F4845F",
          500: "#E8532A",
          600: "#d44420"
        },
        surface: {
          page:  "#f0f4f8",
          panel: "#ffffff",
          muted: "#e8edf5"
        },
        ink: {
          strong: "#0f1829",
          base:   "#1e2d4a",
          muted:  "#5a6b8a"
        },
        line: "#d0d9e8"
      },
      boxShadow: {
        panel: "0 1px 4px rgba(27,42,107,0.08)",
        card:  "0 2px 12px rgba(27,42,107,0.10)",
        glow:  "0 4px 24px rgba(78,205,196,0.18)"
      }
    }
  },
  plugins: []
};
