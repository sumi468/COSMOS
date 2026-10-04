import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const oldKey = process.env.GEMINI_API_KEY;
const source = (await readFile(new URL("../src/app/api/summary/route.ts", import.meta.url), "utf8"))
  .replace('import { getAllNews } from "@/lib/news";', 'const getAllNews = async () => ({ items: [{ id: "known-article" }] });')
  .replace('import { generateSummary, SummaryError } from "@/lib/aiSummary";', 'class SummaryError extends Error {} const generateSummary = async () => ({ text: "Mock English brief" });');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { POST } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
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
