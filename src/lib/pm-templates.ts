import { useCallback, useEffect, useState } from "react";

import { menuTemplates, uid, type PmSection } from "@/lib/pm";

export type TemplateKind = "meny" | "dryck" | "vin" | "sprit" | "tillägg";

/** Servering som mallen gäller för. */
export type ServiceSlot = "lunch" | "middag" | "event" | "roomservice";

/** Extra fält för vin- och spritrader. */
export type BeverageMeta = {
  producer?: string;
  vintage?: string;
  glassPrice?: number;
  bottlePrice?: number;
  allergens?: string;
};

/** Översatt innehåll. Nyckel = språkkod, t.ex. "en". */
export type TemplateI18n = {
  label?: string;
  desc?: string;
  /** Radöversättningar per radnamn (svenska originalet som nyckel). */
  lines?: Record<string, { name?: string; desc?: string }>;
};

export type MenuTemplate = {
  id: string;
  label: string;
  kind: TemplateKind;
  price: number;
  desc: string;
  sections: Omit<PmSection, "id">[];
  /** true = skapad av restaurangen, kan tas bort */
  custom?: boolean;
  /** false = pausad, syns inte i bokning eller PM */
  active?: boolean;
  /** Vilka serveringar mallen gäller för. Tom = alla. */
  service?: ServiceSlot[];
  /** Metadata per radnamn för vin och sprit. */
  beverage?: Record<string, BeverageMeta>;
  i18n?: Record<string, TemplateI18n>;
};

const KEY = "seytro-pm-templates";

export const templateKinds: { id: TemplateKind; label: string }[] = [
  { id: "meny", label: "Meny" },
  { id: "dryck", label: "Dryckespaket" },
  { id: "vin", label: "Vin" },
  { id: "sprit", label: "Sprit & bar" },
  { id: "tillägg", label: "Tillägg" },
];

export const serviceSlots: { id: ServiceSlot; label: string }[] = [
  { id: "lunch", label: "Lunch" },
  { id: "middag", label: "Middag" },
  { id: "event", label: "Event" },
  { id: "roomservice", label: "Roomservice" },
];

/** Språk som utbudet kan översättas till. Svenska är original. */
export const templateLocales: { id: string; label: string }[] = [
  { id: "en", label: "Engelska" },
  { id: "de", label: "Tyska" },
  { id: "fr", label: "Franska" },
];

/** Inbyggda mallar klassade efter typ. */
export const builtinTemplates: MenuTemplate[] = menuTemplates.map((t) => ({
  ...t,
  kind: t.id === "vinpaket" ? "dryck" : t.id === "meny2" ? "meny" : "tillägg",
}));

/** Hämtar etikett på valt språk med svensk fallback. */
export function tplLabel(t: MenuTemplate, locale?: string) {
  if (!locale || locale === "sv") return t.label;
  return t.i18n?.[locale]?.label?.trim() || t.label;
}

export function tplDesc(t: MenuTemplate, locale?: string) {
  if (!locale || locale === "sv") return t.desc;
  return t.i18n?.[locale]?.desc?.trim() || t.desc;
}

/** true om mallen saknar översättning på angivet språk. */
export function missingTranslation(t: MenuTemplate, locale: string) {
  const tr = t.i18n?.[locale];
  if (!tr?.label?.trim()) return true;
  return t.sections.some((s) => s.lines.some((l) => !tr.lines?.[l.name]?.name?.trim()));
}

/**
 * Tolkar inklistrad text: en rad per post, "Namn – beskrivning – pris".
 * Separator kan vara –, - eller ;.
 */
export function parsePastedLines(text: string): TemplateDraftLine[] {
  return text
    .split("\n")
    .map((r) => r.trim())
    .filter(Boolean)
    .map((row) => {
      const parts = row.split(/\s+[–—-]\s+|;/).map((p) => p.trim());
      const name = parts[0] ?? row;
      const rest = parts.slice(1);
      const priceIdx = rest.findIndex((p) => /^\d[\d\s]*(kr)?$/i.test(p));
      const price = priceIdx >= 0 ? Number(rest[priceIdx]!.replace(/\D/g, "")) : undefined;
      const desc = rest.filter((_, i) => i !== priceIdx).join(" · ");
      return { name, ...(desc ? { desc } : {}), ...(price ? { price } : {}) };
    });
}


export type TemplateDraftLine = { name: string; desc?: string; price?: number };

