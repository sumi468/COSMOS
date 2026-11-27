import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = (await readFile(new URL("../src/lib/japaneseNews.ts", import.meta.url), "utf8"))
  .replace('import { cache } from "react";', 'const cache = (fn) => fn;')
  .replace('import { fetchCache } from "@/lib/fetchPolicy";', 'const fetchCache = () => ({});')
  .replace('import { fetchFeed, type FeedEntry } from "@/lib/rss";', `const fetchFeed = async () => [{
    title: "月探査機の運用を開始",
    description: "月探査機による観測を開始しました。",
    link: "https://www.jaxa.jp/press/2026/11/20261127-1_j.html"
  }];`)
  .replace('import { filterNews, type NewsFilters } from "@/lib/news";', `const filterNews = (items, filters) => items.filter(item =>
    (!filters.source || item.source === filters.source) && (!filters.query || item.title.includes(filters.query))
  );`)
  .replace('import { translateJapanese } from "@/lib/translateJapanese";', `const translateJapanese = async (text) => {
    if (text === "Temporarily unavailable") throw new Error("worker interrupted");
    return "国際宇宙ステーションの観測";
  };`);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
});
const { getJapaneseNewsText, filterLocalizedNews } = await import("data:text/javascript;base64," + Buffer.from(outputText).toString("base64"));

const jaxa = {
  id: "jaxa",
  source: "JAXA",
  title: "Lunar spacecraft operations begin",
  summary: "",
  officialUrl: "https://global.jaxa.jp/press/2026/11/20261127-1_e.html"
};
const nasa = {
  id: "nasa",
  source: "NASA",
  title: "New observations at the International Space Station",
  summary: "NASA is preparing to install instruments aboard the Kibo (きぼう) module.",
  officialUrl: "https://www.nasa.gov/news-release/example/"
};

test("uses the matching official Japanese JAXA release, even with an empty English excerpt", async () => {
  assert.deepEqual(await getJapaneseNewsText(jaxa, "title"), {
    text: "月探査機の運用を開始", language: "ja", translated: false
  });
  assert.deepEqual(await getJapaneseNewsText(jaxa, "summary"), {
    text: "月探査機による観測を開始しました。", language: "ja", translated: false
  });
});

test("translates English news with an incidental Japanese term and preserves Japanese originals", async () => {
  assert.deepEqual(await getJapaneseNewsText(nasa, "summary"), {
    text: "国際宇宙ステーションの観測", language: "ja", translated: true
  });
  assert.deepEqual(await getJapaneseNewsText({ ...nasa, summary: "月の観測を始めました。" }, "summary"), {
    text: "月の観測を始めました。", language: "ja", translated: false
  });
});

test("keeps the source text readable when translation fails", async () => {
  assert.deepEqual(await getJapaneseNewsText({ ...nasa, summary: "Temporarily unavailable" }, "summary"), {
    text: "Temporarily unavailable", language: "en", translated: false
  });
});

test("Japanese headline search preserves agency filters and English searches", async () => {
  const items = [jaxa, nasa];
  assert.deepEqual(await filterLocalizedNews(items, { query: "月探査機" }, "ja"), [jaxa]);
  assert.deepEqual(await filterLocalizedNews(items, { query: "国際宇宙", source: "JAXA" }, "ja"), []);
  assert.deepEqual(await filterLocalizedNews(items, { query: "International Space Station" }, "ja"), [nasa]);
  assert.deepEqual(await filterLocalizedNews(items, { query: "月探査機" }, "en"), []);
});
