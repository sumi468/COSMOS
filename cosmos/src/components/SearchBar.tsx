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
        className="w-full rounded-xl border border-cosmos-line bg-cosmos-panel2 px-4 py-2.5 pr-10 text-sm text-white placeholder:text-cosmos-muted focus:border-cosmos-ice/40 outline-none"
      />
      <button
        type="submit"
        aria-label={copy.common.search}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-cosmos-muted hover:text-white"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="11" cy="11" r="6.5" />
          <path d="M20 20l-4.3-4.3" strokeLinecap="round" />
        </svg>
      </button>
    </form>
  );
}
