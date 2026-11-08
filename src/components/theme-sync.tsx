"use client";

import { useLayoutEffect } from "react";
import { applyStoredTheme } from "@/lib/theme";

/**
 * Re-applies the stored theme when React renders <html> in the browser instead of the server
 * (e.g. the 404 page): inline scripts don't run there and React resets the <html> attributes.
 * Layout effects run before paint, so there is no visible flash.
 */
export function ThemeSync() {
  useLayoutEffect(applyStoredTheme, []);
  return null;
}
