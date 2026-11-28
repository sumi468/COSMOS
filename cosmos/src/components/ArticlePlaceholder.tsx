import type { Agency } from "@/types/cosmos";

/** A calm gradient + orbit motif, never a broken-image icon or blank box. */
export default function ArticlePlaceholder({ source, className = "" }: { source?: Agency; className?: string }) {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cosmos-inset to-cosmos-bg ${className}`}
      aria-hidden
    >
      <svg width="34%" height="34%" viewBox="0 0 64 64" fill="none" className="text-cosmos-accent">
        <ellipse cx="32" cy="32" rx="26" ry="12" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
        <circle cx="32" cy="32" r="9" fill="currentColor" fillOpacity="0.25" />
        <circle cx="32" cy="32" r="9" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5" />
        <circle cx="53" cy="24" r="2.4" fill="currentColor" fillOpacity="0.6" />
      </svg>
      {source && (
        <span className="absolute bottom-2 right-2.5 text-[10px] tracking-wide text-cosmos-muted">
          {source}
        </span>
      )}
    </div>
  );
}
