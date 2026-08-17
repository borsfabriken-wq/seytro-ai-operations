# Modernare bokningsflöde, fritt PM och PM-markör på bordet

Tre saker: en premium-uppdatering av bokningsdialogen, möjlighet att skriva PM helt fritt (utan mall), och en bok-ikon på bord med PM i salsplanen.

## 1. Ny bokning — modernare känsla

Bokningsdialogen (`BookingDialog`) behåller exakt samma fält och funktioner, men får ett nytt uttryck:

- Rubriker i Urbanist med större luft, brödtext/fält i Epilogue — bort med de täta, systemgrå etiketterna.
- Fälten blir mjukare: högre höjd, rundare hörn, tunn kant som lyfts med klarblått fokus i stället för hårda ramar.
- Gästsök, gästantal och tid får en tydlig topprad som "kommandorad" i dialogen; övriga val hamnar i lugna sektioner med rubriknivåer i stället för en lång kolumn.
- Chip-knappar (taggar, snabbtider, bordsförslag) får enhetlig pill-form, mjuk skugga vid val och dämpad ton när de inte är valda.
- Sidfoten blir sticky med tydlig primärknapp och en sammanfattningsrad (gäster · tid · bord · PM).

Samma stiluppdatering läggs på PM-byggaren och PM-panelen så helheten ser likadan ut.

## 2. PM ska kunna skrivas fritt

I PM-byggaren läggs ett läge till: **Mall** eller **Skriv själv**.

- "Skriv själv" ger ett fritextfält (rubrik + innehåll) som blir egna rader i PM:et, plus fri artikel med namn och pris precis som idag.
- Fritexten följer med till utskriften och kan kombineras med en mall (t.ex. mall + egen text om upplägg).
- Fungerar både i PM-sidan och i PM-steget inne i bokningen.

## 3. Bok-ikon på bordet i salsplanen

- Bord vars aktuella bokning har PM får en liten bok-markör i hörnet av bordet.
- Klick på markören (eller på PM-raden i bordets popup) öppnar PM:et: meny, dryckespaket, tillägg, kost/allergier, fritext och summa — samma vy som skrivs ut.
- I bordets popup visas en kompakt rad "PM · Meny 3 + vinpaket" med genväg "Öppna PM".

## Tekniska detaljer

- `src/components/dashboard/BookingDialog.tsx`, `PmComposer.tsx`, `PmSheet.tsx`, `PmModal.tsx`: enbart presentation/struktur samt nytt fritextläge.
- `src/lib/pm-compose.ts`: `PmChoice` utökas med fria textblock (`freeBlocks: { id, title, body }[]`) som `buildPmDoc` skriver ut som sektioner.
- `src/components/dashboard/FloorPlan.tsx`: bordets bokning slås upp mot `pmId`, ritar bok-ikon och skickar vidare till PM-visning.
- Färger och skuggor tas från befintliga tokens i `src/styles.css` — inga hårdkodade färger.
- Svenska och engelska texter uppdateras i i18n-ordlistorna.