export function buildTemplate(input: {
  label: string;
  kind: TemplateKind;
  price: number;
  desc: string;
  lines: TemplateDraftLine[];
  service?: ServiceSlot[];
}): MenuTemplate {
  return {
    id: uid("tpl"),
    label: input.label,
    kind: input.kind,
    price: input.price,
    desc: input.desc,
    custom: true,
    active: true,
    ...(input.service?.length ? { service: input.service } : {}),
    sections: [
      {
        title: input.label,
        lines: input.lines.map((l) => ({
          id: uid("tl"),
          qty: 0,
          name: l.name,
          ...(l.desc ? { desc: l.desc } : {}),
          ...(l.price ? { price: l.price } : {}),
        })),
      },
    ],
  };
}

/** Förifyllda startmallar som kan kryssas i under onboardingen. */
export function starterTemplates(): MenuTemplate[] {
  return [
    buildTemplate({
      label: "3-rätters middag",
      kind: "meny",
      price: 695,
      desc: "Säsongsmeny med förrätt, varmrätt och dessert.",
      service: ["middag", "event"],
      lines: [
        { name: "Toast Skagen", desc: "Handskalade räkor, dill, löjrom" },
        { name: "Highland entrecôte", desc: "Rotselleri, rödvinssky" },
        { name: "Chokladtryffel", desc: "Havtorn, grädde" },
      ],
    }),
    buildTemplate({
      label: "Lunchmeny",
      kind: "meny",
      price: 165,
      desc: "Dagens rätt med sallad, bröd och kaffe.",
      service: ["lunch"],
      lines: [
        { name: "Dagens kött" },
        { name: "Dagens fisk" },
        { name: "Dagens vegetariska" },
      ],
    }),
    buildTemplate({
      label: "Barnmeny",
      kind: "meny",
      price: 125,
      desc: "Mindre portioner för barn upp till 12 år.",
      lines: [{ name: "Köttbullar med potatismos" }, { name: "Pannkakor med sylt" }],
    }),
    buildTemplate({
      label: "Vinpaket 3 glas",
      kind: "dryck",
      price: 545,
      desc: "Ett glas till varje rätt, valt av sommelieren.",
      service: ["middag", "event"],
      lines: [
        { name: "Glas 1 — mousserande" },
        { name: "Glas 2 — vitt" },
        { name: "Glas 3 — rött" },
      ],
    }),
    buildTemplate({
      label: "Alkoholfritt paket",
      kind: "dryck",
      price: 295,
      desc: "Tre alkoholfria drycker matchade till menyn.",
      lines: [{ name: "Alkoholfri bubbel" }, { name: "Kombucha" }, { name: "Örtinfusion" }],
    }),
    buildTemplate({
      label: "Vinlista",
      kind: "vin",
      price: 0,
      desc: "Glas- och flaskvin.",
      lines: [
        { name: "Champagne brut", price: 1195 },
        { name: "Chablis", price: 745 },
        { name: "Barolo", price: 995 },
      ],
    }),
    buildTemplate({
      label: "Bar & sprit",
      kind: "sprit",
      price: 0,
      desc: "Öl, cocktails och sprit.",
      lines: [
        { name: "Fatöl 40 cl", price: 89 },
        { name: "Husets gin & tonic", price: 145 },
        { name: "Cognac 4 cl", price: 165 },
      ],
    }),
    buildTemplate({
      label: "Tillägg",
      kind: "tillägg",
      price: 0,
      desc: "Enstaka artiklar som läggs på notan.",
      lines: [
        { name: "Tårta", price: 395 },
        { name: "Snittar per person", price: 95 },
        { name: "Korkavgift", price: 250 },
      ],
    }),
  ];
}


/**
 * Restaurangens egna mallar (menyer och dryckespaket). Sparas lokalt och
 * används av Seytro AI när ett PM byggs automatiskt.
 */
export function useTemplates() {
  const [custom, setCustom] = useState<MenuTemplate[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setCustom(JSON.parse(raw) as MenuTemplate[]);
    } catch {
      /* ignorera trasig lagring */
    }
  }, []);

  const persist = useCallback((next: MenuTemplate[]) => {
    setCustom(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignorera */
    }
  }, []);

  const addTemplate = useCallback(
    (t: MenuTemplate) => persist([...custom, t]),
    [custom, persist],
  );
  const removeTemplate = useCallback(
    (id: string) => persist(custom.filter((t) => t.id !== id)),
    [custom, persist],
  );

  return { templates: [...builtinTemplates, ...custom], custom, addTemplate, removeTemplate };
}
