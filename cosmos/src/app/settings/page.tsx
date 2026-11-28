import PageShell, { SectionHeading } from "@/components/PageShell";
import PreferenceSelector from "@/components/PreferenceSelector";
import { LANGUAGES } from "@/lib/language";
import { getLocalization } from "@/lib/localization";
import { getTheme, THEMES } from "@/lib/theme";
import { setLanguage, setTheme } from "./actions";

export function generateMetadata() {
  return { title: getLocalization().copy.nav.settings };
}

const LANGUAGE_NAMES = { en: "English", ja: "日本語" };

const SOURCES = [
  { key: "nasaReleases", url: "https://www.nasa.gov/news-release/feed/" },
  { key: "nasaLatest", url: "https://www.nasa.gov/feed/" },
  { key: "nasaArtemis", url: "https://www.nasa.gov/missions/artemis/feed/" },
  { key: "nasaStation", url: "https://www.nasa.gov/missions/station/feed/" },
  { key: "jaxaReleases", url: "https://global.jaxa.jp/rss/press.rdf" },
  { key: "apod", url: "https://science.nasa.gov/feed/apod-basic/" },
  { key: "nasaImages", url: "https://images-api.nasa.gov/" },
  { key: "launchLibrary", url: "https://thespacedevs.com/llapi" }
] as const;

export default function SettingsPage() {
  const { locale, copy } = getLocalization();

  return (
    <PageShell>
      <SectionHeading as="h1" title={copy.nav.settings} />
      <div className="settings-preferences">
        <PreferenceSelector
          name="theme"
          label={copy.settings.theme}
          selected={getTheme()}
          choices={THEMES.map((theme) => ({ value: theme, label: copy.settings.themes[theme], preview: theme }))}
          action={setTheme}
        />
        <PreferenceSelector
          name="language"
          label={copy.settings.language}
          selected={locale}
          choices={LANGUAGES.map((language) => ({ value: language, label: LANGUAGE_NAMES[language], lang: language }))}
          action={setLanguage}
        />
      </div>

      <div className="settings-details">
        <section>
          <h2 className="editorial-title settings-title">{copy.settings.about}</h2>
          <p className="mt-3 text-sm leading-relaxed text-cosmos-muted">{copy.settings.description}</p>
          <p className="mt-4 text-xs leading-relaxed text-cosmos-muted">{copy.settings.independence}</p>
        </section>
        <section>
          <h2 className="editorial-title settings-title">{copy.settings.sources}</h2>
          <ul className="mt-3 divide-y divide-cosmos-line border-y border-cosmos-line">
            {SOURCES.map(({ key, url }) => (
              <li key={key} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span>{copy.sources[key]}</span>
                <a href={url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-xs text-cosmos-accent hover:underline">
                  {copy.settings.visit} &rarr;
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageShell>
  );
}
