import { formatSourceError, getLocalization } from "@/lib/localization";
import type { SourceFetchError } from "@/types/cosmos";

export function EmptyState({ title, message }: { title: string; message?: string }) {
  return (
    <div className="rounded-xl border border-cosmos-line py-14 px-6 text-center">
      <p className="font-display text-base text-white">{title}</p>
      {message && <p className="mt-2 text-sm text-cosmos-muted max-w-sm mx-auto">{message}</p>}
    </div>
  );
}

export function SourceErrorNotice({ errors }: { errors: SourceFetchError[] }) {
  if (errors.length === 0) return null;
  const { locale } = getLocalization();
  return (
    <div className="rounded-lg border border-cosmos-amber/30 bg-cosmos-amber/[0.06] px-4 py-3 text-sm text-cosmos-amber">
      {errors.map((e, i) => (
        <p key={i}>{formatSourceError(e, locale)}</p>
      ))}
    </div>
  );
}
