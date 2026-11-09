"use client";

import { useEffect, useRef, useState } from "react";
import { bs } from "@/components/classes";
import { onIdle } from "@/lib/idle";
import type { PiScene } from "./scene";

/** Matches the CSS breakpoint that shows the side art (layout.css, .bs-sideArt). */
const WIDE_QUERY = "(min-width: 1880px)";
/** Yaw added over the whole page (rad); a wider range would shrink the fitted model. */
const TURN = 0.9;

/**
 * Large wireframe build in the right page margin on wide screens. No ambient animation: it renders
 * only when the page scrolls, exploding towards the middle of the page and closing again at the
 * end while it turns. Nothing glass sits above the margin, so a frame costs one small WebGL draw.
 * The scene is created only while the margin is wide enough and disposed when it narrows.
 */
export function PiSide() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const wide = window.matchMedia(WIDE_QUERY);
    const scrollDriven = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let scene: PiScene | null = null;
    let cancelled = false;
    let cancelIdle = () => {};
    let frame = 0;

    const applyScroll = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      scene?.setScroll(Math.sin(Math.PI * p), p);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(applyScroll);
    };

    const start = () => {
      import("./scene")
        .then(({ createPiScene }) => {
          if (cancelled || scene || !wide.matches) return;
          scene = createPiScene({ host, open: false, ambient: false, turn: TURN, onReady: () => setReady(true) });
          applyScroll();
          if (scrollDriven) window.addEventListener("scroll", onScroll, { passive: true });
        })
        .catch(() => {
          // No WebGL: the margin simply stays empty.
        });
    };

    const stop = () => {
      cancelIdle();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      frame = 0;
      scene?.dispose();
      scene = null;
      setReady(false);
    };

    const onWideChange = () => {
      if (wide.matches) cancelIdle = onIdle(start);
      else stop();
    };
    wide.addEventListener("change", onWideChange);
    if (wide.matches) cancelIdle = onIdle(start);

    return () => {
      cancelled = true;
      wide.removeEventListener("change", onWideChange);
      stop();
    };
  }, []);

  return (
    <div className={`${bs.sideArt} ${bs.sideRight}`} aria-hidden="true">
      <div ref={hostRef} className={bs.sidePi} data-ready={ready || undefined} />
    </div>
  );
}
