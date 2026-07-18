import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#faf8f2",
        ink: "#18212f",
        muted: "#667085",
        line: "#e4e7ec",
        subtle: "#ebe6dc",
        primary: {
          DEFAULT: "#2e5930",
          dark: "#1e3f20",
          soft: "#e8f0e8",
        },
      },
      boxShadow: {
        editorial: "0 18px 45px rgba(24, 33, 47, 0.08)",
      },
      borderRadius: {
        panel: "8px",
      },
      keyframes: {
        "pulse-core-green": {
          "0%, 100%": { transform: "scale(0.88)", opacity: "0.45" },
          "50%": { transform: "scale(1.08)", opacity: "0.7" },
        },
        "pulse-select-ring": {
          "0%, 100%": { opacity: "0.35", transform: "scale(0.96)" },
          "50%": { opacity: "0.9", transform: "scale(1.04)" },
        },
      },
      animation: {
        "pulse-core-green": "pulse-core-green 9s ease-in-out infinite",
        "pulse-select-ring": "pulse-select-ring 2.4s ease-in-out infinite",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "PingFang SC",
          "Hiragino Sans GB",
          "Microsoft YaHei",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
