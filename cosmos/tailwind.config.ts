import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cosmos: {
          bg: "rgb(var(--cosmos-bg) / <alpha-value>)",
          surface: "rgb(var(--cosmos-surface) / <alpha-value>)",
          inset: "rgb(var(--cosmos-inset) / <alpha-value>)",
          line: "rgb(var(--cosmos-line) / <alpha-value>)",
          ink: "rgb(var(--cosmos-ink) / <alpha-value>)",
          muted: "rgb(var(--cosmos-muted) / <alpha-value>)",
          accent: "rgb(var(--cosmos-accent) / <alpha-value>)",
          teal: "rgb(var(--cosmos-teal) / <alpha-value>)",
          warning: "rgb(var(--cosmos-warning) / <alpha-value>)"
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"]
      },
      maxWidth: {
        shell: "1180px"
      },
      letterSpacing: {
        widest2: "0.18em"
      }
    }
  },
  plugins: []
};
export default config;
