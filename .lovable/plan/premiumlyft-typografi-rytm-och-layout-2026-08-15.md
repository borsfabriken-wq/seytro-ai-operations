# Premiumlyft: typografi, rytm och layout

Målet är att Seytro ska läsas som ett dyrare, mer genomarbetat system än TheFork, Bokabord, resOS, easyTable, SevenRooms och OpenTable — utan att tappa igenkänningen som bokningssystem. Paletten (signalblå + charcoal + off-white) behålls; det som ändras är typsnitt, skala, rytm, ytor och komponentkänsla över hela ytan: landningssida, tjänstesidor, demo och inloggat läge.

## Vad konkurrenterna gör — och vad vi gör istället

| De gör | Vi gör |
| --- | --- |
| Systemfonter/Inter, mjuka rundade kort | Sora som display med tight spårning, Manrope som brödtext |
| Färgglada illustrationer och stockbilder | Produkt-UI som hjälte: riktiga salsplaner, bokningskort, AI-förslag |
| Jämnstora sektioner i samma rytm | Tydlig hierarki: få stora ögonblick, mycket luft, täta datazoner |
| Tunga skuggor och gradienter | Hårfina kanter, en enda mjuk höjdnivå, blå används sparsamt |

## Typografi

- Rubriker: **Sora** (600/700), negativ letter-spacing på stora grader, optisk balans i hero.
- Brödtext och UI: **Manrope** (400/500/600), luftigare radavstånd i marknadsföring, tätare i dashboard.
- Två skalor: en display-skala för publika sidor (stora hopp) och en kompakt UI-skala för inloggat läge, så samma typsnitt känns rätt på båda ställena.
- Siffror i dashboard får tabulär inställning så KPI:er och tider inte hoppar.
- Etiketter och små rubriker: versaler, glest spårade, i dämpad charcoal — signalen som ger "system", inte "app".

## Layout och rytm

- Ett gemensamt gridsystem: bred innehållsram på publika sidor, tätare arbetsyta i dashboard.
- Hero: kortare värdeerbjudande, större typ, produktvy till höger istället för dekorbild.
- Sektioner byggs som "moment": rubrik + en enda tydlig visuell bärare, inte tre likvärdiga kort i rad.
- Införa asymmetri i pelarsektionen (ett dominerande kort + två stödjande) så sidan inte ser mallad ut.
- Konsekvent vertikal rytm baserad på en 8-punktsskala, med markant mer luft mellan sektioner än inuti dem.

## Komponentkänsla (gäller båda lägena)

- Kort: 1px hårfin kant, mycket låg radie-variation, en mjuk skugga endast för det som svävar.
- Knappar: fylld blå primär, charcoal sekundär som kontur, textlänk med underline-on-hover.
- Tabeller och listor i dashboard: tätare radhöjd, tydliga zon-/passavdelare, statusprickar istället för färgade block.
- Badges och statusar får dova toner så den blå accenten alltid betyder "handling".
- Mikrorörelse: korta, dämpade övergångar (färg, position), inga stora entré-animationer.

## Så här rullas det ut

1. Byt fontlänkar och typtokens, lägg in display-/UI-skalorna och tabulära siffror.
2. Uppdatera bas- och komponentlagret (kort, knappar, badges, tabeller, paneler) mot de nya tokens.
3. Gå igenom publika sidor: hero, pelare, vision, FAQ, footer, tjänstesidor, restaurang/hotell, demo.
4. Gå igenom inloggat läge: shell och sidomeny, översikt, bokningar, salsplan, listor, tidslinje, väntelista, optimering, e-post, samtal, eskaleringar, PM, konfiguration, onboarding, login.
5. Kontrollera responsivitet och kontrast på nyckelvyer.

## Tekniskt

- `src/routes/__root.tsx`: byt Google Fonts-länken till Sora + Manrope.
- `src/styles.css`: `--font-display` / `--font-sans`, nya `--text-*`-steg, spårnings- och radavståndstokens, tabulära siffror, justerade radier och skuggor. Paletten rörs inte.
- Komponent- och rutfiler under `src/components/` och `src/routes/` uppdateras till de semantiska tokens — inga hårdkodade färger.
