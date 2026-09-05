import { notFound } from "next/navigation";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import NewsCard from "@/components/NewsCard";
import { getMissionBySlug, MISSIONS } from "@/lib/missions";
import { getAllNews } from "@/lib/news";

export function generateStaticParams() {
  return MISSIONS.map((m) => ({ slug: m.slug }));
}

export default async function MissionDetailPage({ params }: { params: { slug: string } }) {
  const mission = getMissionBySlug(params.slug);
  if (!mission) notFound();

  const news = await getAllNews();
  const nameTokens = mission.name.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
  const relatedNews = news.items
    .filter((item) => nameTokens.some((t) => `${item.title} ${item.summary}`.toLowerCase().includes(t)))
    .slice(0, 5);

  return (
    <PageShell>
      <Link href="/missions" className="text-sm text-cosmos-muted hover:text-white">&larr; Back to Missions</Link>

      <div className="mt-6 max-w-2xl">
        <div className="eyebrow text-cosmos-ice">{mission.organization}</div>
        <h1 className="mt-2 font-display text-3xl text-white">{mission.name}</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-cosmos-white/90">{mission.description}</p>

        <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-cosmos-line p-5 text-sm">
          <div>
            <dt className="eyebrow text-cosmos-muted">Status</dt>
            <dd className="mt-1 text-white">{mission.status}</dd>
          </div>
          {mission.target && (
            <div>
              <dt className="eyebrow text-cosmos-muted">Target</dt>
              <dd className="mt-1 text-white">{mission.target}</dd>
            </div>
          )}
          <div>
            <dt className="eyebrow text-cosmos-muted">Organization</dt>
            <dd className="mt-1 text-white">{mission.organization}</dd>
          </div>
        </dl>

        {mission.latestUpdateNote && (
          <p className="mt-4 text-sm text-cosmos-muted">{mission.latestUpdateNote}</p>
        )}

        <a
          href={mission.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-cosmos-ice text-cosmos-black text-sm font-medium px-4 py-2 hover:opacity-90 transition-opacity"
        >
          Official website &rarr;
        </a>
      </div>

      {relatedNews.length > 0 && (
        <div className="mt-12 max-w-2xl">
          <p className="eyebrow text-cosmos-muted mb-2">Related news</p>
          {relatedNews.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
