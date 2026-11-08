"use client";

import { useEffect, useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { s } from "../../bento/_components/styles";
import { ThemeButton } from "../../bento/_components/theme-button";
import { bs } from "./classes";

type Item = { id: string; label: string };

type Props = {
  name: string;
  role: string;
  items: Item[];
  navLabel: string;
  themeLabel: string;
  menuLabels: { open: string; close: string };
  language: { href: string; lang: string; label: string; short: string };
  /** Element before the first section (the intro tile): while it holds the spy line, no chip is active. */
  startId: string;
  /** Element at the very end of the page: once it is in view, the last chip is active. */
  endId: string;
};

/** Which section crosses a thin line ~40 % down the viewport; `null` above the first section. */
function useScrollspy(items: Item[], startId: string, endId: string) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const ids = [startId, ...items.map((item) => item.id)];
    const visible = new Set<string>();
    let atEnd = false;
    const pick = () => {
      if (atEnd) return setActive(items[items.length - 1]?.id ?? null);
      const first = ids.find((id) => visible.has(id));
      if (first === startId) setActive(null);
      else if (first) setActive(first);
    };

    const sections = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        pick();
      },
      { rootMargin: "-40% 0px -59% 0px" },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) sections.observe(el);
    }

    const end = new IntersectionObserver(([entry]) => {
      atEnd = entry.isIntersecting;
      pick();
    });
    const endEl = document.getElementById(endId);
    if (endEl) end.observe(endEl);

    return () => {
      sections.disconnect();
      end.disconnect();
    };
  }, [items, startId, endId]);

  return active;
}

function LanguageLink({ language, className }: { language: Props["language"]; className: string }) {
  return (
    <a
      href={language.href}
      hrefLang={language.lang}
      lang={language.lang}
      aria-label={language.label}
      title={language.label}
      className={className}
    >
      {language.short}
    </a>
  );
}

export function SidePanel({ name, role, items, navLabel, themeLabel, menuLabels, language, startId, endId }: Props) {
  const active = useScrollspy(items, startId, endId);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const chips = (onPick?: () => void) => (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            onClick={onPick}
            aria-current={active === item.id ? "true" : undefined}
            className={`${s.chip} ${bs.navChip}`}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* < lg: compact sticky top bar */}
      <header className={`${bs.bar} lg:hidden`}>
        <div className="flex h-13 items-center gap-2.5 pr-2 pl-2">
          <span className={`${s.monogram} size-9! rounded-xl! text-[0.8rem]! shadow-none!`} aria-hidden="true">
            TP
          </span>
          <p className="min-w-0 flex-1 truncate font-semibold tracking-tight">{name}</p>
          <ThemeButton label={themeLabel} className={`${s.iconBtn} ${bs.barBtn}`} />
          <LanguageLink language={language} className={`${s.iconBtn} ${bs.barBtn}`} />
          <button
            type="button"
            className={`${s.iconBtn} ${bs.barBtn}`}
            aria-expanded={open}
            aria-controls="bs-menu"
            aria-label={open ? menuLabels.close : menuLabels.open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <CloseIcon width={18} height={18} /> : <MenuIcon width={18} height={18} />}
          </button>
        </div>
        <nav id="bs-menu" aria-label={navLabel} hidden={!open} className={bs.menu}>
          <p className={`${s.faint} mb-2.5 truncate text-sm`}>{role}</p>
          {chips(() => setOpen(false))}
        </nav>
      </header>

      {/* ≥ lg: sticky side panel — exactly the bento header tile */}
      <aside className={`${s.tile} ${bs.panel} hidden flex-col gap-4 p-6 lg:flex`}>
        <div className="flex items-center justify-between gap-3">
          <span className={s.monogram} aria-hidden="true">
            TP
          </span>
          <div className="flex gap-2">
            <ThemeButton label={themeLabel} className={s.iconBtn} />
            <LanguageLink language={language} className={s.iconBtn} />
          </div>
        </div>
        <div>
          <p className="font-semibold tracking-tight">{name}</p>
          <p className={`${s.faint} text-sm`}>{role}</p>
        </div>
        <nav aria-label={navLabel}>{chips()}</nav>
      </aside>
    </>
  );
}
