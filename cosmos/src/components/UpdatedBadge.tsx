import { updatedLabel } from "@/lib/format";

export default function UpdatedBadge({ updatedAt, stale }: { updatedAt: string; stale?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs ${stale ? "text-cosmos-amber" : "text-cosmos-muted"}`}
      title={new Date(updatedAt).toLocaleString()}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${stale ? "bg-cosmos-amber" : "bg-cosmos-cyan"}`}
        aria-hidden
      />
      {stale ? "Showing last saved data" : updatedLabel(updatedAt)}
    </span>
  );
}
