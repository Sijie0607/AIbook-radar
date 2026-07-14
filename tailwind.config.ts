import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f7f8f6",
        ink: "#18212f",
        muted: "#667085",
        line: "#d8dee8",
        subtle: "#e5e9ef",
        primary: {
          DEFAULT: "#176b87",
          dark: "#0f4e63",
          soft: "#e7f5f3",
        },
      },
      boxShadow: {
        editorial: "0 18px 45px rgba(24, 33, 47, 0.1)",
      },
      borderRadius: {
        panel: "8px",
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
