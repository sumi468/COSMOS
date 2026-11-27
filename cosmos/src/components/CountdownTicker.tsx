"use client";

import { useEffect, useState } from "react";
import { countdownTo } from "@/lib/format";
import { useLanguage } from "@/components/LanguageProvider";

export default function CountdownTicker({ netDate, compact = false }: { netDate: string; compact?: boolean }) {
  const { copy } = useLanguage();
  const { units } = copy.countdown;
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
    return <span className="font-mono tabular-nums text-cosmos-muted">{copy.countdown.inProgress}</span>;
  }

  if (compact) {
    return (
      <span className="font-mono tabular-nums text-cosmos-cyan">
        T&minus;{c.days}{units.days} {String(c.hours).padStart(2, "0")}{units.hours}
      </span>
    );
  }

  return (
    <span className="font-mono tabular-nums text-cosmos-cyan text-lg">
      T&minus;{c.days}{units.days} {String(c.hours).padStart(2, "0")}{units.hours} {String(c.minutes).padStart(2, "0")}{units.minutes}{" "}
      {String(c.seconds).padStart(2, "0")}{units.seconds}
    </span>
  );
}
