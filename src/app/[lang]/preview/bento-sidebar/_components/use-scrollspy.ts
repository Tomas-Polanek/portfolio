import { useEffect, useState } from "react";

export type NavItem = { id: string; label: string };

/**
 * Id of the section crossing a thin line ~40 % down the viewport (the previous one stays
 * active in gaps between sections). Once `endId` is in view, the last item wins.
 */
export function useScrollspy(items: NavItem[], endId: string) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const visible = new Set<string>();
    let atEnd = false;
    const pick = () => {
      if (atEnd) return setActive(items[items.length - 1]?.id ?? null);
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
      { rootMargin: "-40% 0px -59% 0px" },
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

  return active;
}
