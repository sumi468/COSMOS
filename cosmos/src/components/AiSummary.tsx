"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { summaryCopy } from "@/lib/summaryCopy";

export default function AiSummary({ id }: { id: string }) {
  const { locale, copy } = useLanguage();
  const summary = summaryCopy[locale];
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);

  async function generate() {
    if (controller.current) return;
    const current = new AbortController();
    controller.current = current;
    const timeout = setTimeout(() => current.abort(), 55_000);
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/summary", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, locale }), signal: current.signal
      });
      const data = await response.json();
      if (!response.ok) {
        setError(typeof data?.error === "string" ? data.error : summary.errors.failed);
        return;
      }
      if (typeof data?.text !== "string" || !data.text.trim()) {
        setError(summary.empty);
        return;
      }
      setText(data.text);
    } catch {
      setError(current.signal.aborted ? summary.timedOut : summary.errors.failed);
    } finally {
      clearTimeout(timeout);
      controller.current = null;
      setLoading(false);
    }
  }

  return (
    <section className="ai-summary mt-8 rounded-2xl p-5 md:p-6" aria-labelledby="ai-summary-heading" aria-busy={loading}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="ai-summary-heading" className="eyebrow text-cosmos-ice">{summary.heading}</h2>
        <span className="text-xs text-cosmos-muted">{summary.tagline}</span>
      </div>
      <div aria-live="polite">
        {text ? <p className="mt-4 text-[15px] leading-7 text-cosmos-white whitespace-pre-line">{text}</p> :
          <p className="mt-3 text-sm leading-relaxed text-cosmos-muted">{summary.description}</p>}
        {loading && <p className="mt-4 text-sm text-cosmos-ice">{summary.preparing}</p>}
        {error && <p role="alert" className="mt-4 text-sm text-cosmos-amber">{error}</p>}
      </div>
      {!text && <button type="button" onClick={generate} disabled={loading} className="mt-4 rounded-full bg-cosmos-ice px-5 py-2.5 text-sm font-medium text-cosmos-black transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-wait">{loading ? summary.generating : error ? copy.retry : summary.generate}</button>}
      {text && <p className="mt-4 text-xs text-cosmos-muted">{summary.disclaimer}</p>}
    </section>
  );
}
