import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          DEFAULT: "#B85C38",
          50: "#FBEEE7",
          100: "#F3D6C5",
          300: "#DA9C74",
          500: "#B85C38",
          700: "#8F4227",
          900: "#5C2916",
        },
        sand: {
          DEFAULT: "#E8D5C4",
          light: "#F3E8DD",
          dark: "#D9BFA6",
        },
        gold: {
          DEFAULT: "#C9A227",
          light: "#E0C25E",
          dark: "#A3801C",
        },
        offwhite: "#FAF7F2",
        charcoal: "#2D2D2D",
      },
      fontFamily: {
        arabic: ["Cairo", "Noto Naskh Arabic", "sans-serif"],
        heading: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        premium: "0 8px 30px rgba(45,45,45,0.08)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-rtl")],
};

export default config;
