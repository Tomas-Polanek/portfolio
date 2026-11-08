"use client";

import { useEffect, useRef } from "react";
import { s as styles } from "../classes";

/** Cursor-following radial glow (dark theme only via CSS; off under prefers-reduced-motion). */
export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--x", `${event.clientX}px`);
        el.style.setProperty("--y", `${event.clientY}px`);
        el.dataset.active = "true";
      });
    };

    const sync = () => {
      window.removeEventListener("pointermove", move);
      if (!reduced.matches) window.addEventListener("pointermove", move, { passive: true });
    };

    sync();
    reduced.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(frame);
      reduced.removeEventListener("change", sync);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return <div ref={ref} className={styles.spotlight} aria-hidden="true" />;
}
