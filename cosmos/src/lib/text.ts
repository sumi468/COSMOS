// Text-processing utilities shared by the news pipeline. The rule these
// exist to enforce: we may show a SHORT preview, but we never cut a
// sentence or a word in half. Truncation is always word/sentence-aware.

const ENTITY_MAP: Record<string, string> = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&quot;": '"',
  "&apos;": "'",
  "&#8217;": "\u2019",
  "&rsquo;": "\u2019",
  "&#8216;": "\u2018",
  "&lsquo;": "\u2018",
  "&#8220;": "\u201c",
  "&ldquo;": "\u201c",
  "&#8221;": "\u201d",
  "&rdquo;": "\u201d",
  "&#8230;": "\u2026",
  "&hellip;": "\u2026",
  "&#8211;": "\u2013",
  "&ndash;": "\u2013",
  "&#8212;": "\u2014",
  "&mdash;": "\u2014",
  "&emsp;": " ",
  "&ensp;": " ",
  "&#38;": "&"
};

export function decodeEntities(input: string): string {
  let out = input;
  for (const [entity, replacement] of Object.entries(ENTITY_MAP)) {
    out = out.split(entity).join(replacement);
  }
  // Numeric entities not covered above, e.g. &#39;
  out = out.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
  return out;
}

/**
 * Strips HTML tags and CDATA wrappers and decodes entities into clean,
 * readable plain text. Never truncates — callers decide on length.
 */
export function htmlToText(input: string | undefined): string {
  if (!input) return "";
  const withoutCdata = input.replace(/<!\[CDATA\[/g, "").replace(/\]\]>/g, "");
  const withoutTags = withoutCdata
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "");
  return decodeEntities(withoutTags).replace(/[ \t]+/g, " ").replace(/\n\s*\n+/g, "\n").trim();
}

/**
 * Extracts the text of the first `maxParagraphs` real paragraphs from an
 * HTML fragment. Prefers WordPress's own "wp-block-paragraph" paragraphs
 * (NASA's site) since those are reliably body copy rather than captions,
 * nav, or share-button labels; falls back to any <p> tag otherwise.
 */
export function extractLeadParagraphs(html: string | undefined, maxParagraphs = 3): string {
  if (!html) return "";
  const withoutCdata = html.replace(/<!\[CDATA\[/g, "").replace(/\]\]>/g, "");
  const withoutNoise = withoutCdata
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<figure[\s\S]*?<\/figure>/gi, " "); // drop image captions/credits

  const grab = (pattern: RegExp): string[] => {
    const out: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = pattern.exec(withoutNoise)) && out.length < maxParagraphs * 2) {
      const text = decodeEntities(m[1].replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();
      if (text.length >= 40) out.push(text);
      if (out.length >= maxParagraphs) break;
    }
    return out;
  };

  let paragraphs = grab(/<p[^>]*class="[^"]*wp-block-paragraph[^"]*"[^>]*>([\s\S]*?)<\/p>/gi);
  if (paragraphs.length === 0) {
    paragraphs = grab(/<p[^>]*>([\s\S]*?)<\/p>/gi);
  }
  return paragraphs.join(" ");
}

export function firstImageSrc(html: string | undefined): string | undefined {
  if (!html) return undefined;
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1];
}

/**
 * JAXA-specific fallback body extractor. Unlike NASA (confirmed WordPress
 * markup with `<p class="wp-block-paragraph">`), JAXA's exact HTML tag
 * structure isn't something we can safely assume from here. Instead, this
 * anchors on literal text markers verified against real fetched JAXA press
 * pages, which are stable regardless of the surrounding tags:
 *   ...date "(JST)" → "Japan Aerospace Exploration Agency" (byline) →
 *   [actual body] → "Related Links" / "JAXA Explore to Realize" (footer)
 */
export function extractJaxaBody(html: string): string {
  const text = htmlToText(html);
  const jstIndex = text.indexOf("(JST)");
  if (jstIndex === -1) return "";

  const bylineMarker = "Japan Aerospace Exploration Agency";
  const bylineIndex = text.indexOf(bylineMarker, jstIndex);
  if (bylineIndex === -1) return "";
  const bodyStart = bylineIndex + bylineMarker.length;

  const endMarkers = ["Related Links", "JAXA Explore to Realize", "Site Policy", "\u00a9 20"];
  let bodyEnd = text.length;
  for (const marker of endMarkers) {
    const idx = text.indexOf(marker, bodyStart);
    if (idx !== -1 && idx < bodyEnd) bodyEnd = idx;
  }

  return text.slice(bodyStart, bodyEnd).replace(/\s+/g, " ").trim();
}

