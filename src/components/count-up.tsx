"use client";

import { useEffect, useRef, useState } from "react";

const DURATION = 900;

/**
 * Counts up to the last entry of `texts` (texts[i] is the text for the number i, already in the
 * right plural form, from countTexts) the first time it scrolls into view. The server renders the
 * final text; reduced motion skips the count.
 */
export function CountUp({ texts }: { texts: readonly string[] }) {
  const ref = useRef<HTMLSpanElement>(null);
  const value = texts.length - 1;
  const [current, setCurrent] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || value <= 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / DURATION);
          setCurrent(Math.round(value * (1 - (1 - p) ** 3)));
          if (p < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return <span ref={ref}>{texts[current]}</span>;
}
