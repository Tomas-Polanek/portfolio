"use client";

import { useEffect, useRef, useState } from "react";
import { Pi5Sketch } from "../pi5-sketch";
import type { PiScene } from "./scene";

/** Same product names in both languages; order matches `LABEL_LAYERS`. */
const LAYER_NAMES = ["Raspberry Pi 5", "Active Cooler", "Geekworm X1001", "Samsung 990 PRO 1 TB"];

/**
 * Wireframe 3D model of the homelab build (Pi 5 + Active Cooler + X1001 + 990 PRO). three.js is
 * loaded lazily; the SVG sketch stays as poster until the first frame (and if WebGL fails).
 */
export function PiModel({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<HTMLSpanElement[]>([]);
  const sceneRef = useRef<PiScene | null>(null);
  const openRef = useRef(open);
  const mouseDown = useRef(false);

  useEffect(() => {
    openRef.current = open;
    sceneRef.current?.setOpen(open);
  }, [open]);

  useEffect(() => {
    let cancelled = false;
    import("./scene")
      .then(({ createPiScene }) => {
        if (cancelled || !hostRef.current) return;
        sceneRef.current = createPiScene({
          host: hostRef.current,
          labels: labelRefs.current,
          open: openRef.current,
          onReady: () => setReady(true),
        });
      })
      .catch(() => {
        // No WebGL (or the chunk failed to load): the SVG poster stays.
      });
    return () => {
      cancelled = true;
      sceneRef.current?.dispose();
      sceneRef.current = null;
      setReady(false);
    };
  }, []);

  return (
    <div className="bs-pi3d" data-ready={ready || undefined}>
      <Pi5Sketch />
      <div ref={hostRef} className="bs-pi3dCanvas" />
      <div className="bs-pi3dLabels" aria-hidden="true">
        {LAYER_NAMES.map((name, i) => (
          <span
            key={name}
            ref={(el) => {
              if (el) labelRefs.current[i] = el;
            }}
            className="bs-pi3dLabel"
          >
            {name}
          </span>
        ))}
      </div>
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
