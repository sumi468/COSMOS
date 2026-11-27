export const LANGUAGES = ["en", "ja"] as const;
export type Locale = (typeof LANGUAGES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "ja";
}
