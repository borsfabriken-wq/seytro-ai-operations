# Serveringspass som egna tidsinställningar

Idag är öppettiderna låsta till exakt två pass per dag (Lunch och Middag) med fasta fält i onboardingsteget "Öppettider och pass". Referensbilden visar ett friare upplägg: varje pass är ett eget objekt med ikon, tidsspann, standardtid, veckodagar och en summeringsperiod — och man klickar på passets symbol för att öppna dess inställningar.

## Vad som byggs

**Passmodell istället för fasta lunch-/middagsfält**
Ett pass innehåller: namn (Frukost, Lunch, Middag, Afternoon tea, Brunch…), ikon, tidsspann (från–till), standardtid för nya bokningar, vilka veckodagar det gäller, samt en summeringsperiod som styr vilket intervall som räknas ihop i dagens siffror. Passen kan läggas till, dupliceras och tas bort — inte bara två.

**Panelen "Tidsinställningar"**
En sidopanel som öppnas när man klickar på ett passchip eller dess ikon. Innehåll uppifrån och ner:
- Rad med passets tidsspann som väljbara chips, plus "+" för att skapa ett nytt spann
- Tidsperiod (från/till) och Standardtid
- Veckodagsväljare Mån–Sön som togglas
- Summering antal (från/till) — perioden som räknas i dagens överblick
- Ikonväljare med hospitality-ikoner (frukost, bröd, soppa, kaffe, glas, bestick, drink, skaldjur, event)
- "Ta bort" och "Spara" i botten

Panelen använder samma slide-over-stil och rundade premiumformer som bokningspanelen, inte en stor modal.

**Var den används**
- Onboarding, steget "Öppettider och pass": per dag visas passen som chips med ikon; klick öppnar panelen. Stängd dag släcker alla pass.
- Dashboard → Konfiguration → "Öppettider och pass": samma panel, så att pass kan ändras i drift efter onboardingen.

**Följdeffekter**
- Bokningsflöde, tidslinje och kapacitetsvyer läser passen från inställningarna istället för hårdkodad lunch/middag, så ett nytt pass som Brunch dyker upp överallt.
- PM-mallarnas serveringsval (lunch, middag, event) kopplas till de pass som faktiskt finns.
- Befintliga sparade uppsättningar konverteras automatiskt: lunch- och middagstiderna blir två pass, inget går förlorat.

## Tekniskt

- `src/lib/onboarding.ts`: ny typ `ServicePeriod` (id, name, icon, start, end, defaultTime, days[], sumStart, sumEnd) och `periods: ServicePeriod[]` per dag; `defaultHours()` ger Lunch + Middag som pass; `readSetup` migrerar gamla `lunchOpen/dinnerOpen`-fält.
- Ny komponent `src/components/onboarding/ServicePeriodPanel.tsx` — slide-over med fälten ovan, återanvänds av både onboarding och konfiguration.
- `src/routes/onboarding.tsx` steg 1 skrivs om till passchips + panel.
- `src/routes/dashboard.konfiguration.tsx`: kortet "Öppettider och pass" får samma chips och panel.
- Konsumenter av pass (tidslinje, kapacitet, bokningsdialog, PM-mallarnas `ServiceSlot`) läser en gemensam hjälpfunktion `activePeriods(date)`.
