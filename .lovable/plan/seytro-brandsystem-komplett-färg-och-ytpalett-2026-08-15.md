# Seytro brandsystem — komplett färg- och ytpalett

Ett genomarbetat visuellt system byggt på den befintliga signalblå riktningen (vitt, is-grå, sten, kolgrå, blå), applicerat på hela appen: publik sajt, inloggat läge och onboarding. Dova, tonade statusfärger.

## Palettens grund

- Bas: rent vitt (#FFFFFF) som huvudyta, is-grå (#F4F6F8) som sektionsyta, sten (#CCC7BF) för avdelare och lugna kanter.
- Text: kolgrå (#31393C) som primär, med tre bestämda nedtoningar (sekundär, dämpad, subtil) istället för godtyckliga opaciteter.
- Accent: signalblå (#3E96F4) med en mörkare tryck-/hovernivå och två ljusa tonade ytor för markering.
- Regel: accent max ~10 % av ytan — knappar, aktiva tillstånd, fokusringar, en nyckelsiffra per vy.

## Ytnivåer (kuber och områden)

Fyra tydliga nivåer så att sektioner kan skiljas åt utan att bryta helheten:

```text
nivå 0  sidbakgrund      vitt
nivå 1  sektionsyta      is-grå (t.ex. hela topp-panelen i dashboarden)
nivå 2  kort/panel       vitt med tunn kant + mjuk skugga
nivå 3  upphöjd yta      vitt med starkare skugga (dialoger, slide-over, dropdowns)
markering  accentyta     ljus blå ton + blå kant (aktivt pass, valt bord, vald bokning)
```

Varje nivå får egna tokens för yta, kant och skugga, så inget kort behöver egna ad hoc-värden.

## Skuggor

Fem definierade skuggnivåer istället för blandade Tailwind-defaults: hårfin (chips, inputs), mjuk (kort), medel (hovrat kort), hög (dialoger/slide-over), fokusglow (blå ring vid tangentbordsfokus). Skuggorna är kalla och lågkontrast så de känns premium, inte tunga.

## Statusfärger (dova)

Ett gemensamt statussystem med tonad bakgrund, matchande kant och mörk text, delat mellan restaurang och hotell:

- Ledigt / tillgängligt, Dukat / förberett, Upptaget / incheckat, Städas / housekeeping, Väntar / obekräftat, Avvikelse / uppmärksamhet, Avslutat / utcheckat.

Samma sju status-tokens används av salsplanen, bokningslistorna, rumsstatusrutnätet, inkorgen och PM-listan, så en färg alltid betyder samma sak.

## Övrigt som ingår

- Diagramfärger: en harmonisk femstegsskala i blå/sten-familjen istället för dagens blandning.
- Sidomeny: fast mörk kolgrå yta med egna kant-, hover- och aktiv-tokens.
- Datavisualisering och KPI-kort: accentblå bara på det tal som är viktigast, resten neutralt.
- Fokus- och hovertillstånd standardiseras för alla klickbara ytor (knappar, kort, bord, listrader).
- Publika sajten får samma tokens: hero, pelarkort, produktshowcase, FAQ, footer och demo-sidan.

## Teknisk plan

1. `src/styles.css`: bygg om `:root` till en strukturerad tokenuppsättning — bas-/text-/accentskalor, fyra ytnivåer (`--surface-0..3` + `--surface-accent`), kanter (`--border-subtle/strong`), fem skuggor (`--shadow-hairline/soft/raised/overlay/focus`), sju statuspar (`--status-*` + `--status-*-fg`/`-border`), samt uppdaterade `--chart-*` och `--sidebar-*`. Alla värden i oklch.
2. Registrera samtliga nya tokens i `@theme inline` som `--color-*`/`--shadow-*` så de blir Tailwind-klasser (`bg-surface-1`, `shadow-raised`, `bg-status-seated`).
3. Rensa ut de kvarvarande legacy-tokens (`--forest*`, `--sage*`, `--brass*`, `--ember*`, `--moss*`, `--tide*`) genom att mappa dem till de nya namnen och byta ut användningen i komponenterna, så inga döda eller motstridiga färger finns kvar.
4. Applicera systemet komponentvis: `DashboardShell`, `TodayOverview`, `FloorPlan`, `FloorPlanEditor`, `BookingDialog`, `PmSheet`, `TemplateManager`, `HotelOverview`, dashboard-rutterna, samt publika sidor (`index`, tjänstesidor, `demo`, `login`, `onboarding`, `SiteHeader`, `SiteFooter`, `FaqSection`, `ProductShowcase`, `LogoMarquee`).
5. Ersätt hårdkodade färgklasser (`bg-white`, `text-white`, `bg-slate-*`, `/60`-opaciteter m.m.) med semantiska tokens.
6. Verifiera visuellt med skärmdumpar av startsidan, restaurangdriften, salsplanen, PM och hotellvyn i både desktop- och mobilbredd, plus typkontroll.
