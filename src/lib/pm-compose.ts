/**
 * Enkel "byggare" för PM: välj en fast meny, ett fast dryckespaket och
 * eventuella speciella artiklar. Allt räknas per gäst och betalas på plats.
 */
import { uid, type PmDoc, type PmSection } from "@/lib/pm";
import type { MenuTemplate } from "@/lib/pm-templates";

export type PmExtra = { id: string; name: string; price: number; qty: number };

export type PmChoice = {
  menuId: string | null;
  drinkId: string | null;
  extras: PmExtra[];
  note: string;
};

export const emptyChoice: PmChoice = { menuId: null, drinkId: null, extras: [], note: "" };

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

  const split = [
    ...(menu ? [{ id: uid("sp"), qty: party, name: menu.label, price: menu.price }] : []),
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

  return {
    ...base,
    party,
    split,
    sections: [...fromTemplate(menu), ...fromTemplate(drink), ...extraSection],
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
    choice.note.trim() ? `Önskemål: ${choice.note.trim()}` : null,
  ].filter(Boolean);
  return rows.length ? `PM: ${rows.join(" · ")}` : "";
}
