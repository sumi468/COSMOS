import { XMLParser } from "fast-xml-parser";
import { encodeId } from "@/lib/id";
import { decodeEntities, htmlToText } from "@/lib/text";
import type { SpaceImage } from "@/types/cosmos";

const parser = new XMLParser({ parseTagValue: false, processEntities: false });
const imageHosts = new Set(["assets.science.nasa.gov", "science.nasa.gov", "apod.nasa.gov"]);
const imageFormat = /\.(avif|gif|jpe?g|png|webp)$/i;
const siteGraphic = /(?:^|[^a-z])(?:logos?|placeholder|favicon)(?:[^a-z]|$)/i;

interface ApodEntry {
  title?: string;
  link?: string;
  pubDate?: string;
  description?: string;
  "apod:hdurl"?: string;
  "apod:url"?: string;
  "apod:alt"?: string;
  "apod:credit"?: string;
  "apod:copyright"?: string;
}

function apodImageUrl(value: unknown): string | undefined {
  if (typeof value !== "string" || !value) return undefined;
  try {
    const url = new URL(decodeEntities(value));
    const path = decodeURIComponent(url.pathname);
    if (url.protocol === "https:" && imageHosts.has(url.host) && imageFormat.test(path) && !siteGraphic.test(path)) {
      return url.href;
    }
  } catch {
    return undefined;
  }
}

function plainText(value: unknown): string {
  return typeof value === "string" ? htmlToText(value) : "";
}

/** Read the entry's declared media, independent of logos or unrelated images in the page HTML. */
export function parseApodPhoto(xml: string): SpaceImage | undefined {
  const items: ApodEntry | ApodEntry[] | undefined = parser.parse(xml)?.rss?.channel?.item;
  if (!items) return undefined;

  let newest: SpaceImage | undefined;
  for (const item of Array.isArray(items) ? items : [items]) {
    const imageUrl = apodImageUrl(item["apod:hdurl"]) ?? apodImageUrl(item["apod:url"]);
    const title = plainText(item.title);
    const officialUrl = item.link;
    const timestamp = Date.parse(item.pubDate ?? "");
    if (!imageUrl || !title || typeof officialUrl !== "string" || !officialUrl.startsWith("https://science.nasa.gov/image-article/") || !Number.isFinite(timestamp)) continue;

    const date = new Date(timestamp).toISOString();
    if (newest && date <= newest.date) continue;

    newest = {
      id: encodeId(officialUrl),
      title,
      date,
      explanation: plainText(item.description).replace(/^Explanation:\s*/i, "").split(/\s*Tomorrow['’]s picture\s*:/i)[0].trim(),
      imageUrl,
      alt: plainText(item["apod:alt"]) || undefined,
      credit: (plainText(item["apod:credit"]) || plainText(item["apod:copyright"])).replace(/^Credit:\s*/i, "") || "NASA",
      source: "NASA APOD",
      officialUrl,
      mediaType: "image"
    };
  }
  return newest;
}
