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

**Väntelista** (ny) — gäster som väntar på tid, med flexibilitet och kontaktsätt. Vid avbokning matchar AI automatiskt och skickar erbjudande med tidsgräns; resultatet syns på raden.

**Gäster** — utökat register: besökshistorik, snittnota, favoritbord, allergier, taggar (VIP, stamgäst, press), no-show-historik. Gästkort öppnas som slide-over från alla vyer. AI-förslag på merförsäljning inför besöket och kampanjsegment (t.ex. "inte besökt på 90 dagar") med AI-skrivet utskick.

**Konfiguration** — samlar det som idag ligger i onboarding: öppettider, zoner, bordskarta, bokningsregler, PM-mallar och AI-inställningar per kanal.

PM & sällskap behålls som egen vy och länkas från Konfiguration.

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
