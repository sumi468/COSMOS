import { XMLParser } from "fast-xml-parser";
import { htmlToText } from "@/lib/text";

export interface FeedEntry {
  title: string;
  link: string;
  /** Cleaned plain-text description exactly as the feed gave it — full, untruncated. */
  description: string;
  /** Raw content:encoded (or equivalent) HTML, if the feed provides one. Kept as HTML
   *  so callers can extract both a richer plain-text summary AND an <img> from it. */
  contentHtml?: string;
  publishedAt: string; // ISO 8601 if parseable, otherwise "now"
  /** Only populated when the feed itself declares a structured image (enclosure/media:*). */
  enclosureImageUrl?: string;
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text"
});

function toIso(dateStr: string | undefined): string {
  if (!dateStr) return new Date().toISOString();
  const parsed = new Date(dateStr);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

/**
 * Fetches and parses an RSS 2.0, RDF (RSS 1.0), or Atom feed into a
 * normalized list of entries. Returns [] on any parse failure rather than
 * throwing, so a single malformed feed cannot crash the aggregator — the
 * caller decides whether that counts as an "error" to surface to the user.
 *
 * IMPORTANT: this only strips HTML / decodes entities. It never truncates
 * text — any shortening for display happens later, deliberately, in the UI
 * layer (see lib/text.ts's previewText), so a "full" summary always stays
 * full all the way through the pipeline.
 */
export async function fetchFeed(
  url: string,
  fetchInit: RequestInit & { next?: { revalidate?: number } }
): Promise<FeedEntry[]> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; COSMOS/1.0; +https://cosmos.app) space-news-aggregator",
      Accept: "application/rss+xml, application/rdf+xml, application/atom+xml, application/xml, text/xml, */*"
    },
    ...fetchInit
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}`);
  }
  const xml = await res.text();
  const data = parser.parse(xml);

  // --- RSS 2.0 (NASA) ---------------------------------------------------
  const rssItems = data?.rss?.channel?.item;
  if (rssItems) {
    const arr = Array.isArray(rssItems) ? rssItems : [rssItems];
    return arr.map((item: any) => {
      const contentHtml: string | undefined = item["content:encoded"];
      const enclosureImageUrl: string | undefined =
        item?.enclosure?.["@_url"] ||
        item?.["media:content"]?.["@_url"] ||
        item?.["media:thumbnail"]?.["@_url"] ||
        undefined;
      return {
        title: htmlToText(item.title),
        link:
          typeof item.link === "string"
            ? item.link
            : item.link?.["#text"] ?? item.guid?.["#text"] ?? item.guid ?? "",
        description: htmlToText(item.description),
        contentHtml,
        publishedAt: toIso(item.pubDate),
        enclosureImageUrl
      };
    });
  }

  // --- RDF / RSS 1.0 (JAXA) ----------------------------------------------
  const rdfItems = data?.["rdf:RDF"]?.item;
  if (rdfItems) {
    const arr = Array.isArray(rdfItems) ? rdfItems : [rdfItems];
    return arr.map((item: any) => ({
      title: htmlToText(item.title),
      link: typeof item.link === "string" ? item.link : item.link?.["#text"] ?? "",
      description: htmlToText(item.description),
      contentHtml: undefined,
      publishedAt: toIso(item["dc:date"]),
      enclosureImageUrl: undefined
    }));
  }

  // --- Atom ---------------------------------------------------------------
  const atomEntries = data?.feed?.entry;
  if (atomEntries) {
    const arr = Array.isArray(atomEntries) ? atomEntries : [atomEntries];
    return arr.map((entry: any) => {
      const link = Array.isArray(entry.link)
        ? entry.link.find((l: any) => l["@_rel"] !== "self")?.["@_href"] ?? entry.link[0]?.["@_href"]
        : entry.link?.["@_href"];
      const rawSummary = entry.summary?.["#text"] ?? entry.summary ?? "";
      const rawContent = entry.content?.["#text"] ?? entry.content ?? "";
      return {
        title: htmlToText(entry.title?.["#text"] ?? entry.title),
        link: link ?? "",
        description: htmlToText(typeof rawSummary === "string" ? rawSummary : ""),
        contentHtml: typeof rawContent === "string" ? rawContent : undefined,
        publishedAt: toIso(entry.updated ?? entry.published),
        enclosureImageUrl: undefined
      };
    });
  }

  return [];
}
