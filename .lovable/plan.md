# Bokningsdashboard — bästa av seytro.com plus nya AI-funktioner

Skärmbilderna visar den riktiga produkten på seytro.com/dashboard. Planen tar in dess struktur och lägger till de fyra AI-områden du valde. Allt byggs i vårt nuvarande tema (signalblå accent, isgrå ytor, mjuka skuggor) — inte den mörkgröna/beige tonen i skärmbilderna.

## Ny navigationsstruktur

Sidomenyn görs om till samma logik som seytro.com, med restaurangens namn överst och användarkort längst ned:

```text
Brasserie Astrid · Bokningssystem
  Hem
  Assistent
KOMMUNIKATION
  E-post   Samtal   Eskaleringar
DRIFT
  Bord   Tidslinje   Optimering   Listor   Väntelista
RESTAURANG
  Gäster   Konfiguration
  Inställningar   Logga ut
  [Elias · Ägare]
```

Hotellkontot behåller sin nuvarande meny; hybridkonton växlar som idag.

## Vyer som byggs eller görs om

**Hem** — hälsning, lunch/middagstider på raden under, datumnavigering till höger. Fyra nyckeltal: Täckningar (andel av totala platser), Bokningar (kvar att anlända), Lediga bord, Kräver uppmärksamhet. Under dem två kort: Nästa ankomster (med genväg till tidslinjen) och Kräver uppmärksamhet. Längst ned en bred "Fråga assistenten"-rad.

**Assistent** (ny) — chattvy mot Seytro AI med snabbfrågor: "Placera en drop-in", "Dagens läge", "Bokningar med risk", "Kommande ankomster". Svaren genereras från dagens bokningsdata och kan utföra åtgärder (skapa bokning, flytta bord, öppna gästkort).

**E-post** (ersätter Inkorg) — trekolumn: inkorgslista med filter (Alla / Olästa / Från gäster), meddelandevy och svarsfält. Överst reglaget för AI-hantering: **Auto / Utkast / Av**. AI-hanterade trådar märks med "AI hanterad".

**Samtal** (ny) — lista över inkommande/utgående/missade samtal med AI-sammanfattning per rad. Detaljpanel till höger med sammanfattning, full transkription (AI-värd/gäst) och "Ring tillbaka".

**Eskaleringar** (ny) — allt AI inte kan lösa: klagomål, återuppringning, specialönskemål. Filter Kräver åtgärd / Pågår / Löst / Alla, sökfält och "Logga något" för manuella ärenden.

**Bord** (dagens Salsplan) — datumrad, täckningsräknare, servicetider, knappar Slå ihop bord / Lägg till bord / Ny bokning. Golvflikar (zoner), statusräknare Sittande / Reserverade / Lediga, reservationslista till vänster och zoombar salsplan med legend.

**Tidslinje** (ny) — Gantt-vy: bord som rader, tid som kolumner, bokningar som block. Filter för pass (Hela dagen / Lunch / Middag), zon, sökning, zoomreglage samt knapparna Väntelista och Ny bokning. Bokningspanelen öppnas som slide-over till höger, som idag.

**Optimering** (ny) — tre kort: rummet som det står, efter föreslagna flyttar, extra täckningar som frigörs. Lista med konkreta flyttförslag som kan accepteras var för sig eller alla på en gång; låsta bord rörs aldrig. Tomt läge: "Rummet är redan optimalt". Knapp för att räkna om.

**Listor** (ny) — tabellvy över bokningar med datum, tid, gäst + referens, sällskap, bord och status. Filter Denna dag / Kommande, statusfilter (Sittande, Bekräftad, Väntar, Klar, No-show, Avbokad), service- och zonfilter, sökning. Fot med "X bokningar · Y täckningar".

**Väntelista** (ny) — statusfilter Öppna / Väntar / Erbjudna / Omvandlade / Avbokade, räknare "X väntar", sökfält och "Lägg till gäst". Varje rad har namn, sällskap, önskad tid, telefon och ett klick för att omvandla till riktig bokning. Telefon- och e-postagenten lägger själv in gäster här. Vid avbokning matchar AI automatiskt och skickar erbjudande med tidsgräns.

