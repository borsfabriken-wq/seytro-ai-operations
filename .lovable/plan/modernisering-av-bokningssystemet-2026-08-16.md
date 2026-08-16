# Modernisering av bokningssystemet

Målet: samma funktioner som idag, men ett tydligt modernare, renare och mer lättnavigerat inloggat läge. Inget tas bort — istället styr färg, typografi och densitet vad som ska sticka ut och vad som ska tona ner.

## Ny visuell riktning

- **Färg:** grafit + klarblå. Bas off-white (#FAFBFC), ytor/linjer i ljus grå (#E6EAEF), text och tunga ytor i kolgrå (#31393C), klarblå (#3E96F4) som enda "titta-här"-färg (aktivt val, primärknapp, markerat bord/rad).
- **Statusfärger tonas ner** till mjuka bakgrundstoner med mörk text istället för starka fyllda chips: bekräftad = neutral, väntar = bärnsten-tint, anlänt = blå-tint, avbokad = nedtonad grå med genomstrykning. Bara risk/konflikt får en tydlig röd ton.
- **Typografi:** Urbanist för rubriker och siffror, Epilogue för brödtext (ersätter Sora/Manrope). Siffror i tabellsiffror så tider och antal linjerar.
- **Densitet:** kompakt proffsläge — mindre radhöjd, tightare paddning, fler bokningar per skärm, men tydligare grupper och luft mellan block.
- **Ytor:** nästan platta kort — 1px ljus kant, mycket svag skugga, radie kvar liten. Färre boxar-i-boxar; sektioner separeras med linje och rubrik istället för nästlade kort.

## Vad som konkret ändras i bokningsvyerna

1. **Toppen (dashboardens header + dagsrad)** — slås ihop till en lugnare rad: datum/dagväljare till vänster, nyckeltal som diskret text i stället för inramade kuber, primär "Ny bokning" i blått till höger. Sök behåller ⌘K.
2. **Bokningslistan** — kompakta rader med tydlig kolumnrytm (tid · antal · gäst · bord/rum · status). Sticky grupprubriker (Ej placerade / Placerade / per tidsblock), hover- och markeringstillstånd i blå tint, hela raden klickbar.
3. **Salsplan/rumsöversikt** — samma fågelvy, men lugnare bordskort: nummer stort, sekundärinfo nedtonad, upptaget = fylld grafit, ledigt = ljus yta, markerat/sökträff = blå ram. Zon- och tidsreglagen blir en enda segmentkontroll.
4. **Kalender/tidslinje** — ljusare rutnät, tydligare timlinjer och "nu"-linje i blått, bokningsblock med mjuk fyllning och läsbar text vid små bredder.
5. **Bokningspanel/drawer och PM** — samma innehåll, ny hierarki: gästnamn + tid överst, allergier/kommentar i en framhävd notisruta, sekundära åtgärder som tysta ikonknappar, en enda blå primärknapp per vy.
6. **Navigering** — sidomenyn får tydligare aktivt läge (blå indikator), gruppetiketter nedtonade, och samma tillståndsspråk för hover/fokus i hela dashboarden.

## Tekniskt

- `src/styles.css`: byt accentkedjan (`--accent-base/-strong/-tint/-edge`) till den blå skalan, justera neutraler mot grafit/off-white, lägg till nedtonade statustokens (`--status-*`), en kompakt spacing-/radhöjdsskala samt `--font-display: Urbanist` / `--font-sans: Epilogue` i `@theme`.
- `src/routes/__root.tsx`: byt Google Fonts-länken från Sora/Manrope till Urbanist + Epilogue.
- Komponenter som får presentationsjusteringar (ingen logikändring): `DashboardShell.tsx`, `FloorPlan.tsx`, `BookingDrawer.tsx`, `BookingDialog.tsx`, `TodayOverview.tsx`, `LiveFeed.tsx`, `PmSheet/PmComposer/PmModal`, samt route-vyerna `dashboard.index`, `dashboard.salsplan`, `dashboard.kalender`, `dashboard.tidslinje`, `dashboard.listor`, `dashboard.vantelista`.
- Hårdkodade gröna/skogsklasser i dashboardkomponenter ersätts av semantiska tokens så temat gäller överallt.
- Marknadssidorna (index, restaurang, hotell m.fl.) rörs bara av tokenbytet; ingen strukturändring där. Säg till om de ska behålla den gröna profilen — då separeras dashboardens tokens.

## Utanför scope

Inga funktioner, flöden eller data tas bort eller flyttas mellan vyer. Ingen ny backend.
