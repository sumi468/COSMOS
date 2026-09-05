import { getNasaNews } from "@/lib/nasa";
import { getJaxaNews } from "@/lib/jaxa";
import { getLastGood, setLastGood } from "@/lib/cache";
import type { Agency, FetchResult, NewsCategory, NewsItem } from "@/types/cosmos";

const MERGED_CACHE_KEY = "merged-news";
// Every page (Home, Latest, a single article's detail page, Search, a
// Mission's related news) calls getAllNews(). Without this, opening one
// article re-runs all 4 NASA feeds *and* JAXA's article-enrichment fetches
// (see lib/jaxa.ts) from scratch — wasteful, and slow enough on a cold
// cache to make the summary feel like it "isn't working". This reuses the
// same last-known-good cache the individual sources already populate, just
// with a short freshness window, so a burst of navigation within a few
// seconds/minutes is served from memory instead of re-fetching everything.
const MERGED_TTL_MS = process.env.NODE_ENV === "production" ? 5 * 60 * 1000 : 15 * 1000;

export async function getAllNews(): Promise<FetchResult<NewsItem>> {
  const cached = getLastGood<FetchResult<NewsItem>>(MERGED_CACHE_KEY);
  if (cached && Date.now() - new Date(cached.updatedAt).getTime() < MERGED_TTL_MS) {
    return cached.value;
  }

  const [nasa, jaxa] = await Promise.all([getNasaNews(), getJaxaNews()]);
  const items = [...nasa.items, ...jaxa.items].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const merged: FetchResult<NewsItem> = {
    items,
    updatedAt: new Date().toISOString(),
    stale: nasa.stale || jaxa.stale,
    errors: [...nasa.errors, ...jaxa.errors]
  };
  setLastGood(MERGED_CACHE_KEY, merged);
  return merged;
}

export interface NewsFilters {
  source?: Agency | "ALL";
  category?: NewsCategory | "ALL";
  query?: string;
}

export function filterNews(items: NewsItem[], filters: NewsFilters): NewsItem[] {
  return items.filter((item) => {
    if (filters.source && filters.source !== "ALL" && item.source !== filters.source) return false;
    if (filters.category && filters.category !== "ALL" && item.category !== filters.category) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const haystack = `${item.title} ${item.summary}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export const ALL_CATEGORIES: NewsCategory[] = [
  "Launch",
  "Mission",
  "Science",
  "ISS",
  "Space Telescope",
  "Earth",
  "Moon",
  "Mars",
  "Astronomy",
  "Aeronautics",
  "General"
];
