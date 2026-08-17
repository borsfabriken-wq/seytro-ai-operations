/**
 * Enkel "byggare" för PM: välj en fast meny, ett fast dryckespaket och
 * eventuella speciella artiklar. Allt räknas per gäst och betalas på plats.
 */
import { uid, type PmDiet, type PmDoc, type PmSection } from "@/lib/pm";
import type { MenuTemplate } from "@/lib/pm-templates";

export type PmExtra = { id: string; name: string; price: number; qty: number };

/** Fritt skrivet block i PM:et — används när ingen mall passar. */
export type PmFreeBlock = { id: string; title: string; body: string };

export type PmChoice = {
  menuId: string | null;
  drinkId: string | null;
  extras: PmExtra[];
  /** Kost och allergier per antal gäster. */
  diets: PmDiet[];
  note: string;
  /** Egna, fritt skrivna avsnitt som skrivs ut i PM:et. */
  freeBlocks?: PmFreeBlock[];
};

export const emptyChoice: PmChoice = {
  menuId: null,
  drinkId: null,
  extras: [],
  diets: [],
  note: "",
  freeBlocks: [],
};

/** Vanliga kostval och allergier — klickas in med antal gäster. */
export const dietOptions: { id: string; label: string; critical?: boolean }[] = [
  { id: "vegetarisk", label: "Vegetarisk" },
  { id: "vegansk", label: "Vegansk" },
  { id: "glutenfri", label: "Glutenfri", critical: true },
  { id: "laktosfri", label: "Laktosfri" },
  { id: "notallergi", label: "Nötallergi", critical: true },
  { id: "skaldjur", label: "Skaldjursallergi", critical: true },
  { id: "fisk", label: "Ingen fisk" },
  { id: "flaskfri", label: "Fläskfritt" },
  { id: "halal", label: "Halal" },
  { id: "gravid", label: "Gravid — inget rått" },
];

export const dietsGuests = (diets: PmDiet[]) => diets.reduce((sum, d) => sum + d.count, 0);

/** Vanliga tillägg som personalen kan klicka in direkt. */
export const specialArticles: { name: string; price: number }[] = [
  { name: "Tårta med ljus", price: 450 },
  { name: "Välkomstdryck bubbel", price: 145 },
  { name: "Alkoholfri välkomstdryck", price: 95 },
  { name: "Kaffe & avec", price: 125 },
  { name: "Ostbricka till bordet", price: 395 },
  { name: "Blomsterarrangemang", price: 550 },
  { name: "Extra snacks vid ankomst", price: 85 },
  { name: "Privat rum / avskärmning", price: 1500 },
];

export const findTpl = (templates: MenuTemplate[], id: string | null) =>
  (id ? templates.find((t) => t.id === id) : undefined) ?? null;

export const extrasTotal = (extras: PmExtra[]) =>
  extras.reduce((sum, e) => sum + e.price * e.qty, 0);

export function choiceTotal(choice: PmChoice, templates: MenuTemplate[], party: number) {
  const menu = findTpl(templates, choice.menuId);
  const drink = findTpl(templates, choice.drinkId);
  return (menu?.price ?? 0) * party + (drink?.price ?? 0) * party + extrasTotal(choice.extras);
}

/** Bygger (eller bygger om) ett PM-dokument utifrån valen. */
export function buildPmDoc(
  base: Pick<PmDoc, "id" | "title" | "date" | "time" | "party" | "status"> &
    Partial<Pick<PmDoc, "bookingId" | "contact" | "phone" | "email" | "invoice">>,
  choice: PmChoice,
  templates: MenuTemplate[],
): PmDoc {
  const party = Math.max(1, base.party);
  const menu = findTpl(templates, choice.menuId);
  const drink = findTpl(templates, choice.drinkId);

  const adapted = Math.min(party, dietsGuests(choice.diets));
  const standard = Math.max(0, party - adapted);

  const menuSplit = menu
    ? adapted > 0
      ? [
          ...(standard > 0
            ? [{ id: uid("sp"), qty: standard, name: menu.label, price: menu.price }]
            : []),
          {
            id: uid("sp"),
            qty: adapted,
            name: `${menu.label} — anpassad kost`,
            price: menu.price,
          },
        ]
      : [{ id: uid("sp"), qty: party, name: menu.label, price: menu.price }]
    : [];

  const split = [
    ...menuSplit,
    ...(drink ? [{ id: uid("sp"), qty: party, name: drink.label, price: drink.price }] : []),
  ];

  const fromTemplate = (t: MenuTemplate | null): PmSection[] =>
    t
      ? t.sections.map((s) => ({
          ...s,
          id: uid("s"),
          lines: s.lines.map((l) => ({ ...l, id: uid() })),
        }))
      : [];

  const dietSection: PmSection[] =
    choice.diets.length > 0
      ? [
          {
            id: uid("s"),
            title: "Anpassad kost och allergier",
            note: "Ingår i menypriset — köket anpassar rätterna. Kontrollera vid servering.",
            lines: choice.diets.map((d) => ({
              id: uid(),
              qty: d.count,
              name: d.critical ? `${d.label} (allergi)` : d.label,
              ...(d.note?.trim() ? { desc: d.note.trim() } : {}),
            })),
          },
        ]
      : [];

  const extraSection: PmSection[] =
    choice.extras.length > 0
      ? [
          {
            id: uid("s"),
            title: "Speciella artiklar",
            lines: choice.extras.map((e) => ({
              id: uid(),
              qty: e.qty,
              name: e.name,
              price: e.price,
            })),
          },
        ]
      : [];

  /** Fritt skrivna avsnitt — varje rad blir en egen utskriftsrad. */
  const freeSections: PmSection[] = (choice.freeBlocks ?? [])
    .filter((f) => f.title.trim() || f.body.trim())
    .map((f) => ({
      id: uid("s"),
      title: f.title.trim() || "Eget avsnitt",
      lines: f.body
        .split("\n")
        .map((l) => l.replace(/^[-•\s]+/, "").trim())
        .filter(Boolean)
        .map((l) => ({ id: uid(), qty: 1, name: l })),
    }))
    .filter((s) => s.lines.length > 0);

  return {
    ...base,
    party,
    split,
    sections: [
      ...fromTemplate(menu),
      ...fromTemplate(drink),
      ...dietSection,
      ...extraSection,
      ...freeSections,
    ],
    ...(choice.diets.length > 0 ? { diets: choice.diets } : {}),
    ...(choice.note.trim() ? { allergies: choice.note.trim() } : {}),
  };
}

/** Kort sammanfattning som kan klistras in i en bokningsnotering. */
export function choiceSummary(choice: PmChoice, templates: MenuTemplate[], party: number) {
  const menu = findTpl(templates, choice.menuId);
  const drink = findTpl(templates, choice.drinkId);
  const rows = [
    menu ? `${party} × ${menu.label}` : null,
    drink ? `${party} × ${drink.label}` : null,
    ...choice.extras.map((e) => `${e.qty} × ${e.name}`),
    ...choice.diets.map((d) => `${d.count} × ${d.label}`),
    ...(choice.freeBlocks ?? [])
      .filter((f) => f.title.trim() || f.body.trim())
      .map((f) => `${f.title.trim() || "Eget"}: ${f.body.trim().replace(/\s*\n\s*/g, ", ")}`),
    choice.note.trim() ? `Önskemål: ${choice.note.trim()}` : null,
  ].filter(Boolean);
  return rows.length ? `PM: ${rows.join(" · ")}` : "";
}
