import Link from "next/link";
import type { ReactNode } from "react";
import { ALL_CATEGORIES } from "@/lib/news";
import { getLocalization } from "@/lib/localization";

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
      className={`motion-control shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
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
  const { copy } = getLocalization();

  return (
    <div className="space-y-3">
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {(["ALL", "NASA", "JAXA"] as const).map((s) => (
          <Chip key={s} href={buildHref(basePath, { source: s, category, q: query })} active={source === s}>
            {s === "ALL" ? copy.common.all : s}
          </Chip>
        ))}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        <Chip href={buildHref(basePath, { source, category: "ALL", q: query })} active={category === "ALL"}>
          {copy.common.allCategories}
        </Chip>
        {ALL_CATEGORIES.map((c) => (
          <Chip key={c} href={buildHref(basePath, { source, category: c, q: query })} active={category === c}>
            {copy.category[c]}
          </Chip>
        ))}
      </div>
    </div>
  );
}
