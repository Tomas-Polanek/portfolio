import { cacheLife } from "next/cache";
import { s } from "@/components/classes";
import { GlassLayer } from "@/components/glass-layer";
import { TpMark } from "@/components/tp-mark";
import type { Dictionary } from "@/content/cs";
import { site } from "@/content/site";

export async function SiteFooter({ t, id }: { t: Dictionary["footer"]; id: string }) {
  // Cached so reading the current year doesn't make the page dynamic under Cache Components.
  "use cache";
  cacheLife("days");

  return (
    <footer id={id} className="pt-10 pb-14">
      <div
        className={`${s.tile} flex flex-col gap-3 px-6 py-5 text-sm sm:flex-row sm:items-center sm:justify-between`}
      >
        <GlassLayer />
        <p className="flex items-center gap-2.5">
          <span className={`${s.monogram} size-7! rounded-lg!`} aria-hidden="true">
            <TpMark className="size-full" />
          </span>
          <span className="font-medium">
            © {new Date().getFullYear()} {site.name}
          </span>
        </p>
        <p className={s.muted}>{t.builtWith}</p>
        <a href="#top" className={`${s.chip} self-start sm:self-auto`}>
          ↑ {t.backToTop}
        </a>
      </div>
    </footer>
  );
}
