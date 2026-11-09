"use client";

import { MoonIcon, SunIcon } from "@/components/icons";

export function ThemeButton({ label, className }: { label: string; className?: string }) {
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
    <button type="button" onClick={toggle} aria-label={label} title={label} className={className}>
      {/* Visibility follows [data-theme] via globals.css, so no hydration mismatch. */}
      <SunIcon className="icon-sun" width={18} height={18} />
      <MoonIcon className="icon-moon" width={18} height={18} />
    </button>
  );
}
