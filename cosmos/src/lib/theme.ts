import { cookies } from "next/headers";

export const THEMES = ["dark", "light"] as const;
export type Theme = (typeof THEMES)[number];

export const THEME_COOKIE = "cosmos-theme";

export const themeColors: Record<Theme, string> = {
  dark: "#09090e",
  light: "#f6f2ea"
};

export function isTheme(value: unknown): value is Theme {
  return value === "dark" || value === "light";
}

export function getTheme(): Theme {
  const saved = cookies().get(THEME_COOKIE)?.value;
  return isTheme(saved) ? saved : "dark";
}
