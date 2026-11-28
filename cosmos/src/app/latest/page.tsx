import { Suspense } from "react";
import PageShell, { SectionHeading } from "@/components/PageShell";
import NewsCard from "@/components/NewsCard";
import FilterBar from "@/components/FilterBar";
import SearchBar from "@/components/SearchBar";
import LoadingState from "@/components/LoadingState";
import UpdatedBadge from "@/components/UpdatedBadge";
import { SourceErrorNotice, EmptyState } from "@/components/EmptyState";
import { getAllNews, type NewsFilters } from "@/lib/news";
import { filterLocalizedNews } from "@/lib/japaneseNews";
import { getLocalization } from "@/lib/localization";
import type { Agency, FetchResult, NewsCategory, NewsItem } from "@/types/cosmos";

export const revalidate = 300;

export function generateMetadata() {
  return { title: getLocalization().copy.nav.latest };
}

export default function LatestPage({
  searchParams
}: {
  searchParams: { source?: string; category?: string; q?: string };
}) {
  const { copy } = getLocalization();
  const source = (searchParams.source as Agency) || "ALL";
  const category = (searchParams.category as NewsCategory) || "ALL";
  const query = searchParams.q?.trim();
  const news = getAllNews();

  return (
    <PageShell>
      <SectionHeading
        as="h1"
        eyebrow={copy.nav.latest}
        title={copy.latest.title}
        action={<Suspense fallback={null}><NewsUpdated news={news} /></Suspense>}
      />
      <div className="mt-4 mb-6 space-y-4">
        <SearchBar action="/latest" defaultValue={query} />
        <FilterBar basePath="/latest" source={source} category={category} query={query} />
      </div>

      <Suspense key={JSON.stringify([source, category, query])} fallback={<LoadingState compact />}>
        <LatestResults news={news} filters={{ source, category, query }} />
      </Suspense>
    </PageShell>
  );
}

async function NewsUpdated({ news }: { news: Promise<FetchResult<NewsItem>> }) {
  const { updatedAt, stale } = await news;
  return <UpdatedBadge updatedAt={updatedAt} stale={stale} />;
}

async function LatestResults({ news, filters }: { news: Promise<FetchResult<NewsItem>>; filters: NewsFilters }) {
  const { locale, copy } = getLocalization();
  const { items, errors } = await news;
  const filtered = await filterLocalizedNews(items, filters, locale);

  return (
    <>
      <SourceErrorNotice errors={errors} />
      {filtered.length > 0 ? (
        <div>
          {filtered.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={copy.latest.noMatches}
          message={filters.query ? copy.latest.queryHint(filters.query) : copy.latest.filterHint}
        />
      )}
    </>
  );
}
