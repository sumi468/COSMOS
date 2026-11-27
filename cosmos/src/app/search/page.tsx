import PageShell, { SectionHeading } from "@/components/PageShell";
import SearchBar from "@/components/SearchBar";
import NewsCard from "@/components/NewsCard";
import MissionCard from "@/components/MissionCard";
import { EmptyState } from "@/components/EmptyState";
import { getAllNews, filterNews } from "@/lib/news";
import { MISSIONS } from "@/lib/missions";
import { getLocalization } from "@/lib/localization";

export const revalidate = 300;
export function generateMetadata() {
  return { title: getLocalization().copy.common.search };
}

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const { copy } = getLocalization();
  const query = searchParams.q?.trim();
  const news = await getAllNews();
  const newsResults = query ? filterNews(news.items, { query }) : [];
  const missionResults = query
    ? MISSIONS.filter((m) => `${m.name} ${m.description} ${m.ja.name} ${m.ja.description}`.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <PageShell>
      <SectionHeading eyebrow={copy.common.search} title={copy.search.title} />
      <div className="mt-4 mb-8">
        <SearchBar action="/search" defaultValue={query} />
      </div>

      {!query && (
        <EmptyState title={copy.common.searchPlaceholder} message={copy.search.hint} />
      )}

      {query && missionResults.length > 0 && (
        <section className="mb-10">
          <SectionHeading eyebrow={copy.nav.missions} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {missionResults.map((m) => (
              <MissionCard key={m.slug} mission={m} />
            ))}
          </div>
        </section>
      )}

      {query && (
        <section>
          <SectionHeading eyebrow={copy.search.news} />
          {newsResults.length > 0 ? (
            <div>
              {newsResults.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            missionResults.length === 0 && <EmptyState title={copy.search.noResults(query)} />
          )}
        </section>
      )}
    </PageShell>
  );
}
