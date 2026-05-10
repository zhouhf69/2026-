import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{vue,ts}"],
  theme: {
    extend: {
      colors: {
        medical: {
          900: "#0A1229",
          800: "#111C3D",
          700: "#1A2A59",
          gold: "#D4AF37",
          cyan: "#22D3EE",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