**Gäster** — filter Alla / VIP / Stamgäster / Allergier, sökfält och "Ny gäst" som slide-over (namn, telefon, e-post, taggar VIP/Allergi/Födelsedag/Stamgäst/Fönster, anteckning). Listan visar initialavatar, kontaktuppgifter, taggar och antal besök. Gästkortet öppnas som slide-over från alla vyer och visar historik, snittnota, favoritbord, no-show-historik samt AI-förslag på merförsäljning och kampanjsegment.

**Konfiguration** — en lång sida med sektioner och en spara-knapp som visar "Inga ändringar" tills något ändras:
- Restaurangprofil: namn, publik bokningsslug, logotyp-URL, adress, publik telefon/e-post/webbplats, växel för webbokning, tidszon.
- Servicetider: lunch och middag var för sig med på/av, öppnar/stänger och veckodagar.
- Bokningsregler: standard sittningstid, max sällskap online, bokningsbart antal dagar framåt, minsta framförhållning, max täckningar per 15 minuter, avbokningsstopp, påminnelse, samt växlar för autobekräftelse, depositionskrav och väntelista när fullt.
- Sittningstider och tempo: tabell med sällskapsintervall och tid för lunch respektive middag, vändtid mellan sällskap, tak för täckningar/sällskap som anländer samtidigt och kortaste lucka värd att sälja.
- Stora sällskap och privat matsal: gräns för vad som räknas som stort, samt växlar för godkännande, deposition och PM-krav.
- Menyer och allergener: ladda upp meny (PDF/foto) eller lägg in rätter för hand, med priser och allergener som AI använder.
- Gästtaggar: hantera taggar och se hur många bokningar som bär varje tagg.
- Stängningar: datum, omfattning (hel dag eller pass) och orsak.
- Gäst-SMS: leverantör, avsändarnamn, API-uppgifter och bokningstelefonnummer.
- Våningar och bord: lista över zoner med antal bord och platser, byt namn eller ta bort; bord redigeras på Bord-vyn.

PM & sällskap behålls som egen vy och länkas från Konfiguration; PM-mallarna flyttas in som en sektion där.


## AI-funktionerna genomgående

- **Bokningskö**: varje inkommande ärende (samtal, mejl, webb) får AI-förslag som personalen godkänner, justerar eller avslår. Autopilot per kanal, med tröskel för när människa måste titta.
- **Bordsoptimering**: förslag visas som spökbord innan de accepteras; turnover-prognos per bord och överbokningsvarning.
- **No-show-risk**: riskpoäng (låg/medel/hög) per bokning baserat på historik, ledtid, sällskapsstorlek och kanal, med automatiska bekräftelsepåminnelser för högrisk.
- **Gästtillväxt**: merförsäljning, kampanjer och uppföljning efter besök.

Allt AI-genererat märks tydligt och går alltid att ändra manuellt.

## Teknisk del

- `src/lib/dashboard-data.ts` utökas: `CallRecord` (riktning, sammanfattning, transkript), `EmailThread` (AI-status auto/utkast/av), `Escalation`, `WaitlistEntry`, `RequestItem`, `noShowRisk` på `Booking`, samt utökad `Guest`.
- Ny modul `src/lib/booking-ai.ts` för optimeringsförslag, riskpoäng och väntelistematchning (deterministiska regler mot demo-data).
- Nya rutter: `dashboard.assistent.tsx`, `dashboard.epost.tsx` (ersätter `dashboard.inkorg.tsx`), `dashboard.samtal.tsx`, `dashboard.eskaleringar.tsx`, `dashboard.tidslinje.tsx`, `dashboard.optimering.tsx`, `dashboard.listor.tsx`, `dashboard.vantelista.tsx`, `dashboard.konfiguration.tsx`.
- Nya komponenter under `src/components/dashboard/`: `Timeline.tsx`, `CallPanel.tsx`, `EmailPane.tsx`, `OptimizePanel.tsx`, `WaitlistPanel.tsx`, `GuestSheet.tsx`, `AssistantChat.tsx`.
- `DashboardShell.tsx` byggs om till grupperad sidomeny med sektionsrubriker och användarkort; nuvarande topprad med datum och statistik behålls.
- Assistenten körs mot Lovable AI med dagens bokningsdata som kontext. All demo-data ligger kvar i klienten — ingen databas i detta steg.

## Ordning

1. Sidomeny och navigationsstruktur
2. Hem, Listor, Tidslinje
3. E-post, Samtal, Eskaleringar
4. Optimering och väntelista med AI-logik
5. Gäster och merförsäljning
6. Assistenten
7. Responsiv genomgång på mobil och surfplatta
