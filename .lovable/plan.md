# Salsplan som i referensen — exakt bordslayout, storlek och form

Salsplanen görs om så att den ser ut och beter sig som bilden: små, täta bord med stolsprickar runt om, riktiga zonpositioner, och en liten informationsruta vid klick.

## Så ser planen ut efteråt

- **Bordskropp + stolar.** Varje bord ritas som en liten rundad kropp med stolsprickar runt kanten — antal prickar = antal platser. Två- och fyrsittare blir små rektanglar, sexor/åttor blir runda med stolar hela vägen runt, långbord blir avlånga med stolar på båda långsidorna.
- **Storlek styrs av platsantal**, inte av zon: 2 pl minst, 10 pl störst, men allt hålls litet så 100+ bord får plats på skärmen samtidigt.
- **Numret i bordet** är den enda texten på planen — litet, centrerat. Ingen gästtext, ingen tid, ingen statusetikett direkt på bordet.
- **Status med fyllning:** upptaget = mättad accentfyllning, tillgängligt = ljus yta med tunn kant, sökträff = tydlig ram, valt bord = ram + lyft. Tonade ner-läget vid sökning behålls.
- **Barn** ritas som en egen rektangulär möbel med barstolar numrerade runt kanten (som 300-serien i referensen), och loungen som en fristående grupp med små runda platser (200-serien).
- **Zoner** blir diskreta grupper i planen (Matsalen, Bar, Lounge, Uteservering) med liten etikett i hörnet i stället för stora bakgrundsrutor.
- **Zoom** behålls med +/− och procent, plus knapp för "anpassa till vy".

## Bordsuppsättningen

Demorestaurangens bordskarta byggs om till samma uppställning som referensen:

```text
1-8      väggrad till vänster, tvåsittare
9-12     fyra bord vid barens kortsida
BAR      möbel med barstolar 300-317 runt kanten
200-209  lounge/entrégrupp, små runda platser
20-28    kvadratiskt kluster mitt i salen
30-34    runda sexor/åttor i mitten
70-77    fönsterrad nere till vänster
40-45    rad under de runda borden
50-66    yttre rad längst ner
100      stor rund åtta separat
```

## Klickrutan

Samma kompakta ruta som idag men med referensens innehåll och ordning: `Bord 31 · 7 pl`, därunder `18:30–21:00 Namn (8)` och status `Sitter nu`, plus allergi/kommentar när det finns och en knapp som öppnar hela bokningen.

## Tekniskt

- `src/lib/dashboard-data.ts`: bordslistan för restaurangkontot skrivs om med nya `x`/`y`-koordinater, `seats` och `shape` enligt uppställningen ovan; nya former `bar` och `lounge-plats` läggs till i `TableUnit["shape"]`.
- `src/components/dashboard/FloorPlan.tsx`: `footprint()` byts mot en tätare skala, ny hjälpfunktion ritar stolsprickar runt bordet, zonbakgrunderna ersätts av lätta gruppetiketter, peek-rutan får referensens innehållsordning.
- Färger tas fortsatt från befintliga tokens (accent för upptaget, ljus yta för ledigt) — ingen ny palett införs, så temat hålls ihop med resten av dashboarden.
- Ingen logikändring: drag-och-släpp, sök/highlight, låsta bord och bokningspanelen fungerar precis som nu.
