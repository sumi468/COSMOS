"use server";

import { cookies } from "next/headers";
import { isLocale } from "@/lib/language";
import { LOCALE_COOKIE } from "@/lib/localization";
import { isTheme, THEME_COOKIE } from "@/lib/theme";

const preferenceCookie = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
  secure: process.env.NODE_ENV === "production"
} as const;

export async function setLanguage(data: FormData) {
  const language = data.get("language");
  if (!isLocale(language)) return;

  cookies().set(LOCALE_COOKIE, language, preferenceCookie);
}

export async function setTheme(data: FormData) {
  const theme = data.get("theme");
  if (!isTheme(theme)) return;

  cookies().set(THEME_COOKIE, theme, preferenceCookie);
}
