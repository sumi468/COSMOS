"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function NewsDetailError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Still log for developers — but the person sees a real message, not a blank screen.
    console.error("[COSMOS] Failed to load article:", error);
  }, [error]);

  return (
    <div className="max-w-shell mx-auto px-5 md:px-8 py-16 text-center">
      <p className="font-display text-lg text-white">要約を取得できませんでした</p>
      <p className="mt-2 text-sm text-cosmos-muted max-w-sm mx-auto">
        This article couldn&rsquo;t be loaded right now. Please try again, or head back to Latest.
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="rounded-lg bg-cosmos-ice text-cosmos-black text-sm font-medium px-4 py-2 hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
        <Link href="/latest" className="text-sm text-cosmos-muted hover:text-white">
          Back to Latest
        </Link>
      </div>
    </div>
  );
}
