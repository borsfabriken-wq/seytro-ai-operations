# AI-driven bokningsdashboard — nästa nivå

seytro.com/dashboard kräver inloggning (jag omdirigeras till /login), så jag kan inte läsa av den befintliga vyn själv. Du skickar skärmbilder — layout och detaljer i den befintliga produkten matchas in när bilderna kommer. Fram till dess bygger planen på det som redan finns här (översikt, salsplan, gäster, inkorg, PM, analys) plus de fyra AI-områden du valde.

## 1. AI-bokningskö och förfrågningar

Ny vy `Bokningskö` som samlar allt inkommande (telefon, mejl, webbformulär, walk-in) på ett ställe:

- Varje ärende visas som ett kort: gäst, önskat datum/tid, sällskap, kanal, transkript eller mejltext.
- AI föreslår färdigt svar och bordsförslag. Personalen godkänner, justerar eller avslår med ett klick.
- Statusspår: `AI hanterar` → `Väntar på godkännande` → `Bekräftad` / `Avböjd`.
- Autopilot-läge per kanal: full automatik, eller "kräver godkännande över X gäster".
- Räknare i headern visar hur många ärenden AI löste själv idag.

## 2. Smart bordsoptimering

Byggs in i salsplanen:

- "Optimera sittning"-knapp som föreslår omplaceringar för att få in fler bokningar; förslagen visas som spöklika förhandsbord innan de accepteras.
- Turnover-prognos per bord (förväntad frigöringstid) och färgmarkering för bord som ligger efter schemat.
- Överbokningsskydd som varnar innan en bokning skapas som spränger kapaciteten i ett pass.
- Låsta bord respekteras alltid av optimeringen (finns redan i bokningsdialogen).
- Kapacitetsmätare per pass: bokad andel, lediga stolar, längsta lucka.

## 3. Väntelista och no-show-risk

- Väntelista som egen panel: gäst, önskad tid, flexibilitet, kontaktsätt.
- När en bokning avbokas matchar AI automatiskt mot väntelistan och skickar erbjudande med tidsgräns.
- Riskpoäng per bokning (låg/medel/hög) baserat på historik, ledtid, sällskapsstorlek och kanal.
- Automatiska påminnelser och bekräftelseförfrågningar för högriskbokningar, med resultat synligt på bokningsraden.
- Drop-in-flöde kopplat till lediga bord i realtid.

## 4. Gästprofil och merförsäljning

- Utökat gästregister: besökshistorik, snittnota, favoritbord, allergier, taggar (VIP, presspersonal, stamgäst), no-show-historik.
- Gästkort som slide-over från alla vyer (bokning, salsplan, inkorg) — samma mönster som bokningspanelen.
- AI-genererade merförsäljningsförslag inför besöket (vinpaket, tillägg, firande) som kan skickas som förbokningsmejl.
- Kampanjmotor: segment (t.ex. "inte besökt på 90 dagar"), AI-skrivet utskick, resultatuppföljning.
- Automatisk uppföljning efter besök med recensionsförfrågan.

## Genomgående

- Samma designspråk som resten av appen: signalblå accent, isgrå ytor, mjuka skuggor, dova statusfärger, inga nya färger.
- Allt AI-genererat märks tydligt och går alltid att ändra manuellt.
- Fullt responsivt, samma marginaler och knapptillgänglighet på mobil och surfplatta.

## Teknisk del

- Datamodellen i `src/lib/dashboard-data.ts` utökas med: `RequestItem` (kanal, transkript, AI-förslag, status), `WaitlistEntry`, `noShowRisk` på `Booking`, samt utökad `Guest` med historik och taggar. Allt fortsatt demo-data i klienten — ingen backend i detta steg.
- Ny logikmodul `src/lib/booking-ai.ts` för optimeringsförslag, riskpoäng och väntelistematchning (deterministiska regler mot demo-data).
- Nya rutter: `src/routes/dashboard.bokningsko.tsx` och `src/routes/dashboard.vantelista.tsx`; nya komponenter `RequestCard.tsx`, `GuestSheet.tsx`, `WaitlistPanel.tsx`, `OptimizePanel.tsx` under `src/components/dashboard/`.
- `FloorPlan.tsx` och `dashboard.salsplan.tsx` byggs ut med förslagsläge och turnover-indikator; `DashboardShell.tsx` får de nya flikarna och en AI-räknare.

## Ordning

1. Datamodell och AI-logik
2. Bokningskö
3. Väntelista och riskpoäng
4. Bordsoptimering i salsplanen
5. Gästprofil och merförsäljning
6. Responsiv genomgång

När dina skärmbilder kommer justerar jag layout och terminologi så att det matchar den befintliga dashboarden innan implementationen börjar.
