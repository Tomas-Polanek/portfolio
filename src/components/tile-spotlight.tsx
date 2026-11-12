"use client";

import { useEffect } from "react";
import { FINE_POINTER_QUERY } from "@/lib/media";

/**
 * Feeds the cursor position to the `.bn-tile` under a fine pointer as `--mx` / `--my` (px from the
 * tile's top-left), once per frame; the glow and lit border are drawn in CSS (tiles.css). Renders
 * nothing. Touch devices never subscribe.
 */
export function TileSpotlight() {
  useEffect(() => {
    if (!window.matchMedia(FINE_POINTER_QUERY).matches) return;

    let frame = 0;
    let tile: HTMLElement | null = null;
    let x = 0;
    let y = 0;

    const apply = () => {
      frame = 0;
      if (!tile) return;
      const rect = tile.getBoundingClientRect();
      tile.style.setProperty("--mx", `${x - rect.left}px`);
      tile.style.setProperty("--my", `${y - rect.top}px`);
      // -1…1 from the centre, for the tilt.
      tile.style.setProperty("--tx", (((x - rect.left) / rect.width) * 2 - 1).toFixed(3));
      tile.style.setProperty("--ty", (((y - rect.top) / rect.height) * 2 - 1).toFixed(3));
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      tile = event.target instanceof Element ? event.target.closest<HTMLElement>(".bn-tile") : null;
      x = event.clientX;
      y = event.clientY;
      if (tile && !frame) frame = requestAnimationFrame(apply);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
