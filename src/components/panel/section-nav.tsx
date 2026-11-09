"use client";

import { bs } from "@/components/classes";
import { type NavItem, useScrollspy } from "./use-scrollspy";

/**
 * Vertical nav of the desktop column: line + uppercase label; the active line grows and, where scroll
 * timelines exist, fills with the brand gradient as you read its section (layout.css).
 */
export function SectionNav({
  items,
  label,
  endId,
}: {
  items: NavItem[];
  label: string;
  endId: string;
}) {
  const active = useScrollspy(items, endId);

  return (
    <nav aria-label={label} className="hidden lg:block">
      <ul className="w-max">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "true" : undefined}
              className={bs.navLink}
            >
              <span className={bs.navLine} aria-hidden="true">
                <span className={bs.navFill} style={{ animationTimeline: `--sec-${item.id}` }} />
              </span>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
