import { createRequire } from "node:module";
import { dirname } from "node:path";
import { pathToFileURL } from "node:url";

// Bergamot's worker uses CommonJS globals when running under Node even
// though its npm package is ESM. Supply them inside this worker only.
const require = createRequire(import.meta.url);
const entry = require.resolve("@browsermt/bergamot-translator/worker/translator-worker.js");
globalThis.require = createRequire(entry);
globalThis.__filename = entry;
globalThis.__dirname = dirname(entry);
await import(pathToFileURL(entry).href);
