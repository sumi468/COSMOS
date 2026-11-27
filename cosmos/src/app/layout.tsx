import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import LanguageProvider from "@/components/LanguageProvider";
import Navigation from "@/components/Navigation";
import { getLocalization } from "@/lib/localization";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display"
});
const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body"
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono"
});

export function generateMetadata(): Metadata {
  const { copy } = getLocalization();
  return {
    title: { default: copy.meta.title, template: "%s — COSMOS" },
    description: copy.meta.description,
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: "COSMOS"
    },
    icons: {
      icon: [
        { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }
      ],
      apple: "/icons/apple-touch-icon.png"
    }
  };
}

export const viewport: Viewport = {
  themeColor: "#05070B",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const { locale, copy } = getLocalization();

  return (
    <html lang={locale} className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-cosmos-black text-cosmos-white font-body min-h-screen">
        <LanguageProvider
          locale={locale}
          copy={{
            nav: copy.nav,
            languageLabel: copy.settings.language,
            retry: copy.common.tryAgain,
            countdown: { inProgress: copy.event.inProgress, units: copy.event.units },
            newsError: { loadFailed: copy.news.loadFailed, retryHint: copy.news.retryHint, back: copy.news.back }
          }}
        >
          <div className="flex">
            <Navigation />
            <main className="flex-1 min-w-0 pb-24 md:pb-0">{children}</main>
          </div>
        </LanguageProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}

function ServiceWorkerRegister() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
              navigator.serviceWorker.register('/sw.js').catch(function () {});
            });
          }
        `
      }}
    />
  );
}
