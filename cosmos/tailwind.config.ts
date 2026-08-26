import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cosmos: {
          black: "#05070B",
          navy: "#0A1120",
          panel: "#0F1B2E",
          panel2: "#10192C",
          line: "rgba(255,255,255,0.08)",
          white: "#F4F7FA",
          muted: "#8B96AA",
          ice: "#AEE3F5",
          cyan: "#49D4E8",
          amber: "#F2B15C"
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
