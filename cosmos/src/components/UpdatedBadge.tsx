import { updatedLabel } from "@/lib/format";
import { getLocalization } from "@/lib/localization";

export default function UpdatedBadge({ updatedAt, stale }: { updatedAt: string; stale?: boolean }) {
  const { locale, copy } = getLocalization();

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs ${stale ? "text-cosmos-warning" : "text-cosmos-muted"}`}
      title={new Date(updatedAt).toLocaleString(locale)}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${stale ? "bg-cosmos-warning" : "bg-cosmos-teal"}`}
        aria-hidden
      />
      {stale ? copy.time.savedData : updatedLabel(updatedAt, locale)}
    </span>
  );
}
