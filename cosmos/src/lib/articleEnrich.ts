import { fetchCache } from "@/lib/fetchPolicy";
import { extractJaxaBody, extractJaxaImage, extractLeadParagraphs, extractRedirectTarget, looksUnusable } from "@/lib/text";

export interface ArticleEnrichment {
  paragraphs: string; // plain text, empty string if none found
  imageUrl?: string;
  finalUrl: string; // the URL the content actually came from (after following a JS redirect stub)
}

const BROWSER_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (compatible; COSMOS/1.0; +https://cosmos.app) space-news-aggregator",
  Accept: "text/html,application/xhtml+xml"
};

async function fetchHtml(url: string, revalidateSeconds: number, timeoutMs = 8000): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: BROWSER_HEADERS,
      signal: controller.signal,
      ...fetchCache(revalidateSeconds)
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Reads the official article page directly to build a fuller summary and
 * find a real image, for sources (like JAXA's RSS) whose own feed
 * description is too short, garbled, or a JS-redirect stub. This is the
 * "original content → summary generation" step described in the brief:
 * we still never invent text, we just read further into the same official
 * page the article already links to.
 *
 * Cached for a long time (article pages don't change after publishing), and
 * fails soft (returns null) on any error so callers can fall back cleanly.
 */
export async function fetchArticleEnrichment(
  url: string,
  revalidateSeconds = 6 * 60 * 60
): Promise<ArticleEnrichment | null> {
  let html = await fetchHtml(url, revalidateSeconds);
  if (!html) return null;

  let finalUrl = url;
  // Some JAXA "For Media" English pages are just a tiny JS-redirect stub to
  // the real (often Japanese-language) article. Follow it once.
  const redirectTarget = extractRedirectTarget(html);
  if (redirectTarget && redirectTarget !== url) {
    const redirected = await fetchHtml(redirectTarget, revalidateSeconds);
    if (redirected) {
      html = redirected;
      finalUrl = redirectTarget;
    }
  }

  let paragraphs = extractLeadParagraphs(html, 4);
  if (!paragraphs || looksUnusable(paragraphs) !== "ok") {
    const jaxaBody = extractJaxaBody(html);
    if (jaxaBody && looksUnusable(jaxaBody) === "ok") {
      paragraphs = jaxaBody;
    }
  }
  const imageUrl = extractJaxaImage(html);

  if (!paragraphs && !imageUrl) return null;
  return { paragraphs, imageUrl, finalUrl };
}
