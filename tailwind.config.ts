import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      colors: {
        // Paleta oaxaqueña
        copal: {
          50: "#FDF8F0",
          100: "#FAF0DC",
          500: "#C17F3A",
          900: "#3D2008",
        },
        grana: {
          50: "#FEF0F0",
          500: "#C0392B",
          900: "#4A0E0E",
        },
        indigo: {
          oax: "#2C3E7A",
        },
        jade: {
          50: "#F0FBF4",
          500: "#1A7A4A",
          900: "#0A2E1C",
        },
      },
      aspectRatio: {
        "3/4": "3 / 4",
      },
    },
  },
  plugins: [],
};
export default config;
