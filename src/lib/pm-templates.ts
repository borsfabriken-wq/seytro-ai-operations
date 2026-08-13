import { useCallback, useEffect, useState } from "react";

import { menuTemplates, uid, type PmSection } from "@/lib/pm";

export type TemplateKind = "meny" | "dryck" | "tillägg";

export type MenuTemplate = {
  id: string;
  label: string;
  kind: TemplateKind;
  price: number;
  desc: string;
  sections: Omit<PmSection, "id">[];
  /** true = skapad av restaurangen, kan tas bort */
  custom?: boolean;
};

const KEY = "seytro-pm-templates";

export const templateKinds: { id: TemplateKind; label: string }[] = [
  { id: "meny", label: "Meny" },
  { id: "dryck", label: "Dryckespaket" },
  { id: "tillägg", label: "Tillägg" },
];

/** Inbyggda mallar klassade efter typ. */
export const builtinTemplates: MenuTemplate[] = menuTemplates.map((t) => ({
  ...t,
  kind: t.id === "vinpaket" ? "dryck" : t.id === "meny2" ? "meny" : "tillägg",
}));

export type TemplateDraftLine = { name: string; desc?: string; price?: number };

export function buildTemplate(input: {
  label: string;
  kind: TemplateKind;
  price: number;
  desc: string;
  lines: TemplateDraftLine[];
}): MenuTemplate {
  return {
    id: uid("tpl"),
    label: input.label,
    kind: input.kind,
    price: input.price,
    desc: input.desc,
    custom: true,
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
