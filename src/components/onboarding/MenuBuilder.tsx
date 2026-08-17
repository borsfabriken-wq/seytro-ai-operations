import { useMemo, useState } from "react";
import { ChevronDown, ClipboardPaste, Globe, Plus, Trash2, Wine } from "lucide-react";

import { uid } from "@/lib/pm";
import {
  buildTemplate,
  missingTranslation,
  parsePastedLines,
  serviceSlots,
  starterTemplates,
  templateKinds,
  templateLocales,
  type MenuTemplate,
  type ServiceSlot,
  type TemplateKind,
} from "@/lib/pm-templates";

const tabs: { id: TemplateKind; label: string; hint: string }[] = [
  { id: "meny", label: "Matmenyer", hint: "À la carte, fasta menyer, lunch, barn" },
  { id: "dryck", label: "Dryckespaket", hint: "Fasta paket per gäst" },
  { id: "vin", label: "Vin & alkohol", hint: "Vinlista, öl, sprit och cocktails" },
  { id: "tillägg", label: "Tillägg", hint: "Tårta, snittar, korkavgift" },
];

const field =
  "w-full rounded-xl border border-border/70 bg-background px-3 py-2 text-sm outline-none transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/10";

/** Vin-fliken visar både vin och sprit. */
function inTab(t: MenuTemplate, tab: TemplateKind) {
  if (tab === "vin") return t.kind === "vin" || t.kind === "sprit";
  return t.kind === tab;
}

