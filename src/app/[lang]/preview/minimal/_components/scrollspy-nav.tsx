"use client";

import { useEffect, useState } from "react";
import { s as styles } from "../classes";

type Item = { id: string; label: string };

/**
 * Vertical section nav; the active item (section crossing a band ~35–40 % down the viewport)
 * gets a longer gradient line. `endId` marks the page end so the last item activates at the bottom.
 */
export function ScrollspyNav({ items, label, endId }: { items: Item[]; label: string; endId: string }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const visible = new Set<string>();
    let atEnd = false;
    const pick = () => {
      if (atEnd) return setActive(items[items.length - 1]?.id);
      const first = items.find((item) => visible.has(item.id));
      if (first) setActive(first.id);
    };

    const sections = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        pick();
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
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
  }, [items, endId]);

  return (
    <nav aria-label={label} className="mt-16 hidden lg:block">
      <ul className="w-max">
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} aria-current={active === item.id ? "true" : undefined} className={styles.navLink}>
              <span className={styles.navLine} aria-hidden="true" />
              <span className={`${styles.navText} text-xs font-bold uppercase tracking-[0.18em]`}>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
