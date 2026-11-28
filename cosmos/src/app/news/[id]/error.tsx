"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function NewsDetailError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { copy } = useLanguage();

  useEffect(() => {
    // Still log for developers — but the person sees a real message, not a blank screen.
    console.error("[COSMOS] Failed to load article:", error);
  }, [error]);

  return (
    <div className="max-w-shell mx-auto px-5 md:px-8 py-16 text-center">
      <p className="font-display text-lg text-cosmos-ink">{copy.newsError.loadFailed}</p>
      <p className="mt-2 text-sm text-cosmos-muted max-w-sm mx-auto">
        {copy.newsError.retryHint}
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="primary-button"
        >
          {copy.retry}
        </button>
        <Link href="/latest" className="text-sm text-cosmos-muted hover:text-cosmos-ink">
          {copy.newsError.back}
        </Link>
      </div>
    </div>
  );
}
