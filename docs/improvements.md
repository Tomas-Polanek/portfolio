# Návrhy na zlepšení

Stav: body 1–4 implementovány (`src/lib/media.ts`, `src/components/tile-heading.tsx`, grid oblasti v `layout.css`, `nav.homelab`); body 5–8 zůstávají jako podmíněné návrhy.

## Duplicity

1. **Hlavičky sekcí.** Projekty a Homelab používají `SectionHeader` (`src/components/section-header.tsx`). O mně, Vzdělání a Dovednosti mají eyebrow a `h2` napsané ručně (`overview.tsx`, `education.tsx`). Návrh: jedna komponenta pro nadpis v tilu (`TileTitle`) a `SectionHeader` pro celé sekce. Jinak se rozjedou velikosti a odstupy.
2. **`matchMedia` na preferenci a pointer.** Dotazy `(prefers-reduced-motion: reduce)` a `(hover: hover) and (pointer: fine)` se opakují v `count-up.tsx`, `magic-cursor.tsx`, `tile-tilt.tsx`, `pi-model/pi-model.tsx`, `pi-model/pi-side.tsx` a `pi-model/scene.ts`. Návrh: jeden helper v `src/lib/media.ts` nebo hook `useMediaQuery`.
3. **Názvy grid oblastí na třech místech.** `bn-aLoc`, `bn-aAbout` a další jsou v `classes.ts`, v `tiles.css` a rozložení v `layout.css` (`bs-heroGrid`). Odstranění dlaždice „Studuji“ ukázalo, jak snadno to rozjede. Návrh: rozložení držet v jednom souboru, nebo použít inline `gridArea`.
4. **Štítek „Homelab“.** Je v `nav.homelab` i v `overview.homelabTeaser` (`cs.ts`, `en.ts`). Návrh: `homelabTeaser` odkazovat na `nav.homelab`.
5. **URL webu.** `src/content/site.ts` a `README.md` obsahují `https://tomaspolanek.dev`. README nejde importovat, takže je to přijatelné. Při změně domény nezapomenout na obojí.

## Zlepšení

6. **Zvýraznění textu.** `emphasize()` v `overview.tsx` se používá jen na O mně. Až bude potřeba jinde, přesunout do `src/lib/rich-text.ts`.
7. **Tučné výrazy v obsahu.** Zvýraznění jsou v textech zapsaná jako `**…**`. Interpunkce uvnitř tučného úseku se snadno přehlédne (viz „učit, růst“). Návrh: zvýrazněné výrazy bez interpunkce, nebo zvýraznění držet jako pole segmentů.
8. **Dva listenery na pohyb myši.** `magic-cursor.tsx` a `tile-tilt.tsx` oba poslouchají `pointermove` na `window`. Funguje to, ale při dalších efektech stojí za sloučení do jednoho.

## Co nebylo prověřeno

- Výkon scroll-driven animací a 3D modelu (`pi-model`). Jen čteno, neměřeno.
- Přístupnost mimo screenshoty (kontrast tučného textu, fokus).
- Mobilní layout po poslední změně O mně (375 px).
- SEO metadata a `og:` tagy.
