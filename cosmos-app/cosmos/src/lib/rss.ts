import { XMLParser } from "fast-xml-parser";

export interface FeedEntry {
  title: string;
  link: string;
  summary: string;
  publishedAt: string; // ISO 8601 if parseable, otherwise the raw string
  imageUrl?: string;
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text"
});

function stripHtml(input: string | undefined): string {
  if (!input) return "";
  return input
    .replace(/<!\[CDATA\[/g, "")
    .replace(/\]\]>/g, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "\u2019")
    .replace(/&#8220;|&ldquo;/g, "\u201c")
    .replace(/&#8221;|&rdquo;/g, "\u201d")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function toIso(dateStr: string | undefined): string {
  if (!dateStr) return new Date().toISOString();
  const parsed = new Date(dateStr);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

function firstImageFromHtml(html?: string): string | undefined {
  if (!html) return undefined;
  const match = html.match(/<img[^>]+src="([^">]+)"/i);
  return match?.[1];
}

/**
 * Fetches and parses an RSS 2.0, RDF (RSS 1.0), or Atom feed into a
 * normalized list of entries. Returns [] on any parse failure rather than
 * throwing, so a single malformed feed cannot crash the aggregator — the
 * caller decides whether that counts as an "error" to surface to the user.
 */
export async function fetchFeed(url: string, revalidateSeconds: number): Promise<FeedEntry[]> {
  const res = await fetch(url, {
    headers: { "User-Agent": "COSMOS-App/1.0 (+space news aggregator)" },
    next: { revalidate: revalidateSeconds }
  });
  if (!res.ok) throw new Error(`${url} responded ${res.status}`);
  const xml = await res.text();
  const data = parser.parse(xml);

  // RSS 2.0
  const rssItems = data?.rss?.channel?.item;
  if (rssItems) {
    const arr = Array.isArray(rssItems) ? rssItems : [rssItems];
    return arr.map((item: any) => {
      const rawSummary = item.description ?? item["content:encoded"] ?? "";
      return {
        title: stripHtml(item.title),
        link: typeof item.link === "string" ? item.link : item.link?.["#text"] ?? item.guid?.["#text"] ?? item.guid ?? "",
        summary: stripHtml(rawSummary),
        publishedAt: toIso(item.pubDate),
        imageUrl:
          item?.enclosure?.["@_url"] ||
          item?.["media:content"]?.["@_url"] ||
          item?.["media:thumbnail"]?.["@_url"] ||
          firstImageFromHtml(rawSummary)
      };
    });
  }

  // RDF (RSS 1.0) — used by JAXA
  const rdfItems = data?.["rdf:RDF"]?.item;
  if (rdfItems) {
    const arr = Array.isArray(rdfItems) ? rdfItems : [rdfItems];
    return arr.map((item: any) => ({
      title: stripHtml(item.title),
      link: item.link ?? "",
      summary: stripHtml(item.description),
      publishedAt: toIso(item["dc:date"]),
      imageUrl: undefined
    }));
  }

  // Atom
  const atomEntries = data?.feed?.entry;
  if (atomEntries) {
    const arr = Array.isArray(atomEntries) ? atomEntries : [atomEntries];
    return arr.map((entry: any) => {
      const link = Array.isArray(entry.link)
        ? entry.link.find((l: any) => l["@_rel"] !== "self")?.["@_href"] ?? entry.link[0]?.["@_href"]
        : entry.link?.["@_href"];
      const rawSummary = entry.summary?.["#text"] ?? entry.summary ?? entry.content?.["#text"] ?? entry.content ?? "";
      return {
        title: stripHtml(entry.title?.["#text"] ?? entry.title),
        link: link ?? "",
        summary: stripHtml(typeof rawSummary === "string" ? rawSummary : ""),
        publishedAt: toIso(entry.updated ?? entry.published),
        imageUrl: undefined
      };
    });
  }

  return [];
}
