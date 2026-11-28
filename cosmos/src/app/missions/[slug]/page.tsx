import { notFound } from "next/navigation";
import Link from "next/link";
import PageShell, { SectionHeading } from "@/components/PageShell";
import NewsCard from "@/components/NewsCard";
import { getMissionBySlug, localizeMission, MISSIONS } from "@/lib/missions";
import { getAllNews } from "@/lib/news";
import { getLocalization } from "@/lib/localization";

export function generateStaticParams() {
  return MISSIONS.map((m) => ({ slug: m.slug }));
}

export default async function MissionDetailPage({ params }: { params: { slug: string } }) {
  const profile = getMissionBySlug(params.slug);
  if (!profile) notFound();

  const { locale, copy } = getLocalization();
  const mission = localizeMission(profile, locale);

  const news = await getAllNews();
  const nameTokens = profile.name.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
  const relatedNews = news.items
    .filter((item) => nameTokens.some((t) => `${item.title} ${item.summary}`.toLowerCase().includes(t)))
    .slice(0, 5);

  return (
    <PageShell>
      <Link href="/missions" className="text-sm text-cosmos-muted hover:text-cosmos-ink">&larr; {copy.missions.back}</Link>

      <div className="mt-6 max-w-2xl">
        <div className="eyebrow text-cosmos-accent">{copy.agency[mission.organization]}</div>
        <h1 className="mt-2.5 editorial-title article-title">{mission.name}</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-cosmos-ink/90">{mission.description}</p>

        <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-cosmos-line bg-cosmos-surface p-5 sm:p-6 text-sm">
          <div>
            <dt className="eyebrow text-cosmos-muted">{copy.common.status}</dt>
            <dd className="mt-1 text-cosmos-ink">{copy.missionStatus[mission.status]}</dd>
          </div>
          {mission.target && (
            <div>
              <dt className="eyebrow text-cosmos-muted">{copy.common.target}</dt>
              <dd className="mt-1 text-cosmos-ink">{mission.target}</dd>
            </div>
          )}
          <div>
            <dt className="eyebrow text-cosmos-muted">{copy.common.organization}</dt>
            <dd className="mt-1 text-cosmos-ink">{copy.agency[mission.organization]}</dd>
          </div>
        </dl>

        {mission.latestUpdateNote && (
          <p className="mt-4 text-sm text-cosmos-muted">{mission.latestUpdateNote}</p>
        )}

        <a
          href={mission.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 primary-button"
        >
          {copy.missions.officialSite} &rarr;
        </a>
      </div>

      {relatedNews.length > 0 && (
        <div className="mt-12 max-w-2xl">
          <SectionHeading title={copy.missions.relatedNews} />
          {relatedNews.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
