"use client";

import { useEffect, useRef } from "react";
import { FINE_POINTER_QUERY, REDUCED_MOTION_QUERY } from "@/lib/media";

/**
 * Viewfinder cursor: four corner brackets that follow the pointer and snap to the rectangle of the
 * interactive element under it. Fine pointers only; styles in src/styles/magic-cursor.css.
 */

const INTERACTIVE_SELECTOR = [
  "a[href]",
  "button",
  '[role="button"]',
  "label",
  "summary",
  "select",
  "input",
  "textarea",
  '[contenteditable="true"]',
].join(", ");
const DEFAULT_SIZE = 28;
const SNAP_PADDING = 8;
const PRESS_SCALE = 0.8;
const EASE = 0.22;

type Box = { cx: number; cy: number; w: number; h: number };

export function MagicCursor() {
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia(FINE_POINTER_QUERY);
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    const frame = frameRef.current;
    if (!finePointer.matches || reducedMotion.matches || !frame) return;

    const root = document.documentElement;
    root.classList.add("has-magic-cursor");
    frame.showPopover();

    const pointer = { x: 0, y: 0 };
    const current: Box = { cx: 0, cy: 0, w: DEFAULT_SIZE, h: DEFAULT_SIZE };
    let hovered: Element | null = null;
    let pressed = false;
    let visible = false;
    let raf = 0;

    const setVisible = (value: boolean) => {
      visible = value;
      root.classList.toggle("magic-cursor-visible", value);
    };

    const targetBox = (): Box => {
      const rect = hovered?.getBoundingClientRect();
      if (rect && rect.width > 0 && rect.height > 0) {
        return {
          cx: rect.left + rect.width / 2,
          cy: rect.top + rect.height / 2,
          w: rect.width + 2 * SNAP_PADDING,
          h: rect.height + 2 * SNAP_PADDING,
        };
      }
      const size = DEFAULT_SIZE * (pressed ? PRESS_SCALE : 1);
      return { cx: pointer.x, cy: pointer.y, w: size, h: size };
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (!visible) {
        current.cx = pointer.x;
        current.cy = pointer.y;
        setVisible(true);
      }
      hovered = event.target instanceof Element ? event.target.closest(INTERACTIVE_SELECTOR) : null;
      root.classList.toggle("magic-cursor-hover", !!hovered);
    };

    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pressed = true;
      root.classList.add("magic-cursor-down");
    };

    const onUp = () => {
      pressed = false;
      root.classList.remove("magic-cursor-down");
    };

    const hide = () => {
      hovered = null;
      root.classList.remove("magic-cursor-hover");
      setVisible(false);
    };

    const tick = () => {
      const target = targetBox();
      current.cx += (target.cx - current.cx) * EASE;
      current.cy += (target.cy - current.cy) * EASE;
      current.w += (target.w - current.w) * EASE;
      current.h += (target.h - current.h) * EASE;
      frame.style.width = `${current.w}px`;
      frame.style.height = `${current.h}px`;
      frame.style.transform = `translate3d(${current.cx - current.w / 2}px, ${current.cy - current.h / 2}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    root.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      if (frame.matches(":popover-open")) frame.hidePopover();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
      root.classList.remove(
        "has-magic-cursor",
        "magic-cursor-visible",
        "magic-cursor-hover",
        "magic-cursor-down",
      );
    };
  }, []);

  return (
    <div ref={frameRef} className="magic-cursor" aria-hidden="true" popover="manual">
      <span className="magic-cursor__corner magic-cursor__corner--tl" />
      <span className="magic-cursor__corner magic-cursor__corner--tr" />
      <span className="magic-cursor__corner magic-cursor__corner--br" />
      <span className="magic-cursor__corner magic-cursor__corner--bl" />
    </div>
  );
}

/** Call after opening a modal dialog: re-showing the popover moves the frame above that dialog. */
export function raiseMagicCursor() {
  const frame = document.querySelector<HTMLElement>(".magic-cursor");
  if (frame?.matches(":popover-open")) {
    frame.hidePopover();
    frame.showPopover();
  }
}
