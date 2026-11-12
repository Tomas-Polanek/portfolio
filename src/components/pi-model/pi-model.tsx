"use client";

import { useEffect, useRef, useState } from "react";
import { onIdle } from "@/lib/idle";
import { REDUCED_MOTION_QUERY } from "@/lib/media";
import { Pi5Sketch } from "./pi5-sketch";
import type { PiScene } from "./scene";

/**
 * Wireframe 3D model of the homelab build (Pi 5 + Active Cooler + X1001 + 990 PRO). three.js is
 * fetched once the tile nears the viewport and the main thread is idle, so its parse and scene
 * build (~150 ms on a 4× throttled CPU) stay out of hydration; the SVG sketch stays as poster until
 * the first frame (and if WebGL fails). The build explodes as the tile scrolls up the viewport and
 * on hover, tap or Enter/Space.
 */
export function PiModel({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<PiScene | null>(null);
  const openRef = useRef(open);
  const mouseDown = useRef(false);

  useEffect(() => {
    openRef.current = open;
    sceneRef.current?.setOpen(open);
  }, [open]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let cancelIdle = () => {};
    let frame = 0;

    // Explodes as the tile scrolls up the viewport: 0 while its top is below 60 % of the
    // viewport, 1 once it has risen another half viewport. Hover/tap still explode it fully.
    const applyScroll = () => {
      frame = 0;
      const top = host.getBoundingClientRect().top;
      const vh = window.innerHeight;
      sceneRef.current?.setScroll((vh * 0.6 - top) / (vh * 0.5));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(applyScroll);
    };
    const scrollDriven = !window.matchMedia(REDUCED_MOTION_QUERY).matches;

    const load = () => {
      import("./scene")
        .then(({ createPiScene }) => {
          if (cancelled) return;
          sceneRef.current = createPiScene({
            host,
            open: openRef.current,
            onReady: () => setReady(true),
          });
          if (scrollDriven) {
            applyScroll();
            window.addEventListener("scroll", onScroll, { passive: true });
          }
        })
        .catch(() => {
          // No WebGL (or the chunk failed to load): the SVG poster stays.
        });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        cancelIdle = onIdle(load);
      },
      { rootMargin: "300px" },
    );
    observer.observe(host);

    return () => {
      cancelled = true;
      observer.disconnect();
      cancelIdle();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      sceneRef.current?.dispose();
      sceneRef.current = null;
      setReady(false);
    };
  }, []);

  return (
    <div className="bs-pi3d" data-ready={ready || undefined}>
      <Pi5Sketch />
      <div ref={hostRef} className="bs-pi3dCanvas" />
      <button
        type="button"
        className="bs-pi3dBtn"
        aria-pressed={open}
        aria-label={label}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") setOpen(true);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") setOpen(false);
        }}
        onBlur={() => setOpen(false)}
        onPointerDown={(e) => {
          mouseDown.current = e.pointerType === "mouse";
        }}
        onClick={() => {
          // Mouse users already explode it by hovering; taps and Enter/Space toggle.
          if (!mouseDown.current) setOpen((v) => !v);
          mouseDown.current = false;
        }}
      />
    </div>
  );
}
