import Link from "next/link";
import type { ReactNode } from "react";
import { ALL_CATEGORIES } from "@/lib/news";

function buildHref(base: string, params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value && value !== "ALL") search.set(key, value);
  });
  const qs = search.toString();
  return qs ? `${base}?${qs}` : base;
}

function Chip({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
        active
          ? "border-cosmos-ice/40 bg-cosmos-ice/10 text-cosmos-ice"
          : "border-cosmos-line text-cosmos-muted hover:text-white hover:border-white/20"
      }`}
    >
      {children}
    </Link>
  );
}

export default function FilterBar({
  basePath,
  source,
  category,
  query
}: {
  basePath: string;
  source: string;
  category: string;
  query?: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {(["ALL", "NASA", "JAXA"] as const).map((s) => (
          <Chip key={s} href={buildHref(basePath, { source: s, category, q: query })} active={source === s}>
            {s}
          </Chip>
        ))}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        <Chip href={buildHref(basePath, { source, category: "ALL", q: query })} active={category === "ALL"}>
          All categories
        </Chip>
        {ALL_CATEGORIES.map((c) => (
          <Chip key={c} href={buildHref(basePath, { source, category: c, q: query })} active={category === c}>
            {c}
          </Chip>
        ))}
      </div>
    </div>
  );
}
