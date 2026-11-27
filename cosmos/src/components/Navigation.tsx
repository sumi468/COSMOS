"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";

const ITEMS = [
  { href: "/", label: "home", icon: HomeIcon },
  { href: "/latest", label: "latest", icon: LatestIcon },
  { href: "/missions", label: "missions", icon: MissionsIcon },
  { href: "/upcoming", label: "upcoming", icon: UpcomingIcon },
  { href: "/images", label: "images", icon: ImagesIcon },
  { href: "/settings", label: "settings", icon: SettingsIcon }
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function Navigation() {
  const pathname = usePathname();
  const { copy } = useLanguage();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="space-sidebar hidden md:flex md:flex-col md:w-48 lg:w-52 md:shrink-0 md:border-r md:border-cosmos-line md:sticky md:top-0 md:overflow-y-auto md:py-7 md:px-4">
        <Link href="/" className="space-brand flex items-center gap-2.5 px-2 mb-8">
          <span className="cosmos-mark" aria-hidden="true">✦</span>
          <span className="font-display text-sm font-semibold tracking-[0.24em]">COSMOS</span>
        </Link>
        <nav aria-label={copy.nav.label} className="flex flex-col gap-1">
          {ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`nav-link flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "nav-active text-white"
                    : "text-cosmos-muted hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <Icon active={active} />
                {copy.nav[label]}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-8">
          <p className="sidebar-sources px-2 pt-4 text-xs leading-relaxed text-cosmos-muted">
            {copy.nav.sources}
            <br />
            {copy.nav.independent}
          </p>
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav
        aria-label={copy.nav.label}
        className="space-mobile-nav md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-cosmos-line bg-cosmos-black/95 backdrop-blur supports-[backdrop-filter]:bg-cosmos-black/80"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="grid grid-cols-6">
          {ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`nav-link flex flex-col items-center justify-start gap-1 py-2.5 text-center text-[10px] ${
                  active ? "text-cosmos-ice" : "text-cosmos-muted"
                }`}
              >
                <Icon active={active} />
                {copy.nav[label]}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

type IconProps = { active?: boolean };
const strokeFor = (active?: boolean) => (active ? "#EBC797" : "currentColor");

function HomeIcon({ active }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={strokeFor(active)} strokeWidth="1.6">
      <path d="M4 11.5 12 4l8 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9h12v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function LatestIcon({ active }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={strokeFor(active)} strokeWidth="1.6">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 9h8M8 13h8M8 17h4" strokeLinecap="round" />
    </svg>
  );
}
function MissionsIcon({ active }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={strokeFor(active)} strokeWidth="1.6">
      <path
        d="M12 3c2.5 2.7 4 6 4 9.5 0 1.7-.4 3.3-1 4.5l-3-1-3 1c-.6-1.2-1-2.8-1-4.5C8 9 9.5 5.7 12 3Z"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10.5" r="1.4" />
    </svg>
  );
}
function UpcomingIcon({ active }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={strokeFor(active)} strokeWidth="1.6">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ImagesIcon({ active }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={strokeFor(active)} strokeWidth="1.6">
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <circle cx="9" cy="10.5" r="1.5" />
      <path d="M4 17l5-5 4 4 3-3 4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function SettingsIcon({ active }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={strokeFor(active)} strokeWidth="1.6">
      <circle cx="12" cy="12" r="3" />
      <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14.2 3H9.8l-.4 2.6a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9c.6.5 1.3.9 2 1.2l.4 2.6h4.4l.4-2.6a7 7 0 0 0 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z" strokeLinejoin="round" />
    </svg>
  );
}
