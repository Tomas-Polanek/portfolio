"use client";

import { MoonIcon, SunIcon } from "@/components/icons";
import { s as styles } from "../classes";

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
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`${styles.iconLink} inline-flex size-9 cursor-pointer items-center justify-center rounded-full`}
    >
      {/* Visibility follows <html data-theme> via globals.css */}
      <SunIcon className="icon-sun" />
      <MoonIcon className="icon-moon" />
    </button>
  );
}
