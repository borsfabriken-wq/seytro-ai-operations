# Nytt tema: Bläck & Terrakotta

Byter hela plattformens färgspråk från blått/pastellgrönt/gult till en lugn premiumpalett i bläcksvart, sand och terrakotta — med tydligare zonindelning mellan topp, arbetsyta och botten, och skuggor som gör det uppenbart vad som är en yta man kan agera på.

## Palett

- Bakgrund: varm off-white (#FBFAF8)
- Sektionsyta / sidopaneler: ljus sand (#E8E3DC, ljusare varianter för paneler)
- Text och mörka ytor: bläck (#1C1B1A)
- Signalfärg: terrakotta (#C4573C) — används sparsamt, bara för det som är aktivt eller kräver handling

## Statusfärger: monokromt plus en signalfärg

Alla statusar byggs av gråskala plus terrakotta, inga pastellfärger kvar:

- Tillgängligt: ljus yta, hårfin kant, dämpad text
- Upptaget: fylld bläckyta med ljus text
- Väntar / behöver åtgärd: terrakotta-tonad yta med terrakottatext
- Varning / allergi: terrakotta med kraftigare kant
- Avbokat / klart: neutral grå, nedtonad

Samma logik gäller salsplan, listor, väntelista, kalender, PM och AI-förslag så att en färg alltid betyder samma sak.

## Zonindelning och skuggor

- Topprad (datum, KPI, sök, notiser): egen sandton med hårfin underkant och lätt frostad bakgrund vid scroll — sitter visuellt "ovanpå" arbetsytan.
- Arbetsyta: den ljusaste ytan, så innehållet är det som syns mest.
- Sidomeny: mörk bläckyta, aktiv rad markeras med terrakotta.
- Bottenzon (åtgärdsrader i dialoger, sparaknappar, paneler): egen sandton med hårfin överkant, så knappar aldrig flyter ihop med innehållet.
- Fyra skuggnivåer: hårfin (kort i vila), mjuk (paneler), lyft (hover, valda kort), overlay (dialoger, slide-over). Fokusring i terrakotta.

## Tydlighet i det dagliga arbetet

- Kraftigare kontrast mellan rubrik, metadata och siffror; siffror med jämn bredd i alla KPI-, tid- och antalskolumner.
- Valt bord, vald bokning och drop-mål får samma tydliga terrakottamarkering överallt.
- Filter- och statuschips får ett enhetligt utseende (samma höjd, radie och kanttjocklek) i alla vyer.

## Teknisk genomförande

- `src/styles.css`: skriv om tokenblocket — ytnivåer, ink-skala, accent (terrakotta), kanter, skuggor, samtliga `--status-*`, diagramfärgerna och sidomenyns tokens. Legacy-alias (`--forest`, `--ember`, `--moss`, `--tide` m.fl.) pekas om till de nya värdena så inga komponenter behöver röras för färgens skull.
- Nya tokens för zonerna: `--dashboard-header`, `--dashboard-header-edge` plus en motsvarande `--dashboard-footer`-yta för åtgärdsrader.
- `src/components/dashboard/PmSheet.tsx` och `PmComposer.tsx` är de enda filerna med hårdkodade Tailwind-färger (amber/emerald i kost- och allergirutan) — de byts mot statustokens.
- Kontrollera kontrast (AA) för text på sand, på bläck och på terrakotta innan avslut, och granska dashboard, salsplan, kalender, PM och publika startsidan i förhandsvisningen.

Publika sidorna (start, tjänster, demo) följer samma palett så att inloggat och utloggat läge hänger ihop.
