import PageShell, { SectionHeading } from "@/components/PageShell";
import NewsCard from "@/components/NewsCard";
import FilterBar from "@/components/FilterBar";
import SearchBar from "@/components/SearchBar";
import UpdatedBadge from "@/components/UpdatedBadge";
import { SourceErrorNotice, EmptyState } from "@/components/EmptyState";
import { getAllNews } from "@/lib/news";
import { filterNews } from "@/lib/news";
import type { Agency, NewsCategory } from "@/types/cosmos";

export const revalidate = 300;

export const metadata = { title: "Latest" };

export default async function LatestPage({
  searchParams
}: {
  searchParams: { source?: string; category?: string; q?: string };
}) {
  const news = await getAllNews();
  const source = (searchParams.source as Agency) || "ALL";
  const category = (searchParams.category as NewsCategory) || "ALL";
  const query = searchParams.q?.trim();

  const filtered = filterNews(news.items, { source, category, query });

  return (
    <PageShell>
      <SectionHeading eyebrow="Latest" title="All NASA & JAXA news" action={<UpdatedBadge updatedAt={news.updatedAt} stale={news.stale} />} />
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
          title="No matching stories"
          message={query ? `Nothing found for "${query}". Try a different term or clear the filters.` : "Try a different filter combination."}
        />
      )}
    </PageShell>
  );
}
