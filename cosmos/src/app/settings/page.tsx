import PageShell, { SectionHeading } from "@/components/PageShell";

export const metadata = { title: "Settings" };

const SOURCES = [
  { name: "NASA News Releases (RSS)", url: "https://www.nasa.gov/news-release/feed/" },
  { name: "NASA Recently Published (RSS)", url: "https://www.nasa.gov/feed/" },
  { name: "NASA Artemis (RSS)", url: "https://www.nasa.gov/missions/artemis/feed/" },
  { name: "NASA Space Station (RSS)", url: "https://www.nasa.gov/missions/station/feed/" },
  { name: "JAXA Press Release, English (RSS)", url: "https://global.jaxa.jp/rss/press.rdf" },
  { name: "NASA Astronomy Picture of the Day (API)", url: "https://api.nasa.gov/" },
  { name: "NASA Image and Video Library (API)", url: "https://images-api.nasa.gov/" },
  { name: "Launch Library 2 by The Space Devs (API)", url: "https://thespacedevs.com/llapi" }
];

export default function SettingsPage() {
  return (
    <PageShell>
      <SectionHeading eyebrow="Settings" title="About COSMOS" />
      <p className="text-sm text-cosmos-white/90 max-w-lg leading-relaxed">
        COSMOS aggregates real-time public information directly from NASA and JAXA&rsquo;s own official
        feeds and APIs. Nothing is written or invented by AI &mdash; titles, summaries, dates, and links
        always come from the original source, and every article links back to it.
      </p>

      <div className="mt-8 max-w-lg">
        <p className="eyebrow text-cosmos-muted mb-3">Data sources</p>
        <ul className="divide-y divide-cosmos-line rounded-2xl border border-cosmos-line overflow-hidden">
          {SOURCES.map((s) => (
            <li key={s.url} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
              <span className="text-white">{s.name}</span>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-cosmos-ice text-xs shrink-0 hover:underline">
                Visit &rarr;
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 max-w-lg text-xs text-cosmos-muted leading-relaxed">
        <p>
          COSMOS is an independent, unofficial app. It is not produced, endorsed, or affiliated with NASA
          or JAXA. NASA content is generally not copyrighted in the United States; JAXA press materials
          remain subject to JAXA&rsquo;s own usage policies. Always confirm mission-critical or time-critical
          details on the agencies&rsquo; own sites.
        </p>
      </div>
    </PageShell>
  );
}
