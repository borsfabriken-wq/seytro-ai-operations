import { useEffect, useState } from "react";
import {
  Coffee,
  CroissantIcon,
  Fish,
  GlassWater,
  Martini,
  PartyPopper,
  Soup,
  Sparkles,
  UtensilsCrossed,
  Wheat,
  X,
} from "lucide-react";

import {
  PERIOD_ICONS,
  weekdayShort,
  type PeriodIcon,
  type ServicePeriod,
} from "@/lib/onboarding";

export const periodIconMap: Record<PeriodIcon, typeof Coffee> = {
  frukost: CroissantIcon,
  brod: Wheat,
  soppa: Soup,
  kaffe: Coffee,
  glas: GlassWater,
  bestick: UtensilsCrossed,
  drink: Martini,
  skaldjur: Fish,
  event: PartyPopper,
};

export function PeriodIconGlyph({
  icon,
  className = "h-4 w-4",
}: {
  icon: PeriodIcon;
  className?: string;
}) {
  const Icon = periodIconMap[icon] ?? UtensilsCrossed;
  return <Icon className={className} />;
}

const field =
  "h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10";

function TimePair({
  from,
  to,
  onFrom,
  onTo,
}: {
  from: string;
  to: string;
  onFrom: (v: string) => void;
  onTo: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input type="time" value={from} onChange={(e) => onFrom(e.target.value)} className={field} />
      <span className="text-xs text-muted-foreground">till</span>
      <input type="time" value={to} onChange={(e) => onTo(e.target.value)} className={field} />
    </div>
  );
}

/**
 * Slide-over med tidsinställningar för ett serveringspass.
 * Ändringar sparas först när användaren trycker Spara.
 */
export function ServicePeriodPanel({
  period,
  siblings,
  onSelect,
  onAdd,
  onSave,
  onDelete,
  onClose,
}: {
  period: ServicePeriod;
  siblings: ServicePeriod[];
  onSelect: (id: string) => void;
  onAdd: () => void;
  onSave: (next: ServicePeriod) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<ServicePeriod>(period);

  useEffect(() => setDraft(period), [period]);

  const set = (p: Partial<ServicePeriod>) => setDraft((d) => ({ ...d, ...p }));

  const toggleDay = (day: number) =>
    set({
      days: draft.days.includes(day)
        ? draft.days.filter((d) => d !== day)
        : [...draft.days, day].sort((a, b) => a - b),
    });

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Stäng"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px]"
      />
      <aside className="relative flex h-full w-full max-w-md flex-col overflow-hidden border-l border-border bg-background shadow-2xl">
        <header className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
              Serveringspass
            </p>
            <h2 className="mt-0.5 text-lg tracking-tight">Tidsinställningar</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          <section>
            <p className="text-sm text-muted-foreground">Välj ett tidsspann att ändra</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {siblings.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSelect(s.id)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                    s.id === draft.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-border bg-background hover:border-primary/40"
                  }`}
                >
                  <PeriodIconGlyph icon={s.icon} className="h-3.5 w-3.5" />
                  {s.start} - {s.end}
                </button>
              ))}
              <button
                type="button"
                onClick={onAdd}
                className="grid h-9 w-9 place-items-center rounded-xl border border-dashed border-border text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
                aria-label="Nytt pass"
              >
                +
              </button>
            </div>
          </section>

          <section>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">
              Passets namn
            </label>
            <input
              value={draft.name}
              onChange={(e) => set({ name: e.target.value })}
              placeholder="Frukost, Lunch, Middag, Afternoon tea…"
              className={`${field} mt-2`}
            />
          </section>

          <div className="grid gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Tidsperiod</p>
              <div className="mt-2">
                <TimePair
                  from={draft.start}
                  to={draft.end}
                  onFrom={(v) => set({ start: v })}
                  onTo={(v) => set({ end: v })}
                />
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Standardtid</p>
              <input
                type="time"
                value={draft.defaultTime}
                aria-label="Standardtid"
                onChange={(e) => set({ defaultTime: e.target.value })}
                className={`${field} mt-2 max-w-[10rem]`}
              />
            </div>
          </div>

          <section>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Veckodag</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {weekdayShort.map((label, day) => {
                const on = draft.days.includes(day);
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`h-9 min-w-[3.25rem] rounded-xl px-3 text-sm transition ${
                      on
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "border border-border bg-background text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Summering antal
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Intervallet som räknas ihop i dagens siffror.
            </p>
            <div className="mt-2">
              <TimePair
                from={draft.sumStart}
                to={draft.sumEnd}
                onFrom={(v) => set({ sumStart: v })}
                onTo={(v) => set({ sumEnd: v })}
              />
            </div>
          </section>

          <section>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Ikon</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {PERIOD_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => set({ icon })}
                  aria-label={icon}
                  className={`grid h-10 w-10 place-items-center rounded-xl transition ${
                    draft.icon === icon
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <PeriodIconGlyph icon={icon} />
                </button>
              ))}
            </div>
          </section>

          <p className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Seytro AI bokar bara inom passets tidsperiod och de dagar du valt.
          </p>
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={() => onDelete(draft.id)}
            disabled={siblings.length <= 1}
            className="h-10 rounded-xl bg-destructive px-5 text-sm text-destructive-foreground transition hover:opacity-90 disabled:opacity-40"
          >
            Ta bort
          </button>
          <button
            type="button"
            onClick={() => onSave(draft)}
            className="h-10 rounded-xl bg-primary px-6 text-sm text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            Spara
          </button>
        </footer>
      </aside>
    </div>
  );
}
