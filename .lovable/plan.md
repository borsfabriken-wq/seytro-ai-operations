# Hotell först — nytt koncept

Seytro positioneras om: hotellverksamhet är huvudspåret. Restaurangdelen finns kvar i sin helhet, men presenteras som en del av hybridlösningen (hotell med restaurang) plus en egen flik inne på hotellsidan för rena restauranger.

## 1. Startsidan blir hotellfokuserad

- Hero: rubrik och ingress handlar om hotelldrift — bokningar, reception, rumsplacering och gästservice dygnet runt. Hero-bilden byts till den befintliga hotellbilden.
- Nyckeltalen i hero-kortet skrivs om till hotelltermer (besvarade samtal, bokningar via AI, rumsplaceringar optimerade).
- "Varför Seytro"-blocket och de tre stegen (Flytta in / Bygg upp / Ta över) formuleras utifrån hotellets system: PMS-migrering, rumstyper, priser och regler.
- Bransch-sektionen görs om: hotell som primärt kort, hybrid (hotell med restaurang) som andra kort, och ett tredje, tydligt sekundärt kort "Endast restaurang" som länkar till /restaurang.
- All text på sidan justeras så restaurang nämns som tillägg, inte som jämbördigt spår.

## 2. Hotellsidan får flikar

På /hotell läggs en fliksektion in med tre lägen:

```text
[ Hotell ]  [ Hotell + restaurang ]  [ Endast restaurang ]
```

- **Hotell** — nuvarande innehåll (reception, rumsplacering, gästinsikt).
- **Hotell + restaurang** — hybridflödet: gemensam gästprofil, separata regler för sal och reception, salsplan för hotellrestaurangen.
- **Endast restaurang** — kort sammanfattning av restaurangfunktionerna med länk vidare till /restaurang, som behålls oförändrad med allt innehåll.

## 3. Navigation

- Lösningar-menyn och mobilnavigationen sorteras om så Hotell och Hybrid ligger överst; restaurangposterna behålls men grupperas under en egen rubrik längre ner.
- Inga rutter tas bort — alla befintliga URL:er fungerar som förut.

## 4. Inloggat läge

- Login: hotell blir förstahandsvalet, hybrid näst, restaurang som tredje demokonto. Texten skrivs om till "Hotell, hotell med restaurang, eller endast restaurang".
- Onboarding: verksamhetstypen förvalt satt till hotell; hybrid och restaurang finns kvar som val och alla efterföljande steg (salsplan, menyer, pass) fungerar som idag.
- Dashboarden behåller all funktionalitet; standardvyn för hybrid-konton öppnar hotellöversikten istället för salsplanen.

## Teknisk sammanfattning

- `src/routes/index.tsx` — hero, KPI, bransch-sektion och stegtexter skrivs om; hero-bild byts till `hero-hotel.png.asset.json`.
- `src/routes/hotell.tsx` — flikkomponent (klientsidig state, ingen ny rutt) med tre paneler.
- `src/routes/restaurang.tsx` — orörd, behålls som fullständig sida.
- `src/components/SolutionsMenu.tsx` och `SiteHeader.tsx` — omsortering av länkar.
- `src/routes/login.tsx` och `src/lib/account.ts` — ordning på `accountPlans` samt copy; `hotell` blir default i `readAccountPlan`.
- `src/routes/onboarding.tsx` / `src/lib/onboarding.ts` — default `type: "hotell"`.
- `src/routes/dashboard.index.tsx` — hybrid landar på hotellöversikt.
- `src/i18n/dict/*` — engelska motsvarigheter uppdateras för alla ändrade texter.
- `head()`-metadata på berörda rutter uppdateras med hotellfokuserade titlar och beskrivningar.
