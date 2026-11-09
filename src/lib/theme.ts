/**
 * Applies a saved light theme.
 * Must stay self-contained: it is serialized into the inline boot script via toString().
 * The storage key "theme" is shared with src/components/theme-button.tsx.
 */
export function applyStoredTheme() {
  const root = document.documentElement;
  try {
    if (localStorage.getItem("theme") === "light") root.dataset.theme = "light";
  } catch {
    // Storage unavailable (private mode): keep the default dark theme.
  }
}

/** Inline <head> script for server-rendered HTML; runs before first paint, so there is no dark→light flash. */
export const themeBootScript = `(${applyStoredTheme.toString()})()`;
