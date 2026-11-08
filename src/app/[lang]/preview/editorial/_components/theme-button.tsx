"use client";

import { MoonIcon, SunIcon } from "@/components/icons";

/** Flips <html data-theme> and persists it under the shared "theme" storage key. */
export function ThemeButton({ label }: { label: string }) {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage unavailable (private mode): the choice lasts for this page only.
    }
  }

  return (
    <button type="button" onClick={toggle} aria-label={label} title={label} className="ed-themeButton">
      <SunIcon className="icon-sun" width={16} height={16} />
      <MoonIcon className="icon-moon" width={16} height={16} />
    </button>
  );
}
