# Menyer, dryck och alkohol i onboardingen

Idag har onboardingen fem steg (Verksamhet, Öppettider, Zoner & bordskarta, Bokningsregler, Kanaler & AI). Menyer och dryckespaket kan bara skapas senare, inifrån PM-flödet, och finns bara på svenska. Det här lägger till ett eget steg för hela utbudet — mat, dryck, vin och sprit — med språkversioner.

## Nytt steg: "Menyer & dryck"

Placeras som steg 4, efter Bokningsregler. Fyra flikar i samma vy:

- **Matmenyer** — à la carte-menyer och fasta menyer (t.ex. 3-rätters, lunch, barnmeny, gruppmeny). Pris per gäst eller per rätt, rätter med namn, beskrivning, pris och allergimarkeringar.
- **Dryckespaket** — fasta paket per gäst (vinpaket, alkoholfritt paket, bubbelmottagning), med vad som ingår och antal glas.
- **Vin & alkohol** — vinlista och barutbud per kategori (mousserande, vitt, rött, öl, sprit, cocktails, alkoholfritt), med producent/årgång, glas- och flaskpris.
- **Tillägg** — enstaka artiklar (tårta, snittar, kaffe, korkavgift).

Varje post kan markeras som aktiv/inaktiv och taggas med vilken servering den gäller (lunch, middag, event, roomservice för hotell).

## Flera språk

Varje meny, paket och artikel får en språkväxlare. Svenska är original; man lägger till engelska (och fler språk vid behov) för namn och beskrivning. Saknad översättning visas som tydlig markering, och det går att fylla i den senare. Gästkommunikationen och PM:et använder det språk gästen bokade på och faller tillbaka på svenska.

Alkohol-poster får dessutom ett fält för allergener/innehåll (t.ex. sulfiter) som följer med i utskriften.

## Snabbstart

För att steget inte ska bli tungt: förifyllda startmallar som man kan kryssa i och redigera, plus möjlighet att hoppa över steget och fylla på senare. Import via inklistrad text (en rad per rätt: namn – beskrivning – pris) så att en befintlig meny kan klistras in i klump i stället för att skrivas rad för rad.

## Var det syns efteråt

Allt som skapas här blir samma mallar som PM-byggaren och bokningsflödet redan använder, så en meny som läggs in i onboardingen går direkt att välja när ett PM skapas på en bokning. Samma innehåll finns kvar och kan redigeras i inloggat läge.

## Teknisk skiss

- Utöka `MenuTemplate` i `src/lib/pm-templates.ts` med `kind: "vin" | "sprit"`, `active`, `service[]`, `i18n: Record<string, { label, desc, lines }>` samt per rad `producer`, `vintage`, `glassPrice`, `bottlePrice`, `allergens`.
- Lagra utbudet i `VenueSetup` (`src/lib/onboarding.ts`) som `menus: MenuTemplate[]` och skriv över till `seytro-pm-templates` när onboardingen slutförs, så PM-byggaren plockar upp dem.
- Ny komponent `src/components/onboarding/MenuBuilder.tsx` med flikar, radeditor, språkväxlare och klistra-in-import; renderas som nytt steg i `src/routes/onboarding.tsx` (steg-arrayen och stegindex justeras, "Klart" flyttas till 6).
- `PmComposer` filtrerar redan på `kind` — utökas med de nya kategorierna och läser översatt etikett via aktivt språk från befintligt i18n-lager.
