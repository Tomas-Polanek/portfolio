"use client";

import { useEffect, useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { TpMark } from "@/components/tp-mark";
import { s } from "../../bento/_components/styles";
import { ThemeButton } from "../../bento/_components/theme-button";
import { bs } from "./classes";
import { type NavItem, useScrollspy } from "./use-scrollspy";

type Props = {
  name: string;
  items: NavItem[];
  navLabel: string;
  themeLabel: string;
  menuLabels: { open: string; close: string };
  language: { href: string; lang: string; label: string; short: string };
  /** The intro block; the bar appears only once it has scrolled out of view. */
  watchId: string;
  endId: string;
};

/** < lg: fixed top bar with a section menu, shown after the intro block leaves the viewport. */
export function CompactBar({
  name,
  items,
  navLabel,
  themeLabel,
  menuLabels,
  language,
  watchId,
  endId,
}: Props) {
  const active = useScrollspy(items, endId);
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const target = document.getElementById(watchId);
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => {
      setShown(!entry.isIntersecting);
      if (entry.isIntersecting) setOpen(false);
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [watchId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className={`${bs.bar} lg:hidden`} data-shown={shown}>
      <div className="flex h-13 items-center gap-2.5 pr-2 pl-2">
        <span className={`${s.monogram} size-9! rounded-xl! shadow-none!`} aria-hidden="true">
          <TpMark className="size-full" />
        </span>
        <p className="min-w-0 flex-1 truncate font-semibold tracking-tight">
          {name}
        </p>
        <ThemeButton
          label={themeLabel}
          className={`${s.iconBtn} ${bs.barBtn}`}
        />
        <a
          href={language.href}
          hrefLang={language.lang}
          lang={language.lang}
          aria-label={language.label}
          title={language.label}
          className={`${s.iconBtn} ${bs.barBtn}`}
        >
          {language.short}
        </a>
        <button
          type="button"
          className={`${s.iconBtn} ${bs.barBtn}`}
          aria-expanded={open}
          aria-controls="bs-menu"
          aria-label={open ? menuLabels.close : menuLabels.open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <CloseIcon width={18} height={18} />
          ) : (
            <MenuIcon width={18} height={18} />
          )}
        </button>
      </div>
      <nav
        id="bs-menu"
        aria-label={navLabel}
        hidden={!open}
        className={bs.menu}
      >
        <ul className="flex flex-wrap gap-1.5">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                aria-current={active === item.id ? "true" : undefined}
                className={`${s.chip} ${bs.navChip}`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
