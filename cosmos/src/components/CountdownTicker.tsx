"use client";

import { useEffect, useState } from "react";
import { countdownTo } from "@/lib/format";

export default function CountdownTicker({ netDate, compact = false }: { netDate: string; compact?: boolean }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Render a stable, non-ticking placeholder on the server / first paint
  // to avoid hydration mismatches, then take over client-side.
  if (!now) {
    return <span className="font-mono tabular-nums text-cosmos-cyan">T&minus;&hellip;</span>;
  }

  const c = countdownTo(netDate, now);
  if (c.isPast) {
    return <span className="font-mono tabular-nums text-cosmos-muted">In progress / TBD</span>;
  }

  if (compact) {
    return (
      <span className="font-mono tabular-nums text-cosmos-cyan">
        T&minus;{c.days}D {String(c.hours).padStart(2, "0")}H
      </span>
    );
  }

  return (
    <span className="font-mono tabular-nums text-cosmos-cyan text-lg">
      T&minus;{c.days}D {String(c.hours).padStart(2, "0")}H {String(c.minutes).padStart(2, "0")}M{" "}
      {String(c.seconds).padStart(2, "0")}S
    </span>
  );
}
