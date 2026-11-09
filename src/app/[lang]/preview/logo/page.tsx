import type { Metadata } from "next";
import { site } from "@/content/site";
import { getLocale } from "@/lib/i18n";
import { Logo, variants } from "./_components/logos";

export const metadata: Metadata = { title: "Logo", robots: { index: false } };

const SIZES = [16, 32, 64, 180] as const;

// Temporary page for choosing the logo / favicon; removed once one is chosen.
export default async function LogoPreview() {
  const locale = await getLocale();
  const cs = locale === "cs";

  return (
    <main className="mx-auto w-[calc(100%-2rem)] max-w-[1100px] py-16">
      <h1 className="text-3xl font-bold">{cs ? "Návrhy loga a faviconu" : "Logo and favicon concepts"}</h1>
      <p className="mt-2 text-muted">
        {cs
          ? "Čisté křivky bez fontu: ostré i při 16 px a všude stejné. Velikosti 16 / 32 / 64 / 180 px (záložka, iOS ikona), vpravo ukázka v hlavičce panelu."
          : "Pure paths, no font: crisp at 16 px and identical everywhere. Sizes 16 / 32 / 64 / 180 px (tab, iOS icon); on the right, in the panel header."}
      </p>

      <ul className="mt-10 grid gap-6">
        {variants.map((v) => (
          <li key={v.id} className="grid gap-4 md:grid-cols-2">
            {([false, true] as const).map((light) => (
              <section
                key={String(light)}
                aria-label={`${v.name[locale]} – ${light ? (cs ? "světlý" : "light") : cs ? "tmavý" : "dark"}`}
                className={`rounded-2xl border p-6 ${light ? "border-zinc-200 bg-zinc-50 text-zinc-900" : "border-zinc-800 bg-zinc-950 text-zinc-100"}`}
              >
                <h2 className="font-semibold">{v.name[locale]}</h2>
                <p className={`mt-1 text-sm ${light ? "text-zinc-600" : "text-zinc-400"}`}>{v.note[locale]}</p>
                <div className="mt-6 flex flex-wrap items-end gap-5">
                  {SIZES.map((size) => (
                    <figure key={size} className="flex flex-col items-center gap-2">
                      <Logo variant={v.id} size={size === 180 ? 96 : size} gradId={`g-${v.id}-${light}-${size}`} light={light} />
                      <figcaption className={`font-mono text-[0.68rem] ${light ? "text-zinc-500" : "text-zinc-500"}`}>
                        {size === 180 ? "180 (½)" : size}
                      </figcaption>
                    </figure>
                  ))}
                </div>
                {/* Browser tab mock-up */}
                <div
                  className={`mt-6 flex w-fit items-center gap-2 rounded-t-lg border border-b-0 px-3 py-1.5 text-xs ${light ? "border-zinc-200 bg-white" : "border-zinc-800 bg-zinc-900"}`}
                >
                  <Logo variant={v.id} size={16} gradId={`t-${v.id}-${light}`} light={light} />
                  {site.name} · Portfolio
                </div>
                {/* Panel header mock-up */}
                <div className={`flex items-center gap-3 border-t pt-4 ${light ? "border-zinc-200" : "border-zinc-800"}`}>
                  <Logo variant={v.id} size={44} gradId={`h-${v.id}-${light}`} light={light} />
                  <span className="text-lg font-semibold tracking-tight">{site.name}</span>
                </div>
              </section>
            ))}
          </li>
        ))}
      </ul>
    </main>
  );
}
