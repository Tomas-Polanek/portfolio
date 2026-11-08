"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/locales";
import { CloseIcon, GitHubIcon, MenuIcon } from "./icons";
import { LanguageSwitch } from "./language-switch";
import { ThemeToggle } from "./theme-toggle";

type Props = {
  brand: string;
  links: { id: string; label: string }[];
  githubUrl: string;
  themeLabel: string;
  menuLabels: { open: string; close: string };
  language: { target: Locale; label: string; short: string };
};

export function SiteHeader({ brand, links, githubUrl, themeLabel, menuLabels, language }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section crossing the middle band of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const { id } of links) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    const top = document.getElementById("top");
    if (top) observer.observe(top);
    return () => observer.disconnect();
  }, [links]);

  return (
    <header
      className={`glass sticky top-4 z-20 mx-auto mt-4 w-[calc(100%-2rem)] max-w-[1100px] rounded-[18px] shadow-glass transition-all duration-200 ${
        scrolled ? "-translate-y-0.5 px-4 py-2.5" : "px-5 py-4"
      }`}
      style={{ background: scrolled ? "var(--header-scrolled)" : "var(--header)" }}
    >
      <div className="flex items-center justify-between gap-4">
        <a href="#top" className="text-gradient text-xl font-semibold tracking-tight" onClick={() => setOpen(false)}>
          {brand}
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {links.map(({ id, label }) => (
            <a key={id} href={`#${id}`} className="nav-link" aria-current={active === id ? "true" : undefined}>
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link gradient-border glass hidden gap-2 font-semibold sm:inline-flex"
          >
            <GitHubIcon width={16} height={16} />
            GitHub ↗
          </a>
          <LanguageSwitch {...language} />
          <ThemeToggle label={themeLabel} />
          <button
            type="button"
            className="glass inline-flex size-10 cursor-pointer items-center justify-center rounded-xl lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? menuLabels.close : menuLabels.open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" className="mt-3 flex flex-col items-start gap-1 lg:hidden" aria-label="Main">
          {links.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="nav-link"
              aria-current={active === id ? "true" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="nav-link gap-2 sm:hidden">
            <GitHubIcon width={16} height={16} />
            GitHub ↗
          </a>
        </nav>
      )}
    </header>
  );
}
