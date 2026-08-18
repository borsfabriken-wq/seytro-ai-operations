# Nytt typsnitt och en levande färgpalett

Idag används Urbanist (rubriker) och Epilogue (text), och gränssnittet lutar tungt mot grafit/svart: mörka bordsytor, mörk sidomeny, svarta statusblock och en enda blå accent. Det gör helheten platt och lite daterad. Två grepp: byt typografin till ett modernt, premium par och släpp in färg där svart idag gör jobbet.

## Typografi

- Rubriker: **General Sans / Sora-alternativ** ersätts av ett mjukare geometriskt display-snitt med tight spårning på stora grader.
- Brödtext och UI: ett neutralt, högt läsbart grotesk-snitt med bra siffror (tabulära för tider, antal och KPI:er).
- Konkret par: **Bricolage Grotesque** (display) + **Instrument Sans** (text/UI). Modernt, varmt, inte Inter-generiskt.
- En display-skala för publika sidor (större hopp, mer luft) och en kompakt UI-skala i dashboarden.
- Etiketter: versaler, glest spårade, i dämpad ton — men i färgad ton istället för svart.

## Mindre svart, mer färg

- Sidomeny och footer: byt grafit-svart mot en djup skogston (mörkgrön/teal) — samma kontrast, varmare känsla.
- Upptagna bord i salsplanen: idag nästan svarta. Byts mot en mättad men dämpad färgad yta så planen läses direkt.
- Statusar får en egen färgfamilj istället för gråskala: ledigt (svalt neutralt), upptaget (färgad), väntar/risk (bärnsten), problem (dämpat rött), klart (grön).
- Blått behålls som handlingsfärg (knappar, fokus, länkar) — men får sällskap av två stödtoner så sidorna inte blir enfärgade.
- Sektionsytor på publika sidor får mjuka färgade toningar i stället för grå block; kort behåller hårfin kant och en enda mjuk skugga.
- Diagram och badges får en sammanhängande färgskala i stället för grafitvarianter.

## Så här rullas det ut

1. Byt fontlänk i root och typtokens i `src/styles.css` (display/sans, skalsteg, spårning, tabulära siffror).
2. Uppdatera färgtokens: nya surface-inverse, statusfamilj, chart-skala, tint-toner.
3. Gå igenom dashboardens ytor: shell/sidomeny, salsplan (bord, stolar, popover), listor, tidslinje, PM, chatt, konfiguration.
4. Gå igenom publika sidor: hero, pelare, vision, FAQ, footer, tjänstesidor, demo, login, onboarding.
5. Kontrollera kontrast (AA) och responsivitet på nyckelvyer.

## Tekniskt

- `src/routes/__root.tsx`: Google Fonts-länken byts till Bricolage Grotesque + Instrument Sans.
- `src/styles.css`: `--font-display` / `--font-sans`, typtokens, samt omgjorda `--surface-inverse`, `--status-*`, `--chart-*` och nya stödaccenter — allt i oklch.
- Komponenter under `src/components/` och `src/routes/` justeras mot de semantiska tokens; inga hårdkodade färger.
