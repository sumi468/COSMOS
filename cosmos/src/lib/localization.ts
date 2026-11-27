import { cookies } from "next/headers";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/language";
import { messages } from "@/lib/messages";
import type { SourceFetchError } from "@/types/cosmos";

export const LOCALE_COOKIE = "cosmos-language";

export function getLocalization() {
  const saved = cookies().get(LOCALE_COOKIE)?.value;
  const locale = isLocale(saved) ? saved : DEFAULT_LOCALE;
  return { locale, copy: messages[locale] };
}

export function formatSourceError({ agency, feed, detail }: SourceFetchError, locale: Locale) {
  const { sourceErrors } = messages[locale];
  const message = feed ? sourceErrors.news(agency, feed) : sourceErrors.events(agency);
  return detail ? `${message}: ${detail}` : message;
}
