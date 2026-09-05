import type { Agency } from "@/types/cosmos";

/** A calm gradient + orbit motif, never a broken-image icon or blank box. */
export default function ArticlePlaceholder({ source, className = "" }: { source?: Agency; className?: string }) {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cosmos-panel2 to-cosmos-black ${className}`}
      aria-hidden
    >
      <svg width="34%" height="34%" viewBox="0 0 64 64" fill="none">
        <ellipse cx="32" cy="32" rx="26" ry="12" stroke="#AEE3F5" strokeOpacity="0.35" strokeWidth="1.5" />
        <circle cx="32" cy="32" r="9" fill="#49D4E8" fillOpacity="0.25" />
        <circle cx="32" cy="32" r="9" stroke="#49D4E8" strokeOpacity="0.5" strokeWidth="1.5" />
        <circle cx="53" cy="24" r="2.4" fill="#F4F7FA" fillOpacity="0.6" />
      </svg>
      {source && (
        <span className="absolute bottom-2 right-2.5 text-[10px] tracking-wide text-cosmos-muted/50">
          {source}
        </span>
      )}
    </div>
  );
}
