"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

// Measures the DOM and builds SVG filters on mount: client only, loaded on demand.
const LiquidGlass = dynamic(() => import("liquid-glass-react"), { ssr: false });

/**
 * Real refraction only where it shows and is cheap enough: a fine pointer (not phones/tablets) and
 * a browser that knows `prefers-reduced-transparency` (Chromium; it is also the only engine that
 * renders the displacement). Everywhere else the CSS frosted fallback is used.
 */
const LIQUID_QUERY = "(pointer: fine) and (prefers-reduced-transparency: no-preference)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(LIQUID_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const getLiquid = () => window.matchMedia(LIQUID_QUERY).matches;
const getServerLiquid = () => false;

/*
 * Tailwind classes used inside liquid-glass-react (Tailwind does not scan node_modules):
 * bg-black opacity-0 opacity-20 opacity-100 mix-blend-overlay transition-all duration-150
 * ease-in-out pointer-events-none text-white
 */

/**
 * Glass surface behind a tile's content. Put it first inside a `.bn-tile` (or the panel): it fills
 * the parent, sits under the content (z-index -1 in the tile's isolated stacking context) and
 * refracts the page backdrop. `liquid={false}` forces the cheap CSS frosted glass, for small
 * repeated tiles.
 */
export function GlassLayer({
  radius = 24,
  liquid: allowLiquid = true,
  className = "",
}: {
  radius?: number;
  liquid?: boolean;
  className?: string;
}) {
  const supported = useSyncExternalStore(subscribe, getLiquid, getServerLiquid);
  const liquid = allowLiquid && supported;
  const ref = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!liquid || !el) return;
    const observer = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      const h = Math.round(entry.contentRect.height);
      setSize((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h }));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [liquid]);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`bs-glass ${liquid && size ? "" : "bs-glassFallback"} ${className}`}
    >
      {liquid && size && (
        <LiquidGlass
          // The library centres itself on top/left with translate(-50%, -50%).
          style={{ position: "absolute", top: "50%", left: "50%" }}
          cornerRadius={radius}
          elasticity={0}
          displacementScale={60}
          blurAmount={0.06}
          saturation={140}
          aberrationIntensity={1.5}
          padding="0px"
        >
          <span style={{ display: "block", width: size.w, height: size.h }} />
        </LiquidGlass>
      )}
    </span>
  );
}
