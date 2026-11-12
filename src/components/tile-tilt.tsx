"use client";

import { useEffect } from "react";
import { FINE_POINTER_QUERY } from "@/lib/media";

/**
 * Feeds the cursor position to the `.bn-tile` under a fine pointer as `--tx` / `--ty` (-1…1 from the
 * tile's centre), once per frame; the hover tilt is drawn in CSS (tiles.css). Renders nothing.
 * Touch devices never subscribe.
 */
export function TileTilt() {
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
