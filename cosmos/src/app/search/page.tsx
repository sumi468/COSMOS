import PageShell, { SectionHeading } from "@/components/PageShell";
import SearchBar from "@/components/SearchBar";
import NewsCard from "@/components/NewsCard";
import MissionCard from "@/components/MissionCard";
import { EmptyState } from "@/components/EmptyState";
import { getAllNews, filterNews } from "@/lib/news";
import { MISSIONS } from "@/lib/missions";

export const revalidate = 300;
export const metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q?.trim();
  const news = await getAllNews();
  const newsResults = query ? filterNews(news.items, { query }) : [];
  const missionResults = query
    ? MISSIONS.filter((m) => `${m.name} ${m.description}`.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <PageShell>
      <SectionHeading eyebrow="Search" title="Find news &amp; missions" />
      <div className="mt-4 mb-8">
        <SearchBar action="/search" defaultValue={query} />
      </div>

      {!query && (
        <EmptyState title="Search ISS, Artemis, H3, James Webb\u2026" message="Results include both news and mission pages, with source and date shown." />
      )}

      {query && missionResults.length > 0 && (
        <section className="mb-10">
          <SectionHeading eyebrow="Missions" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {missionResults.map((m) => (
              <MissionCard key={m.slug} mission={m} />
            ))}
          </div>
        </section>
      )}

      {query && (
        <section>
          <SectionHeading eyebrow="News" />
          {newsResults.length > 0 ? (
            <div>
              {newsResults.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            missionResults.length === 0 && <EmptyState title={`No results for "${query}"`} />
          )}
        </section>
      )}
    </PageShell>
  );
}
