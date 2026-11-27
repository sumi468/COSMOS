import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { summaryModule } from "./summaryModule.mjs";

const originalFetch = globalThis.fetch;
const oldKey = process.env.GEMINI_API_KEY;
const oldModel = process.env.GEMINI_SUMMARY_MODEL;
const url = await summaryModule("lib/aiSummary.ts");
let moduleNumber = 0;
const fresh = () => import(`${url}#${moduleNumber++}`);
const article = { title: "Test mission", officialUrl: "https://www.nasa.gov/test", summary: "NASA announced a science mission. The spacecraft will study the Moon, with its launch date still under review." };
const output = (text = "NASA announced a planned lunar science mission. A launch date has not been confirmed.") => ({ status: "completed", steps: [{ type: "thought", content: [{ type: "text", text: "Private reasoning" }] }, { type: "model_output", content: [{ type: "text", text }] }] });
afterEach(() => {
  globalThis.fetch = originalFetch;
  if (oldKey === undefined) delete process.env.GEMINI_API_KEY; else process.env.GEMINI_API_KEY = oldKey;
  if (oldModel === undefined) delete process.env.GEMINI_SUMMARY_MODEL; else process.env.GEMINI_SUMMARY_MODEL = oldModel;
});

test("missing key gives a useful error without calling the provider", async () => {
  delete process.env.GEMINI_API_KEY;
  globalThis.fetch = () => { throw new Error("must not fetch"); };
  await assert.rejects((await fresh()).generateSummary(article), { status: 503 });
});
test("short or placeholder content is not sent to AI", async () => {
  process.env.GEMINI_API_KEY = "test-key";
  const { generateSummary } = await fresh();
  for (const summary of ["", "short", "This is a Japanese-language press release with no separate English-language article. See the official source for details."]) {
    await assert.rejects(generateSummary({ ...article, summary }), { status: 422 });
  }
});
test("uses full source, English instructions, server credential and extracts message after reasoning", async () => {
  process.env.GEMINI_API_KEY = "test-key";
  process.env.GEMINI_SUMMARY_MODEL = "configured-model";
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "https://generativelanguage.googleapis.com/v1beta/interactions");
    assert.equal(options.headers["x-goog-api-key"], "test-key");
    assert.equal(options.headers.Authorization, undefined);
    const body = JSON.parse(options.body);
    assert.match(body.system_instruction, /in English/);
    assert.equal(body.generation_config.thinking_level, "minimal");
    assert.equal(body.model, "configured-model");
    assert.equal(body.store, false);
    assert.equal(JSON.parse(body.input).source, article.summary.repeat(3));
    return Response.json(output());
  };
  const result = await (await fresh()).generateSummary({ ...article, sourceText: article.summary.repeat(3) });
  assert.match(result.text, /lunar science/);
});
test("concurrent and repeated requests share one generation; changed source invalidates it", async () => {
  process.env.GEMINI_API_KEY = "test-key";
  let calls = 0;
  globalThis.fetch = async () => { calls++; return Response.json(output()); };
  const { generateSummary } = await fresh();
  await Promise.all([generateSummary(article), generateSummary(article)]);
  await generateSummary(article);
  assert.equal(calls, 1);
  await generateSummary({ ...article, summary: article.summary + " Updated." });
  assert.equal(calls, 2);
});
test("generates and caches separate English and Japanese summaries for the same article", async () => {
  process.env.GEMINI_API_KEY = "test-key";
  const japaneseText = "NASAは月を調査する科学ミッションを発表しました。打ち上げ日はまだ決まっていません。";
  const calls = [];
  globalThis.fetch = async (_, options) => {
    const { system_instruction } = JSON.parse(options.body);
    calls.push(system_instruction);
    return Response.json(/in Japanese/.test(system_instruction) ? output(japaneseText) : output());
  };

  const { generateSummary } = await fresh();
  const [english, japanese, duplicateJapanese] = await Promise.all([
    generateSummary(article),
    generateSummary(article, "ja"),
    generateSummary(article, "ja")
  ]);

  assert.match(english.text, /lunar science/);
  assert.equal(japanese.text, japaneseText);
  assert.deepEqual(duplicateJapanese, japanese);
  assert.deepEqual(await generateSummary(article, "en"), english);
  assert.deepEqual(await generateSummary(article, "ja"), japanese);
  assert.equal(calls.length, 2);
  assert.match(calls[0], /in English/);
  assert.match(calls[1], /in Japanese/);
});
for (const [name, response] of [
  ["incomplete output", () => Response.json({ ...output(), status: "incomplete" })],
  ["empty output", () => Response.json(output(""))],
  ["refusal", () => Response.json({ status: "completed", steps: [{ type: "model_output", content: [{ type: "refusal", refusal: "No" }] }] })],
  ["invalid JSON", () => new Response("bad")],
  ["provider error", () => new Response("private error", { status: 401 })],
  ["network timeout", () => { throw new DOMException("Timeout", "TimeoutError"); }]
]) test(`${name} is not cached and retry can succeed`, async () => {
  process.env.GEMINI_API_KEY = "test-key";
  const { generateSummary } = await fresh();
  globalThis.fetch = response;
  await assert.rejects(generateSummary(article), { status: 502 });
  globalThis.fetch = async () => Response.json(output());
  assert.ok((await generateSummary(article)).text);
});
test("provider rate limit is surfaced as retryable", async () => {
  process.env.GEMINI_API_KEY = "test-key";
  globalThis.fetch = async () => new Response("", { status: 429 });
  await assert.rejects((await fresh()).generateSummary(article), { status: 429 });
});
test("per-instance generation budget caps new requests while cached results remain available", async () => {
  process.env.GEMINI_API_KEY = "test-key";
  globalThis.fetch = async () => Response.json(output());
  const { generateSummary } = await fresh();
  for (let i = 0; i < 20; i++) await generateSummary({ ...article, title: `Article ${i}` });
  await assert.rejects(generateSummary(article), { status: 429 });
  assert.ok((await generateSummary({ ...article, title: "Article 0" })).text);
});
