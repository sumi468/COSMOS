import { getLocalization } from "@/lib/localization";

export default function SearchBar({ action, defaultValue }: { action: string; defaultValue?: string }) {
  const { copy } = getLocalization();

  return (
    <form action={action} method="get" role="search" className="relative">
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        aria-label={copy.common.search}
        placeholder={copy.common.searchPlaceholder}
        className="min-h-11 w-full rounded-full border border-cosmos-line bg-cosmos-surface px-4 pr-12 text-sm text-cosmos-ink placeholder:text-cosmos-muted focus:border-cosmos-accent/40 outline-none"
      />
      <button
        type="submit"
        aria-label={copy.common.search}
        className="absolute right-0 top-0 grid h-full w-11 place-items-center rounded-full text-cosmos-accent hover:bg-cosmos-accent/10"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" strokeWidth="1.8">
          <circle cx="11" cy="11" r="6.5" />
          <path d="M20 20l-4.3-4.3" strokeLinecap="round" />
        </svg>
      </button>
    </form>
  );
}
