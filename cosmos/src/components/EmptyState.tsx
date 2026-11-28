import { formatSourceError, getLocalization } from "@/lib/localization";
import type { SourceFetchError } from "@/types/cosmos";

export function EmptyState({ title, message }: { title: string; message?: string }) {
  return (
    <div className="rounded-2xl border border-cosmos-line bg-cosmos-surface py-14 px-6 text-center">
      <p className="font-display text-base text-cosmos-ink">{title}</p>
      {message && <p className="mt-2 text-sm text-cosmos-muted max-w-sm mx-auto">{message}</p>}
    </div>
  );
}

export function SourceErrorNotice({ errors }: { errors: SourceFetchError[] }) {
  if (errors.length === 0) return null;
  const { locale } = getLocalization();
  return (
    <div className="rounded-lg border border-cosmos-warning/30 bg-cosmos-warning/[0.06] px-4 py-3 text-sm text-cosmos-warning">
      {errors.map((e, i) => (
        <p key={i}>{formatSourceError(e, locale)}</p>
      ))}
    </div>
  );
}
