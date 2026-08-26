import { getNasaNews } from "@/lib/nasa";
import { getJaxaNews } from "@/lib/jaxa";
import type { Agency, FetchResult, NewsCategory, NewsItem } from "@/types/cosmos";

export async function getAllNews(): Promise<FetchResult<NewsItem>> {
  const [nasa, jaxa] = await Promise.all([getNasaNews(), getJaxaNews()]);
  const items = [...nasa.items, ...jaxa.items].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  return {
    items,
    updatedAt: new Date().toISOString(),
    stale: nasa.stale || jaxa.stale,
    errors: [...nasa.errors, ...jaxa.errors]
  };
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
