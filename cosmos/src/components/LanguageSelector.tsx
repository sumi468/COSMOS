"use client";

import { useFormStatus } from "react-dom";
import { setLanguage } from "@/app/settings/actions";
import { useLanguage } from "@/components/LanguageProvider";
import { LANGUAGES } from "@/lib/language";

const languageNames = { en: "English", ja: "日本語" };

export default function LanguageSelector() {
  return (
    <form action={setLanguage} className="mb-8 max-w-lg">
      <LanguageOptions />
    </form>
  );
}

function LanguageOptions() {
  const { locale, copy } = useLanguage();
  const { pending } = useFormStatus();

  return (
    <fieldset disabled={pending}>
      <legend className="font-display text-lg text-white mb-3">{copy.languageLabel}</legend>
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((language) => (
          <button
            key={language}
            type="submit"
            name="language"
            value={language}
            lang={language}
            aria-pressed={locale === language}
            className="motion-control rounded-full border border-cosmos-line px-4 py-2 text-sm text-cosmos-muted hover:text-white aria-pressed:border-cosmos-ice/40 aria-pressed:bg-cosmos-ice/10 aria-pressed:text-cosmos-ice disabled:opacity-60"
          >
            {languageNames[language]}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
