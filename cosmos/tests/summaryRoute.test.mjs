import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { summaryModule } from "./summaryModule.mjs";

const oldKey = process.env.GEMINI_API_KEY;
const url = await summaryModule("app/api/summary/route.ts", (source) => source
  .replace('import { getAllNews } from "@/lib/news";', 'const getAllNews = async () => ({ items: [{ id: "known-article" }] });')
  .replace('import { generateSummary, SummaryError } from "@/lib/aiSummary";', 'class SummaryError extends Error {} const generateSummary = async (_article, locale) => ({ text: locale === "ja" ? "日本語の要約" : "Mock English brief" });')
);
const { POST } = await import(url);
afterEach(() => { if (oldKey === undefined) delete process.env.GEMINI_API_KEY; else process.env.GEMINI_API_KEY = oldKey; });
const request = (body, origin = "http://127.0.0.1:3000") => new Request("http://localhost:3000/api/summary", {
  method: "POST", headers: { host: "127.0.0.1:3000", origin }, body
});
test("incoming Host works even when Next reconstructs an internal URL", async () => {
  process.env.GEMINI_API_KEY = "test";
  const response = await POST(request(JSON.stringify({ id: "known-article" })));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).text, "Mock English brief");
  assert.equal(response.headers.get("cache-control"), "no-store");
});
test("Japanese requests use Japanese summaries and error messages", async () => {
  const body = JSON.stringify({ id: "known-article", locale: "ja" });
  process.env.GEMINI_API_KEY = "test";
  const available = await POST(request(body));
  assert.equal(available.status, 200);
  assert.equal((await available.json()).text, "日本語の要約");

  delete process.env.GEMINI_API_KEY;
  const unavailable = await POST(request(body));
  assert.equal(unavailable.status, 503);
  assert.match((await unavailable.json()).error, /AI要約を利用できません/);
});
test("unsupported languages are rejected", async () => {
  const response = await POST(request(JSON.stringify({ id: "known-article", locale: "fr" })));
  assert.equal(response.status, 400);
});
test("cross-origin and malformed origins are rejected", async () => {
  for (const origin of ["https://other.example", "null"]) assert.equal((await POST(request("{}", origin))).status, 403);
});
test("malformed and oversized requests are rejected", async () => {
  for (const body of ["bad JSON", "null", "{}", '{"id":"https://example.com"}']) assert.equal((await POST(request(body))).status, 400);
  assert.equal((await POST(request("a".repeat(2049)))).status, 413);
});
test("missing key is reported without depending on upstream feeds", async () => {
  delete process.env.GEMINI_API_KEY;
  assert.equal((await POST(request('{"id":"known-article"}'))).status, 503);
});
test("unknown article cannot be sent to AI", async () => {
  process.env.GEMINI_API_KEY = "test";
  assert.equal((await POST(request('{"id":"unknown"}'))).status, 404);
});
