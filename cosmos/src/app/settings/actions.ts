"use server";

import { cookies } from "next/headers";
import { isLocale } from "@/lib/language";
import { LOCALE_COOKIE } from "@/lib/localization";

export async function setLanguage(data: FormData) {
  const language = data.get("language");
  if (!isLocale(language)) return;

  cookies().set(LOCALE_COOKIE, language, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    secure: process.env.NODE_ENV === "production"
  });
}
