import { useState } from "react";
import { AlertTriangle, Check, Leaf, Minus, Plus, Trash2, Wallet } from "lucide-react";

import { kr } from "@/lib/pm";
import type { MenuTemplate } from "@/lib/pm-templates";
import {
  choiceTotal,
  extrasTotal,
  dietOptions,
  dietsGuests,
  findTpl,
  specialArticles,
  type PmChoice,
  type PmExtra,
} from "@/lib/pm-compose";

let n = 0;
const eid = () => `x${Date.now().toString(36)}${(n += 1)}`;

/**
 * Tre enkla steg: fast meny, fast dryckespaket och speciella artiklar.
 * Summan är ett underlag som skrivs ut — betalning sker på plats.
 */
export function PmComposer({
  party,
  templates,
  value,
  onChange,
  compact = false,
}: {
  party: number;
  templates: MenuTemplate[];
  value: PmChoice;
  onChange: (next: PmChoice) => void;
  compact?: boolean;
}) {
  const menus = templates.filter((t) => t.kind === "meny");
  const drinks = templates.filter((t) => t.kind === "dryck");
  const addons = templates.filter((t) => t.kind === "tillägg");
  /** Vin, öl och sprit läggs till som enskilda rader med sitt eget pris. */
  const beverages = templates
    .filter((t) => t.kind === "vin" || t.kind === "sprit")
    .flatMap((t) => t.sections.flatMap((s) => s.lines))
    .map((l) => ({ name: l.name, price: l.price ?? 0 }));

  const [customName, setCustomName] = useState("");
  const [mode, setMode] = useState<"mall" | "fritt">("mall");

  const [customPrice, setCustomPrice] = useState("");

  const set = (patch: Partial<PmChoice>) => onChange({ ...value, ...patch });

  const addExtra = (name: string, price: number) => {
    const existing = value.extras.find((e) => e.name === name);
    if (existing) {
      set({
        extras: value.extras.map((e) => (e.name === name ? { ...e, qty: e.qty + 1 } : e)),
      });
      return;
    }
    set({ extras: [...value.extras, { id: eid(), name, price, qty: 1 } satisfies PmExtra] });
  };

  const setQty = (id: string, qty: number) =>
    set({
      extras: value.extras
        .map((e) => (e.id === id ? { ...e, qty: Math.max(0, qty) } : e))
        .filter((e) => e.qty > 0),
    });

  const addDiet = (id: string, label: string, critical?: boolean) => {
    const existing = value.diets.find((d) => d.id === id);
    if (existing) {
      set({ diets: value.diets.map((d) => (d.id === id ? { ...d, count: d.count + 1 } : d)) });
      return;
    }
    set({ diets: [...value.diets, { id, label, count: 1, ...(critical ? { critical } : {}) }] });
  };

  const setDiet = (id: string, patch: { count?: number; note?: string }) =>
    set({
      diets: value.diets
        .map((d) =>
          d.id === id
            ? { ...d, ...patch, count: Math.max(0, patch.count ?? d.count) }
            : d,
        )
        .filter((d) => d.count > 0),
    });

  const dietGuests = dietsGuests(value.diets);

  const total = choiceTotal(value, templates, party);
  const perGuest = party > 0 ? Math.round(total / party) : 0;

  const freeBlocks = value.freeBlocks ?? [];
  const setFree = (next: typeof freeBlocks) => set({ freeBlocks: next });

  return (
    <div className={compact ? "space-y-4" : "space-y-5"}>
      {/* Läge: färdig mall eller helt fritt skrivet PM */}
      <div className="flex items-center gap-1 rounded-full border border-border bg-muted/40 p-1">
        {(
          [
            { id: "mall", label: "Från mall" },
            { id: "fritt", label: "Skriv själv" },
          ] as const
        ).map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              setMode(m.id);
              if (m.id === "fritt" && freeBlocks.length === 0) {
                setFree([{ id: eid(), title: "Upplägg", body: "" }]);
              }
            }}
            className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium tracking-tight transition-all ${
              mode === m.id
                ? "bg-card text-forest shadow-sm"
                : "text-muted-foreground hover:text-forest"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === "mall" && (
        <>
          <Step index={1} title="Fast meny" hint="Pris per gäst">
            <div className="grid gap-2 sm:grid-cols-2">
              <PickCard
                selected={value.menuId === null}
                label="Ingen fast meny"
                meta="Gästerna beställer à la carte"
                onClick={() => set({ menuId: null })}
              />
              {menus.map((t) => (
                <PickCard
                  key={t.id}
                  selected={value.menuId === t.id}
                  label={t.label}
                  meta={`${kr(t.price)} / gäst`}
                  desc={t.desc}
                  onClick={() => set({ menuId: value.menuId === t.id ? null : t.id })}
                />
              ))}
            </div>
          </Step>

          <Step index={2} title="Fast dryckespaket" hint="Pris per gäst">
            <div className="grid gap-2 sm:grid-cols-2">
              <PickCard
                selected={value.drinkId === null}
                label="Ingen dryckespaket"
                meta="Dryck beställs vid bordet"
                onClick={() => set({ drinkId: null })}
              />
              {drinks.map((t) => (
                <PickCard
                  key={t.id}
                  selected={value.drinkId === t.id}
                  label={t.label}
                  meta={`${kr(t.price)} / gäst`}
                  desc={t.desc}
                  onClick={() => set({ drinkId: value.drinkId === t.id ? null : t.id })}
                />
              ))}
            </div>
          </Step>
        </>
      )}

      {/* Fritt skrivet PM */}
      <Step
        index={mode === "fritt" ? 1 : 5}
        title="Egen text"
        hint="Skrivs ut som egna avsnitt"
      >
        <div className="space-y-2">
          {freeBlocks.map((f) => (
            <div key={f.id} className="rounded-xl border border-border bg-background p-2.5">
              <div className="flex items-center gap-2">
                <input
                  value={f.title}
                  onChange={(e) =>
                    setFree(freeBlocks.map((x) => (x.id === f.id ? { ...x, title: e.target.value } : x)))
                  }
                  placeholder="Rubrik, t.ex. Upplägg eller Kökets instruktion"
                  className="min-w-0 flex-1 bg-transparent text-sm font-medium tracking-tight text-forest outline-none"
                />
                <button
                  type="button"
                  onClick={() => setFree(freeBlocks.filter((x) => x.id !== f.id))}
                  aria-label="Ta bort avsnitt"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <textarea
                value={f.body}
                onChange={(e) =>
                  setFree(freeBlocks.map((x) => (x.id === f.id ? { ...x, body: e.target.value } : x)))
                }
                rows={3}
                placeholder={"En rad per punkt:\n18:00 välkomstdryck\n19:00 middag serveras"}
                className="mt-1.5 w-full resize-y rounded-lg border border-border/70 bg-card px-2.5 py-2 text-sm leading-relaxed outline-none transition-colors focus:border-primary"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFree([...freeBlocks, { id: eid(), title: "", body: "" }])}
            className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Plus className="h-3 w-3" /> Lägg till eget avsnitt
          </button>
        </div>
      </Step>


      <Step index={3} title="Speciella artiklar" hint="Läggs till som antal">
        <div className="flex flex-wrap gap-1.5">
          {[
            ...specialArticles,
            ...addons.map((a) => ({ name: a.label, price: a.price })),
            ...beverages,
          ].map(
            (a) => (
              <button
                key={a.name}
                type="button"
                onClick={() => addExtra(a.name, a.price)}
                className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Plus className="mr-1 inline h-3 w-3" />
                {a.name} · {kr(a.price)}
              </button>
            ),
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Egen artikel"
            className="min-w-0 flex-1 rounded-2xl border border-border/70 bg-background px-3.5 py-2.5 text-sm tracking-tight outline-none transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
          <input
            value={customPrice}
            onChange={(e) => setCustomPrice(e.target.value.replace(/[^\d]/g, ""))}
            inputMode="numeric"
            placeholder="Pris"
            className="w-24 rounded-2xl border border-border/70 bg-background px-3.5 py-2.5 text-sm tracking-tight outline-none transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
          <button
            type="button"
            onClick={() => {
              if (!customName.trim()) return;
              addExtra(customName.trim(), Number(customPrice || 0));
              setCustomName("");
              setCustomPrice("");
            }}
            className="rounded-full bg-primary px-4 py-2.5 text-sm font-medium tracking-tight text-primary-foreground shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
          >
            Lägg till
          </button>
        </div>

        {value.extras.length > 0 && (
          <ul className="mt-3 divide-y divide-border/60 rounded-xl border border-border">
            {value.extras.map((e) => (
              <li key={e.id} className="flex items-center gap-3 px-3 py-2">
                <span className="min-w-0 flex-1 truncate text-sm text-forest">{e.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{kr(e.price)}</span>
                <div className="flex shrink-0 items-center gap-1">
                  <Round onClick={() => setQty(e.id, e.qty - 1)}>
                    <Minus className="h-3 w-3" />
                  </Round>
                  <span className="w-6 text-center text-sm tabular-nums text-forest">{e.qty}</span>
                  <Round onClick={() => setQty(e.id, e.qty + 1)}>
                    <Plus className="h-3 w-3" />
                  </Round>
                </div>
                <button
                  type="button"
                  onClick={() => setQty(e.id, 0)}
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  aria-label={`Ta bort ${e.name}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Step>

      <Step index={4} title="Kost och allergier" hint="Antal gäster som får anpassad rätt">
        <div className="flex flex-wrap gap-1.5">
          {dietOptions.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => addDiet(d.id, d.label, d.critical)}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                value.diets.some((x) => x.id === d.id)
                  ? "border-primary bg-primary/8 text-primary"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              <Plus className="mr-1 inline h-3 w-3" />
              {d.label}
            </button>
          ))}
        </div>

        {value.diets.length > 0 && (
          <ul className="mt-3 space-y-2">
            {value.diets.map((d) => (
              <li key={d.id} className="rounded-2xl border border-border/70 p-3">
                <div className="flex items-center gap-3">
                  <span className="flex min-w-0 flex-1 items-center gap-1.5 truncate text-sm text-forest">
                    {d.critical ? (
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-status-alert-fg" />
                    ) : (
                      <Leaf className="h-3.5 w-3.5 shrink-0 text-primary" />
                    )}
                    {d.label}
                  </span>
                  <div className="flex shrink-0 items-center gap-1">
                    <Round onClick={() => setDiet(d.id, { count: d.count - 1 })}>
                      <Minus className="h-3 w-3" />
                    </Round>
                    <span className="w-6 text-center text-sm tabular-nums text-forest">
                      {d.count}
                    </span>
                    <Round onClick={() => setDiet(d.id, { count: d.count + 1 })}>
                      <Plus className="h-3 w-3" />
                    </Round>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDiet(d.id, { count: 0 })}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    aria-label={`Ta bort ${d.label}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <input
                  value={d.note ?? ""}
                  onChange={(e) => setDiet(d.id, { note: e.target.value })}
                  placeholder="Hur anpassas rätten? T.ex. byt smör mot olivolja"
                  className="mt-2 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs outline-none focus:border-primary"
                />
              </li>
            ))}
          </ul>
        )}

        {dietGuests > 0 && (
          <p className="mt-2 text-[11px] text-muted-foreground">
            {dietGuests} av {party} gäster får anpassad rätt · {Math.max(0, party - dietGuests)}{" "}
            standard. Anpassningarna ingår i menypriset.
          </p>
        )}
        {dietGuests > party && (
          <p className="mt-1 text-[11px] text-status-alert-fg">
            Fler anpassningar än gäster — kontrollera antalet.
          </p>
        )}
      </Step>

      <textarea
        value={value.note}
        onChange={(e) => set({ note: e.target.value })}
        rows={2}
        placeholder="Allergier och önskemål — syns i utskriften till köket"
        className="w-full rounded-2xl border border-border/70 bg-background px-3.5 py-2.5 text-sm tracking-tight outline-none transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/10"
      />

      {/* Underlag */}
      <div className="rounded-2xl border border-border/70 bg-muted/40 p-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow text-muted-foreground">Underlag att skriva ut</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {party} gäster · {kr(perGuest)} per gäst
              {extrasTotal(value.extras) > 0
                ? ` · tillägg ${kr(extrasTotal(value.extras))}`
                : ""}
            </p>
          </div>
          <p className="text-2xl font-medium tabular-nums text-forest">{kr(total)}</p>
        </div>
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-[11px] text-muted-foreground">
          <Wallet className="h-3.5 w-3.5 text-primary" /> Betalas på plats — ingen betalning sker
          via Seytro
        </p>
        {findTpl(templates, value.menuId) && (
          <p className="mt-2 text-[11px] text-muted-foreground">
            Rätterna från menyn fylls i automatiskt i utskriften — sätt antal per rätt i
            utskriftsvyn.
          </p>
        )}
      </div>
    </div>
  );
}

function Step({
  index,
  title,
  hint,
  children,
}: {
  index: number;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-2">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-primary/12 text-[11px] font-medium text-primary">
          {index}
        </span>
        <h3 className="text-sm font-medium text-forest">{title}</h3>
        {hint && <span className="text-[11px] text-muted-foreground">· {hint}</span>}
      </div>
      <div className="mt-2.5">{children}</div>
    </section>
  );
}

function PickCard({
  selected,
  label,
  meta,
  desc,
  onClick,
}: {
  selected: boolean;
  label: string;
  meta: string;
  desc?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-3.5 text-left transition-all hover:shadow-sm ${
        selected ? "border-primary bg-primary/6" : "border-border hover:border-primary/50"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 truncate text-sm font-medium text-forest">{label}</p>
        {selected && <Check className="h-4 w-4 shrink-0 text-primary" />}
      </div>
      <p className="mt-0.5 text-xs text-primary">{meta}</p>
      {desc && <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{desc}</p>}
    </button>
  );
}

function Round({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-6 w-6 place-items-center rounded-full border border-border text-muted-foreground hover:text-forest"
    >
      {children}
    </button>
  );
}
