import { join } from "node:path";
import { Worker } from "node:worker_threads";
import { unstable_cache } from "next/cache";
import { loadTranslationModel, TRANSLATION_MODEL_VERSION } from "@/lib/translationModel";

const LANGUAGE_PAIR = { from: "en", to: "ja" };
const WORKER_TIMEOUT = 25_000;
const MAX_PENDING = 120;

type PendingCall = {
  resolve: (result: unknown) => void;
  reject: (error: Error) => void;
  timeout: NodeJS.Timeout;
};

class TranslationWorker {
  private readonly worker = new Worker(join(process.cwd(), "src/lib/translationWorker.mjs"));
  private readonly pending = new Map<number, PendingCall>();
  private sequence = 0;
  private stopped = false;

  constructor(private readonly onFailure: (error: Error) => void) {
    this.worker.on("message", ({ id, result, error }) => {
      const call = this.pending.get(id);
      if (!call) return;
      this.pending.delete(id);
      clearTimeout(call.timeout);
      if (this.pending.size === 0) this.worker.unref();
      if (error) call.reject(new Error(error.message));
      else call.resolve(result);
    });
    this.worker.on("error", (error) => this.stop(error));
    this.worker.on("exit", () => this.stop(new Error("The translation worker exited.")));
    this.worker.unref();
  }

  call(name: string, args: unknown[], transfer: ArrayBuffer[] = []): Promise<unknown> {
    if (this.stopped) return Promise.reject(new Error("The translation worker is unavailable."));
    const id = ++this.sequence;
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => this.stop(new Error("The translation worker timed out.")), WORKER_TIMEOUT);
      this.pending.set(id, { resolve, reject, timeout });
      this.worker.ref();
      try {
        this.worker.postMessage({ id, name, args }, transfer);
      } catch (error) {
        this.stop(error instanceof Error ? error : new Error("Could not reach the translation worker."));
      }
    });
  }

  stop(error: Error) {
    if (this.stopped) return;
    this.stopped = true;
    for (const call of this.pending.values()) {
      clearTimeout(call.timeout);
      call.reject(error);
    }
    this.pending.clear();
    this.onFailure(error);
    void this.worker.terminate();
  }
}

let workerPromise: Promise<TranslationWorker> | undefined;
let retryAfter = 0;

async function startWorker(onFailure: (error: Error) => void) {
  const worker = new TranslationWorker(onFailure);
  try {
    const [buffers] = await Promise.all([
      loadTranslationModel(),
      worker.call("initialize", [{ cacheSize: 2500 }])
    ]);
    await worker.call("loadTranslationModel", [LANGUAGE_PAIR, buffers], [
      buffers.model, buffers.shortlist, ...buffers.vocabs
    ]);
    return worker;
  } catch (error) {
    worker.stop(error instanceof Error ? error : new Error("Could not initialize the translation model."));
    throw error;
  }
}

function getWorker() {
  if (workerPromise) return workerPromise;
  if (Date.now() < retryAfter) return Promise.reject(new Error("The translation worker will retry shortly."));

  const reset = (error: Error) => {
    if (workerPromise !== starting) return;
    workerPromise = undefined;
    retryAfter = Date.now() + 30_000;
    console.warn("[COSMOS] Japanese news translation unavailable:", error.message);
  };
  const starting = startWorker(reset).catch((error) => {
    reset(error instanceof Error ? error : new Error("Could not start the translation worker."));
    throw error;
  });
  workerPromise = starting;
  return starting;
}

const inProgress = new Map<string, Promise<string>>();

async function runTranslation(text: string): Promise<string> {
  const worker = await getWorker();
  const result = await worker.call("translate", [{
    models: [LANGUAGE_PAIR],
    texts: [{ text, html: false }]
  }]);
  const translated = Array.isArray(result) ? result[0]?.target?.text : undefined;
  if (typeof translated !== "string" || !translated.trim()) {
    throw new Error("The article translation was empty.");
  }
  return translated.trim();
}

const cachedTranslation = unstable_cache(runTranslation, [TRANSLATION_MODEL_VERSION], { revalidate: 30 * 24 * 60 * 60 });

export function translateJapanese(text: string): Promise<string> {
  const active = inProgress.get(text);
  if (active) return active;
  if (inProgress.size >= MAX_PENDING) return Promise.reject(new Error("The translation queue is full."));

  const request = cachedTranslation(text).finally(() => inProgress.delete(text));
  inProgress.set(text, request);
  return request;
}
