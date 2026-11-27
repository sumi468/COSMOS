import { cache } from "react";
import { fetchCache } from "@/lib/fetchPolicy";
import { fetchFeed, type FeedEntry } from "@/lib/rss";
import { filterNews, type NewsFilters } from "@/lib/news";
import type { Locale } from "@/lib/language";
import { translateJapanese } from "@/lib/translateJapanese";
import type { NewsItem } from "@/types/cosmos";

const JAXA_JAPANESE_FEED = "https://www.jaxa.jp/rss/press_j.rdf";

export type NewsTextField = "title" | "summary";

export function hasJapanese(text: string): boolean {
  return /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u.test(text);
}

export function isJapaneseText(text: string): boolean {
  const japanese = text.match(/[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/gu)?.length ?? 0;
  const latin = text.match(/\p{Script=Latin}/gu)?.length ?? 0;
  return japanese > 0 && latin <= japanese * 2;
}

function jaxaReleaseId(link: string): string | undefined {
  const match = /^https:\/\/(?:www|global)\.jaxa\.jp\/press\/\d{4}\/\d{2}\/(\d{8}-\d+)(?:_[ej])?\.html(?:[?#].*)?$/i.exec(link);
  return match?.[1];
}

const japaneseJaxaFeed = cache(async () => {
  try {
    const items = await fetchFeed(JAXA_JAPANESE_FEED, fetchCache(900));
    return new Map(items.flatMap((entry) => {
      const id = jaxaReleaseId(entry.link);
      return id && entry.title ? [[id, entry] as const] : [];
    }));
  } catch {
    return new Map<string, FeedEntry>();
  }
});

export async function getJapaneseJaxaRelease(item: NewsItem) {
  if (item.source !== "JAXA") return undefined;
  const id = jaxaReleaseId(item.officialUrl);
  return id ? (await japaneseJaxaFeed()).get(id) : undefined;
}

export async function getJapaneseNewsText(item: NewsItem, field: NewsTextField) {
  const release = await getJapaneseJaxaRelease(item);
  const originalJapanese = field === "title" ? release?.title : release?.description;
  if (originalJapanese?.trim()) {
    return { text: originalJapanese, language: "ja", translated: false } as const;
  }

  const text = item[field].trim();
  if (!text) return null;
  if (isJapaneseText(text)) return { text, language: "ja", translated: false } as const;

  try {
    const result = await translateJapanese(text);
    if (hasJapanese(result)) return { text: result, language: "ja", translated: true } as const;
  } catch {
    // Keep the source text readable if the model is temporarily unavailable.
  }
  return { text, language: "en", translated: false } as const;
}

export async function filterLocalizedNews(items: NewsItem[], filters: NewsFilters, locale: Locale) {
  const originalMatches = filterNews(items, filters);
  if (locale !== "ja" || !filters.query || !hasJapanese(filters.query)) return originalMatches;

  const query = filters.query.normalize("NFKC").toLowerCase();
  const originals = new Set(originalMatches.map((item) => item.id));
  const candidates = filterNews(items, { source: filters.source, category: filters.category });
  const matches = await Promise.all(candidates.map(async (item) => {
    if (originals.has(item.id)) return true;
    const headline = await getJapaneseNewsText(item, "title");
    return headline?.text.normalize("NFKC").toLowerCase().includes(query);
  }));
  return candidates.filter((_, index) => matches[index]);
}
