"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Progressive enhancement: content remains visible without JS or motion support. */
export default function MotionSurface({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const surface = root.current;
    if (!surface || !("IntersectionObserver" in window)) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const hero = surface.querySelector<HTMLElement>(".space-hero");
    let heroVisible = false;
    const syncAmbient = () => {
      if (hero) hero.dataset.motion = heroVisible && !document.hidden && !preference.matches ? "running" : "paused";
      if (preference.matches) {
        animations.forEach((animation) => animation.cancel());
        animations.clear();
      }
    };

    const observer = new IntersectionObserver((entries) => {
      let order = 0;
      entries.forEach((entry) => {
        if (entry.target === hero) {
          heroVisible = entry.isIntersecting;
          syncAmbient();
          return;
        }
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (preference.matches || document.hidden || typeof entry.target.animate !== "function") return;
        const animation = entry.target.animate(
          [{ opacity: 0.2, translate: "0 36px" }, { opacity: 1, translate: "0 0" }],
          { duration: 1400, delay: Math.min(order++ * 140, 420), easing: "cubic-bezier(.2,.7,.2,1)" }
        );
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      });
    }, { threshold: 0.08 });

    surface.querySelectorAll(":scope > header:not(.space-hero), .section-heading, .motion-card").forEach((element) => observer.observe(element));
    if (hero) observer.observe(hero);
    document.addEventListener("visibilitychange", syncAmbient);
    preference.addEventListener("change", syncAmbient);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      document.removeEventListener("visibilitychange", syncAmbient);
      preference.removeEventListener("change", syncAmbient);
      if (hero) delete hero.dataset.motion;
    };
  }, [children]);

  return <div ref={root} className="page-shell max-w-shell mx-auto px-5 md:px-8 py-8 md:py-10">{children}</div>;
}
