import PageShell, { SectionHeading } from "@/components/PageShell";
import LanguageSelector from "@/components/LanguageSelector";
import { getLocalization } from "@/lib/localization";

export function generateMetadata() {
  return { title: getLocalization().copy.nav.settings };
}

const SOURCES = [
  { key: "nasaReleases", url: "https://www.nasa.gov/news-release/feed/" },
  { key: "nasaLatest", url: "https://www.nasa.gov/feed/" },
  { key: "nasaArtemis", url: "https://www.nasa.gov/missions/artemis/feed/" },
  { key: "nasaStation", url: "https://www.nasa.gov/missions/station/feed/" },
  { key: "jaxaReleases", url: "https://global.jaxa.jp/rss/press.rdf" },
  { key: "apod", url: "https://api.nasa.gov/" },
  { key: "nasaImages", url: "https://images-api.nasa.gov/" },
  { key: "launchLibrary", url: "https://thespacedevs.com/llapi" }
] as const;

export default function SettingsPage() {
  const { copy } = getLocalization();

  return (
    <PageShell>
      <SectionHeading eyebrow={copy.nav.settings} />
      <LanguageSelector />
      <h2 className="font-display text-xl text-white mb-3">{copy.settings.about}</h2>
      <p className="text-sm text-cosmos-white/90 max-w-lg leading-relaxed">
        {copy.settings.description}
      </p>

      <div className="mt-8 max-w-lg">
        <p className="eyebrow text-cosmos-muted mb-3">{copy.settings.sources}</p>
        <ul className="divide-y divide-cosmos-line rounded-2xl border border-cosmos-line overflow-hidden">
          {SOURCES.map((s) => (
            <li key={s.url} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
              <span className="text-white">{copy.sources[s.key]}</span>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-cosmos-ice text-xs shrink-0 hover:underline">
                {copy.settings.visit} &rarr;
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 max-w-lg text-xs text-cosmos-muted leading-relaxed">
        <p>
          {copy.settings.independence}
        </p>
      </div>
    </PageShell>
  );
}