// Verified (against real fetched JAXA pages) filename pattern for JAXA's
// generic, non-article-specific default press thumbnail. Real per-article
// photos (when JAXA publishes them, e.g. a Hayabusa2 flyby image) live
// inside the body itself, not in og:image, and are far more useful — so we
// look there first and only fall back to og:image if it isn't this generic
// placeholder.
const JAXA_GENERIC_THUMB = /jaxa-thumb-\d+x\d+/i;

/**
 * Finds a genuine per-article image inside the JAXA press-release body
 * (same marker-anchored region as extractJaxaBody, but searched on the raw
 * HTML so tags are still present for the <img> scan).
 */
export function extractJaxaImage(rawHtml: string): string | undefined {
  const jstIndex = rawHtml.indexOf("(JST)");
  if (jstIndex !== -1) {
    const bylineIndex = rawHtml.indexOf("Japan Aerospace Exploration Agency", jstIndex);
    if (bylineIndex !== -1) {
      const endCandidates = ["Related Links", "JAXA Explore to Realize", "Site Policy"]
        .map((m) => rawHtml.indexOf(m, bylineIndex))
        .filter((i) => i !== -1);
      const bodyEnd = endCandidates.length > 0 ? Math.min(...endCandidates) : rawHtml.length;
      const bodySlice = rawHtml.slice(bylineIndex, bodyEnd);
      const inlineImage = firstImageSrc(bodySlice);
      if (inlineImage) return inlineImage;
    }
  }
  const fallback = ogImage(rawHtml);
  if (fallback && !JAXA_GENERIC_THUMB.test(fallback)) return fallback;
  return undefined;
}

export function ogImage(html: string | undefined): string | undefined {
  if (!html) return undefined;
  const patterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i
  ];
  for (const p of patterns) {
    const match = html.match(p);
    if (match?.[1]) return match[1];
  }
  return undefined;
}

const SENTENCE_END = /[。！？.!?]["'\u201d\u2019]?\s/;

/**
 * Trims text to at most `maxChars`, cutting only at a sentence boundary if
 * one exists within range, otherwise at the last whitespace — never mid-word
 * and never mid-sentence with a raw hard cut. Adds an ellipsis only when
 * something was actually removed.
 */
export function previewText(text: string, maxChars = 180): string {
  const clean = text.trim();
  if (clean.length <= maxChars) return clean;

  const window = clean.slice(0, maxChars + 1);
  let lastSentenceEnd = -1;
  const re = new RegExp(SENTENCE_END, "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(window))) {
    lastSentenceEnd = m.index + 1; // include the punctuation
  }
  if (lastSentenceEnd > maxChars * 0.4) {
    return clean.slice(0, lastSentenceEnd).trim();
  }

  const lastSpace = window.slice(0, maxChars).lastIndexOf(" ");
  const cut = lastSpace > maxChars * 0.4 ? lastSpace : maxChars;
  return clean.slice(0, cut).trim() + "\u2026";
}

/** Caps a longer, "full" summary to a sane length without ever cutting mid-word. */
export function capSummary(text: string, maxChars = 900): string {
  const clean = text.trim();
  if (clean.length <= maxChars) return clean;
  const lastSpace = clean.slice(0, maxChars).lastIndexOf(" ");
  const cut = lastSpace > maxChars * 0.5 ? lastSpace : maxChars;
  return clean.slice(0, cut).trim() + "\u2026";
}

const REDIRECT_STUB = /setTimeout\(|location\.href\s*=/i;

/**
 * Detects text that isn't usable as a summary as-is: a JS redirect stub,
 * something implausibly short, or text that clearly stops mid-word/without
 * terminal punctuation (a hallmark of a source feed truncating its own
 * description).
 */
export function looksUnusable(text: string): "redirect" | "too-short" | "cut-off" | "ok" {
  const clean = text.trim();
  if (REDIRECT_STUB.test(clean)) return "redirect";
  if (clean.length < 40) return "too-short";
  const lastChar = clean.slice(-1);
  const endsCleanly = /[。！？.!?…\u2026\u201d")\]]/.test(lastChar);
  if (!endsCleanly) return "cut-off";
  return "ok";
}

/** Extracts a JS `location.href='...'` redirect target from a stub page. */
export function extractRedirectTarget(html: string): string | undefined {
  const match = html.match(/location\.href\s*=\s*['"]([^'"]+)['"]/i);
  return match?.[1];
}
