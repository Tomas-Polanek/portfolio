# Plán: sekce „Nabízím“

Stav: **plán, neimplementováno.** Nic z tohoto dokumentu zatím v kódu není.

## Cíl

Web říká, kdo jsi a co jsi postavil, ale neříká, co nabízíš. Sekce s konkrétními službami a výzvou ke kontaktu tu mezeru zavře.

## Návrh služeb (k potvrzení)

Odvozeno z obsahu webu (webový vývoj, Python, Linux, homelab). Ověř, co opravdu nabízíš.

| Služba | Co zahrnuje | Příklad z portfolia |
|---|---|---|
| Webové stránky a portfolio | Next.js / React, responzivní design, CZ + EN, nasazení | tomaspolanek.dev |
| Automatizace v Pythonu | skripty, plánované úlohy, zpracování dat, reporty | `automation`, `ask-your-pdfs` |
| Správa domácího serveru | Linux, Docker, zabezpečení, monitoring, zálohy | homelab (Raspberry Pi 5) |
| Malé webové aplikace a API | návrh, implementace, napojení na externí data | projekty na GitHubu |

Ceny se na webu neuvádějí. Sekce odkazuje na kontakt („na poptávku“).

## Umístění

- Nová sekce **mezi „Projekty“ a „Homelab“**, kotva `#services`.
- Nová položka v navigaci: klíč `nav.services` (`cs.ts`, `en.ts`) a položka v side panelu.
- Vizuál: 3–4 karty ve stejném bento stylu jako `projects` (třída `s.tile`).
- Každá karta: ikona, název služby, dvě věty popisu, odkaz na `#contact`.

## Obsah a kód (až po schválení)

- Texty do `src/content/cs.ts` a `src/content/en.ts`. TypeScript vynutí shodnou strukturu.
- Komponenta `src/components/sections/services.tsx`, zařazení do `src/app/[lang]/page.tsx`.
- Styly v `src/styles/layout.css` (mřížka) a `src/styles/tiles.css` (karty).

## Kroky

1. Potvrdit seznam služeb a jejich popisy.
2. Doplnit texty a klíč `nav.services` do obou jazyků.
3. Napsat komponentu a zařadit ji do stránky.
4. Přidat styly a položku do navigace.
5. Ověřit `tsc`, a na `localhost:3000` screenshoty CZ a EN při 375, 768 a 1400 px.

## Otevřené otázky

- Které služby skutečně nabízíš a na jaké bázi (fixní cena, hodinová sazba, jen poptávka)?
- Má sekce odkazovat na konkrétní projekty jako případové studie, nebo stačí obecný popis?
- Má být v EN verzi stejný seznam služeb, nebo jiný cílový trh?
