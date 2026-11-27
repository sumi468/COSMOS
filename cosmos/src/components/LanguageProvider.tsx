"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "@/lib/language";
import type { messages } from "@/lib/messages";

type Messages = (typeof messages)[Locale];

interface Language {
  locale: Locale;
  copy: {
    nav: Messages["nav"];
    languageLabel: string;
    retry: string;
    countdown: Pick<Messages["event"], "inProgress" | "units">;
    newsError: Pick<Messages["news"], "loadFailed" | "retryHint" | "back">;
  };
}

const LanguageContext = createContext<Language | null>(null);

export default function LanguageProvider({ locale, copy, children }: Language & { children: ReactNode }) {
  return <LanguageContext.Provider value={{ locale, copy }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const language = useContext(LanguageContext);
  if (!language) throw new Error("LanguageProvider is required.");
  return language;
}