export function MenuBuilder({
  value,
  onChange,
}: {
  value: MenuTemplate[];
  onChange: (next: MenuTemplate[]) => void;
}) {
  const [tab, setTab] = useState<TemplateKind>("meny");
  const [openId, setOpenId] = useState<string | null>(null);
  const [locale, setLocale] = useState<string>("sv");

  const list = useMemo(() => value.filter((t) => inTab(t, tab)), [value, tab]);

  const update = (id: string, patch: Partial<MenuTemplate>) =>
    onChange(value.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  const add = (kind: TemplateKind) => {
    const t = buildTemplate({
      label: kind === "vin" ? "Ny vinlista" : kind === "sprit" ? "Nytt barutbud" : "Ny meny",
      kind,
      price: 0,
      desc: "",
      lines: [],
    });
    onChange([...value, t]);
    setOpenId(t.id);
  };

  const addStarters = () => {
    const existing = new Set(value.map((t) => t.label));
    const next = starterTemplates().filter((t) => !existing.has(t.label));
    onChange([...value, ...next]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1 rounded-full border border-border bg-muted/40 p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium tracking-tight transition-all ${
                tab === t.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <Globe className="h-3.5 w-3.5" />
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="rounded-full border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-primary"
          >
            <option value="sv">Svenska (original)</option>
            {templateLocales.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="text-xs text-muted-foreground">
        {tabs.find((t) => t.id === tab)?.hint}
        {locale !== "sv" && " · du redigerar översättningen, svenska originalet visas som hjälptext"}
      </p>

      {value.length === 0 && (
        <button
          type="button"
          onClick={addStarters}
          className="w-full rounded-2xl border border-dashed border-primary/40 bg-primary/[0.05] p-4 text-left transition-colors hover:bg-primary/10"
        >
          <p className="text-sm font-medium text-foreground">Börja med färdiga startmallar</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            3-rätters, lunch, barnmeny, vinpaket, alkoholfritt, vinlista, bar och tillägg — redigera
            fritt efteråt.
          </p>
        </button>
      )}

      <div className="space-y-2">
        {list.map((t) => (
          <TemplateCard
            key={t.id}
            tpl={t}
            locale={locale}
            open={openId === t.id}
            onToggle={() => setOpenId(openId === t.id ? null : t.id)}
            onChange={(patch) => update(t.id, patch)}
            onRemove={() => onChange(value.filter((x) => x.id !== t.id))}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => add(tab === "vin" ? "vin" : tab)}
          className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-3.5 py-2 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Plus className="h-3.5 w-3.5" />
          {tab === "vin" ? "Ny vinlista" : tab === "dryck" ? "Nytt dryckespaket" : "Ny lista"}
        </button>
        {tab === "vin" && (
          <button
            type="button"
            onClick={() => add("sprit")}
            className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-3.5 py-2 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Wine className="h-3.5 w-3.5" /> Nytt barutbud
          </button>
        )}
        {value.length > 0 && (
          <button
            type="button"
            onClick={addStarters}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Plus className="h-3.5 w-3.5" /> Lägg till startmallar
          </button>
        )}
      </div>
    </div>
  );
}

function TemplateCard({
  tpl,
  locale,
  open,
  onToggle,
  onChange,
  onRemove,
}: {
  tpl: MenuTemplate;
  locale: string;
  open: boolean;
  onToggle: () => void;
  onChange: (patch: Partial<MenuTemplate>) => void;
  onRemove: () => void;
}) {
  const [paste, setPaste] = useState("");
  const [showPaste, setShowPaste] = useState(false);
  const isSv = locale === "sv";
  const tr = tpl.i18n?.[locale];
  const beverage = tpl.kind === "vin" || tpl.kind === "sprit";
  const lines = tpl.sections[0]?.lines ?? [];
  const needsTranslation = !isSv && missingTranslation(tpl, locale);

  const setI18n = (patch: { label?: string; desc?: string }) =>
    onChange({ i18n: { ...tpl.i18n, [locale]: { ...tr, ...patch } } });

  const setLineI18n = (name: string, patch: { name?: string; desc?: string }) =>
    onChange({
      i18n: {
        ...tpl.i18n,
        [locale]: {
          ...tr,
          lines: { ...tr?.lines, [name]: { ...tr?.lines?.[name], ...patch } },
        },
      },
    });

  const setLines = (next: typeof lines) =>
    onChange({ sections: [{ title: tpl.label, lines: next }] });

  const toggleService = (s: ServiceSlot) => {
    const cur = tpl.service ?? [];
    onChange({ service: cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s] });
  };

  return (
    <div
      className={`rounded-2xl border bg-card transition-colors ${
        tpl.active === false ? "border-border/60 opacity-60" : "border-border/70"
      }`}
    >
      <div className="flex items-center gap-3 p-3.5">
        <button type="button" onClick={onToggle} className="min-w-0 flex-1 text-left">
          <p className="flex min-w-0 items-center gap-2 truncate text-sm font-medium tracking-tight text-foreground">
            {isSv ? tpl.label : tr?.label?.trim() || tpl.label}
            {needsTranslation && (
              <span className="shrink-0 rounded-full bg-status-alert px-2 py-0.5 text-[10px] font-medium text-status-alert-fg">
                Saknar översättning
              </span>
            )}
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {templateKinds.find((k) => k.id === tpl.kind)?.label}
            {tpl.price > 0 && ` · ${tpl.price} kr/gäst`} · {lines.length} rader
            {tpl.service?.length ? ` · ${tpl.service.join(", ")}` : ""}
          </p>
        </button>
        <button
          type="button"
          onClick={() => onChange({ active: tpl.active === false })}
          className="shrink-0 rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          {tpl.active === false ? "Aktivera" : "Pausa"}
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Ta bort"
          className="shrink-0 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </button>
        <button type="button" onClick={onToggle} aria-label="Visa detaljer" className="shrink-0">
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {open && (
        <div className="space-y-3 border-t border-border/60 p-3.5">
          <div className="grid gap-2 sm:grid-cols-[2fr_1fr]">
            <input
              value={isSv ? tpl.label : (tr?.label ?? "")}
              onChange={(e) =>
                isSv ? onChange({ label: e.target.value }) : setI18n({ label: e.target.value })
              }
              placeholder={isSv ? "Namn" : `${tpl.label} (översätt)`}
              className={field}
            />
            {isSv ? (
              <input
                type="number"
                value={tpl.price}
                onChange={(e) => onChange({ price: Number(e.target.value) })}
                placeholder="Pris per gäst"
                className={field}
              />
            ) : (
              <select
                value={tpl.kind}
                disabled
                className={`${field} opacity-60`}
                aria-label="Typ"
              >
                <option>{templateKinds.find((k) => k.id === tpl.kind)?.label}</option>
              </select>
            )}
          </div>

          <input
            value={isSv ? tpl.desc : (tr?.desc ?? "")}
            onChange={(e) =>
              isSv ? onChange({ desc: e.target.value }) : setI18n({ desc: e.target.value })
            }
            placeholder={isSv ? "Beskrivning" : tpl.desc || "Beskrivning (översätt)"}
            className={field}
          />

          {isSv && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground">Gäller:</span>
              {serviceSlots.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleService(s.id)}
                  className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
                    tpl.service?.includes(s.id)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          <ul className="space-y-2">
            {lines.map((l, i) => (
              <li key={l.id} className="rounded-xl border border-border/70 bg-background p-2.5">
                <div className="flex items-center gap-2">
                  <input
                    value={isSv ? l.name : (tr?.lines?.[l.name]?.name ?? "")}
                    onChange={(e) =>
                      isSv
                        ? setLines(
                            lines.map((x, xi) => (xi === i ? { ...x, name: e.target.value } : x)),
                          )
                        : setLineI18n(l.name, { name: e.target.value })
                    }
                    placeholder={isSv ? "Namn" : l.name}
                    className="min-w-0 flex-1 bg-transparent text-sm font-medium tracking-tight outline-none"
                  />
                  {isSv && (
                    <input
                      type="number"
                      value={l.price ?? ""}
                      onChange={(e) =>
                        setLines(
                          lines.map((x, xi) => {
                            if (xi !== i) return x;
                            const { price: _drop, ...rest } = x;
                            return e.target.value
                              ? { ...rest, price: Number(e.target.value) }
                              : rest;
                          }),

                        )
                      }
                      placeholder="Pris"
                      className="w-20 shrink-0 rounded-lg border border-border/70 bg-card px-2 py-1 text-xs outline-none focus:border-primary"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setLines(lines.filter((_, xi) => xi !== i))}
                    aria-label="Ta bort rad"
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <input
                  value={isSv ? (l.desc ?? "") : (tr?.lines?.[l.name]?.desc ?? "")}
                  onChange={(e) =>
                    isSv
                      ? setLines(
                          lines.map((x, xi) => (xi === i ? { ...x, desc: e.target.value } : x)),
                        )
                      : setLineI18n(l.name, { desc: e.target.value })
                  }
                  placeholder={isSv ? "Beskrivning" : l.desc || "Beskrivning (översätt)"}
                  className="mt-1 w-full bg-transparent text-xs text-muted-foreground outline-none"
                />

                {isSv && beverage && (
                  <div className="mt-2 grid gap-1.5 sm:grid-cols-4">
                    {(
                      [
                        ["producer", "Producent"],
                        ["vintage", "Årgång"],
                        ["glassPrice", "Glas kr"],
                        ["bottlePrice", "Flaska kr"],
                      ] as const
                    ).map(([key, label]) => (
                      <input
                        key={key}
                        value={String(tpl.beverage?.[l.name]?.[key] ?? "")}
                        onChange={(e) =>
                          onChange({
                            beverage: {
                              ...tpl.beverage,
                              [l.name]: {
                                ...tpl.beverage?.[l.name],
                                [key]:
                                  key === "glassPrice" || key === "bottlePrice"
                                    ? Number(e.target.value.replace(/\D/g, "")) || undefined
                                    : e.target.value,
                              },
                            },
                          })
                        }
                        placeholder={label}
                        className="rounded-lg border border-border/70 bg-card px-2 py-1 text-[11px] outline-none focus:border-primary"
                      />
                    ))}
                    <input
                      value={tpl.beverage?.[l.name]?.allergens ?? ""}
                      onChange={(e) =>
                        onChange({
                          beverage: {
                            ...tpl.beverage,
                            [l.name]: {
                              ...tpl.beverage?.[l.name],
                              allergens: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder="Innehåll/allergener, t.ex. sulfiter"
                      className="rounded-lg border border-border/70 bg-card px-2 py-1 text-[11px] outline-none focus:border-primary sm:col-span-4"
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>

          {isSv && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setLines([...lines, { id: uid("tl"), qty: 0, name: "" }])}
                className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Plus className="h-3 w-3" /> Lägg till rad
              </button>
              <button
                type="button"
                onClick={() => setShowPaste((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <ClipboardPaste className="h-3 w-3" /> Klistra in meny
              </button>
            </div>
          )}

          {isSv && showPaste && (
            <div className="rounded-xl border border-border/70 bg-background p-2.5">
              <textarea
                value={paste}
                onChange={(e) => setPaste(e.target.value)}
                rows={4}
                placeholder={"En rad per post:\nToast Skagen – räkor, dill – 195\nChablis – 745"}
                className="w-full resize-y bg-transparent text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  const parsed = parsePastedLines(paste);
                  if (parsed.length === 0) return;
                  setLines([
                    ...lines,
                    ...parsed.map((p) => ({
                      id: uid("tl"),
                      qty: 0,
                      name: p.name,
                      ...(p.desc ? { desc: p.desc } : {}),
                      ...(p.price ? { price: p.price } : {}),
                    })),
                  ]);
                  setPaste("");
                  setShowPaste(false);
                }}
                className="mt-1 rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground"
              >
                Importera rader
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
