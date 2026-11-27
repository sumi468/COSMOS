import PageShell, { SectionHeading } from "@/components/PageShell";
import NewsCard from "@/components/NewsCard";
import FilterBar from "@/components/FilterBar";
import SearchBar from "@/components/SearchBar";
import UpdatedBadge from "@/components/UpdatedBadge";
import { SourceErrorNotice, EmptyState } from "@/components/EmptyState";
import { getAllNews, filterNews } from "@/lib/news";
import { getLocalization } from "@/lib/localization";
import type { Agency, NewsCategory } from "@/types/cosmos";

export const revalidate = 300;

export function generateMetadata() {
  return { title: getLocalization().copy.nav.latest };
}

export default async function LatestPage({
  searchParams
}: {
  searchParams: { source?: string; category?: string; q?: string };
}) {
  const { copy } = getLocalization();
  const news = await getAllNews();
  const source = (searchParams.source as Agency) || "ALL";
  const category = (searchParams.category as NewsCategory) || "ALL";
  const query = searchParams.q?.trim();

  const filtered = filterNews(news.items, { source, category, query });

  return (
    <PageShell>
      <SectionHeading eyebrow={copy.nav.latest} title={copy.latest.title} action={<UpdatedBadge updatedAt={news.updatedAt} stale={news.stale} />} />
      <SourceErrorNotice errors={news.errors} />

      <div className="mt-4 mb-6 space-y-4">
        <SearchBar action="/latest" defaultValue={query} />
        <FilterBar basePath="/latest" source={source} category={category} query={query} />
      </div>

      {filtered.length > 0 ? (
        <div>
          {filtered.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={copy.latest.noMatches}
          message={query ? copy.latest.queryHint(query) : copy.latest.filterHint}
        />
      )}
    </PageShell>
  );
}
