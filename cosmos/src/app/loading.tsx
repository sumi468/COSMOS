import { getLocalization } from "@/lib/localization";

export default function Loading() {
  const { copy } = getLocalization();

  return (
    <div className="page-shell max-w-shell mx-auto px-5 md:px-8 py-8 md:py-10" role="status" aria-label={copy.common.loading}>
      <p className="eyebrow text-cosmos-accent flex items-center gap-3"><span className="loading-beacon" aria-hidden="true" /> {copy.common.exploring}</p>
      <div aria-hidden="true" className="mt-7 space-y-6">
        <div className="loading-placeholder h-10 w-2/3 rounded-lg" />
        <div className="loading-placeholder h-52 rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="loading-placeholder h-32 rounded-xl" />
          <div className="loading-placeholder h-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
