"use client";

import { MoonIcon, SunIcon } from "./icons";

export function ThemeToggle({ label }: { label: string }) {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next); // read back by applyStoredTheme (src/lib/theme.ts)
    } catch {
      // Storage unavailable (private mode): the choice lasts for this page only.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="glass inline-flex size-10 cursor-pointer items-center justify-center rounded-full transition hover:-translate-y-px hover:shadow-glass"
    >
      {/* Visibility is driven by CSS on [data-theme], see globals.css */}
      <SunIcon className="icon-sun" />
      <MoonIcon className="icon-moon" />
    </button>
  );
}
