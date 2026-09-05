export default function SearchBar({ action, defaultValue }: { action: string; defaultValue?: string }) {
  return (
    <form action={action} method="get" role="search" className="relative">
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Search ISS, Artemis, H3, James Webb\u2026"
        className="w-full rounded-xl border border-cosmos-line bg-cosmos-panel2 px-4 py-2.5 pr-10 text-sm text-white placeholder:text-cosmos-muted focus:border-cosmos-ice/40 outline-none"
      />
      <button
        type="submit"
        aria-label="Search"
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
