import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { test } from "node:test";
import ts from "typescript";

function moduleUrl(source) {
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
  });
  return "data:text/javascript;base64," + Buffer.from(outputText).toString("base64");
}

const readLib = (name) => readFile(new URL(`../src/lib/${name}.ts`, import.meta.url), "utf8");
const [apod, id, text] = await Promise.all(["apod", "id", "text"].map(readLib));
const { parseApodPhoto } = await import(moduleUrl(
  apod
    .replace('"fast-xml-parser"', JSON.stringify(import.meta.resolve("fast-xml-parser")))
    .replace('"@/lib/id"', JSON.stringify(moduleUrl(id)))
    .replace('"@/lib/text"', JSON.stringify(moduleUrl(text)))
));

const photoUrl = "https://assets.science.nasa.gov/dynamicimage/assets/science/cds/apod/moon.jpg";
const officialUrl = "https://science.nasa.gov/image-article/the-moon-watchers/";
const logoUrl = "https://science.nasa.gov/wp-content/themes/nasa-child/assets/images/nasa-logo%402x.png";

function entry({ image = "", title = "The Moon Watchers", date = "Fri, 27 Nov 2026 05:05:00 +0000" } = {}) {
  return `<item>
    <title>${title}</title>
    <link>${officialUrl}</link>
    <pubDate>${date}</pubDate>
    <apod:hdurl>${image}</apod:hdurl>
    <apod:url>${officialUrl}</apod:url>
    <apod:credit><![CDATA[<a href="https://example.org/">Marcella Pace</a>]]></apod:credit>
    <apod:alt>Full Moon rising over a stone wall.</apod:alt>
    <description><![CDATA[<strong>Explanation:</strong> The full Moon rises.<br><br><strong>Tomorrow's picture:</strong> Jupiter]]></description>
    <content:encoded><![CDATA[<img src="${logoUrl}">]]></content:encoded>
  </item>`;
}

const feed = (...items) => `<rss version="2.0" xmlns:apod="https://science.nasa.gov/apod/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel>${items.join("")}</channel></rss>`;

test("uses the declared astronomy image and its caption even if the HTML contains the NASA logo", () => {
  const photo = parseApodPhoto(feed(entry({ image: photoUrl + "?w=2023&#038;h=2048" })));

  assert.equal(photo.imageUrl, photoUrl + "?w=2023&h=2048");
  assert.equal(photo.title, "The Moon Watchers");
  assert.equal(photo.date, "2026-11-27T05:05:00.000Z");
  assert.equal(photo.credit, "Marcella Pace");
  assert.equal(photo.alt, "Full Moon rising over a stone wall.");
  assert.equal(photo.explanation, "The full Moon rises.");
  assert.equal(photo.officialUrl, officialUrl);
});

test("picks the newest usable image and skips a newer logo entry", () => {
  const photo = parseApodPhoto(feed(
    entry({ image: photoUrl, title: "An older Moon", date: "Thu, 26 Nov 2026 05:05:00 +0000" }),
    entry({ image: logoUrl, title: "NASA Science", date: "Sat, 28 Nov 2026 05:05:00 +0000" }),
    entry({ image: photoUrl })
  ));

  assert.equal(photo.title, "The Moon Watchers");
});

test("returns no featured photo for logos, videos, article URLs, and missing dates", () => {
  const photo = parseApodPhoto(feed(
    entry({ image: logoUrl }),
    entry({ image: "https://assets.science.nasa.gov/apod/clip.mp4" }),
    entry(),
    entry({ image: photoUrl, date: "" })
  ));

  assert.equal(photo, undefined);
});
