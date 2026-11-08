import { cacheLife } from "next/cache";
import type { Dictionary } from "@/content/cs";
import { site } from "@/content/site";

export async function SiteFooter({ t }: { t: Dictionary["footer"] }) {
  // Cached so reading the current year doesn't make the page dynamic under Cache Components.
  "use cache";
  cacheLife("days");

  return (
    <footer className="mx-auto mt-8 flex w-[calc(100%-2rem)] max-w-[1100px] flex-col items-center justify-between gap-2 border-t border-line py-8 text-sm text-muted sm:flex-row">
      <p>
        © {new Date().getFullYear()} {site.name} · {t.builtWith}
      </p>
      <a href="#top" className="transition hover:text-fg">
        {t.backToTop} ↑
      </a>
    </footer>
  );
}
