# Konfiguration: seating-motorn och stängningsdagar

Skärmbilderna visar delar av produktionens Configuration-sida som saknas i dashboarden idag: hur hårt bokningsmotorn får jobba rummet, regler för omplacering, alternativa tider och stängningsdagar. Dagens sida har profil, öppettider, bokningsregler, turtider, stora sällskap, meny, SMS och bord — men ingen sektion för seating-motorn och inga stängningsdatum.

## Nya sektioner

### 1. Bokningsmotorn ("Hur hårt ska rummet jobbas")
Tre valbara nivåer som radiokort med förklarande text:
- **Varsamt** — placerar sällskap vettigt men flyttar aldrig någon. Vissa bokningar som hade gått att ta emot nekas.
- **Balanserat** (förvalt) — flyttar bokningar som ännu inte anlänt till annat bord när det är enda sättet att ta emot ett sällskap.
- **Offensivt** — omplacerar även för att frigöra kapacitet ingen ännu bett om, vilket kan innebära samtal till gäster.

Under nivåvalet, tillhörande reglage:
- Får flytta bokningar gästen redan känner till (endast annat bord, aldrig annan tid, aldrig sittande sällskap)
- Max antal flyttade bokningar per beslut (nummer, 0 = ingen omplacering)
- Lämna VIP/stamgäster där de är
- Håll stora bord reserverade för stora sällskap
- Följ kedja av flyttar (flytta en gäst för att göra plats åt en annan, max två steg)
- Slå bara ihop bord som är kartlagda som angränsande

### 2. Alternativa tider
- Föreslå andra tider inom X minuter (0 stänger av förslag)
- Bara om alternativet är minst Y % bättre
Med samma förklarande hjälptexter som i produktionen.

### 3. Godkännandenot
Fritextfält: not som visas för personal och används av AI:n när en bokning behöver godkännas ("Ring chefen på 070…"). Placeras i sektionen Stora sällskap.

### 4. Stängningar och specialdatum
- Lista över inlagda stängningar med datumintervall, omfattning och orsak; tom-läge när inga finns.
- Formulär: Från-datum, Till-datum, Omfattning (Hela dagen / Lunch / Middag) och Orsak.
- Lägg till och ta bort stängningar direkt i listan (lokalt state, sparas med resten av sidan).

## Struktur och känsla

- Två nya poster i vänsternavigationen: **Bokningsmotor** och **Stängningar**.
- Varje sektion får en beskrivande vänsterkolumn (rubrik + förklaring) och kontrollerna till höger, som i produktionens layout.
- Spara-knappen blir tillståndsmedveten: visar "Inga ändringar" i inaktivt läge och "Spara ändringar" när något ändrats.
- Allt använder befintliga designtokens (surface, border, primary) — inget nytt tema.

## Teknisk not

Ändringarna sker i `src/routes/dashboard.konfiguration.tsx`. Reglagen får kontrollerat state i en samlad `settings`-modell så att spara-knappens ändringsläge kan härledas. Stängningar hålls i lokalt state (demodata), i linje med resten av dashboardens mock-drift.
