import { useRef, useState } from "react";
import { Copy, Trash2 } from "lucide-react";

import type { TableUnit } from "@/lib/dashboard-data";
import { newTable } from "@/lib/onboarding";

const shapeClass: Record<NonNullable<TableUnit["shape"]>, string> = {
  rund: "rounded-full h-14 w-14",
  fyrkant: "rounded-md h-12 w-12",
  avlang: "rounded-lg h-12 w-24",
};

const shapes: NonNullable<TableUnit["shape"]>[] = ["fyrkant", "rund", "avlang"];

export function FloorPlanEditor({
  tables,
  zones,
  onChange,
}: {
  tables: TableUnit[];
  zones: string[];
  onChange: (tables: TableUnit[]) => void;
}) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [zone, setZone] = useState(zones[0] ?? "Matsalen");
  const dragging = useRef<string | null>(null);

  const active = tables.find((t) => t.id === selected) ?? null;

  const update = (id: string, patch: Partial<TableUnit>) =>
    onChange(tables.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  const posFromEvent = (e: { clientX: number; clientY: number }) => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: Math.min(96, Math.max(4, ((e.clientX - rect.left) / rect.width) * 100)),
      y: Math.min(94, Math.max(6, ((e.clientY - rect.top) / rect.height) * 100)),
    };
  };

  const addTable = () => {
    const label = String(tables.length + 1);
    const spot = { x: 10 + ((tables.length * 13) % 80), y: 15 + ((tables.length * 17) % 70) };
    const t = newTable(zone, spot.x, spot.y, label);
    onChange([...tables, t]);
    setSelected(t.id);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <select
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm"
          >
            {zones.map((z) => (
              <option key={z}>{z}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={addTable}
            className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
          >
            + Lägg till bord
          </button>
          <span className="text-sm text-muted-foreground">
            {tables.length} bord · {tables.reduce((s, t) => s + t.seats, 0)} platser
          </span>
        </div>

        <div
          ref={boardRef}
          onDoubleClick={(e) => {
            const p = posFromEvent(e);
            if (!p) return;
            const t = newTable(zone, p.x, p.y, String(tables.length + 1));
            onChange([...tables, t]);
            setSelected(t.id);
          }}
          className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-dashed border-border bg-muted/30"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)",
            backgroundSize: "5% 8%",
          }}
        >
          {tables.length === 0 && (
            <p className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-muted-foreground">
              Dubbelklicka i planen eller tryck ”Lägg till bord” för att börja bygga bordskartan.
              Dra borden dit de står i lokalen.
            </p>
          )}

          {tables.map((t) => (
            <button
              key={t.id}
              type="button"
              onPointerDown={(e) => {
                (e.target as HTMLElement).setPointerCapture(e.pointerId);
                dragging.current = t.id;
                setSelected(t.id);
              }}
              onPointerMove={(e) => {
                if (dragging.current !== t.id) return;
                const p = posFromEvent(e);
                if (p) update(t.id, p);
              }}
              onPointerUp={() => {
                dragging.current = null;
              }}
              style={{ left: `${t.x ?? 50}%`, top: `${t.y ?? 50}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none border text-xs font-medium leading-none active:cursor-grabbing ${
                shapeClass[t.shape ?? "fyrkant"]
              } ${
                selected === t.id
                  ? "border-primary bg-primary/15 text-primary ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : "border-border bg-card text-muted-foreground"
              } grid place-items-center`}
            >
              <span>{t.label}</span>
              <span className="text-[10px] font-normal opacity-70">{t.seats}p</span>
            </button>
          ))}
        </div>
      </div>

      <aside className="rounded-2xl border border-border bg-card p-4">
        {!active ? (
          <p className="text-sm text-muted-foreground">
            Markera ett bord för att ändra namn, antal platser, form och zon.
          </p>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">
                Bordsnamn
              </label>
              <input
                value={active.label}
                onChange={(e) => update(active.id, { label: e.target.value })}
                className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-sm"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">
                Platser: {active.seats}
              </label>
              <input
                type="range"
                min={1}
                max={20}
                value={active.seats}
                onChange={(e) => update(active.id, { seats: Number(e.target.value) })}
                className="mt-2 w-full accent-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Form</label>
              <div className="mt-1 flex gap-2">
                {shapes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => update(active.id, { shape: s })}
                    className={`h-9 flex-1 rounded-lg border text-xs capitalize ${
                      (active.shape ?? "fyrkant") === s
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Zon</label>
              <select
                value={active.zone}
                onChange={(e) => update(active.id, { zone: e.target.value })}
                className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-sm"
              >
                {zones.map((z) => (
                  <option key={z}>{z}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  const copy = {
                    ...active,
                    id: `${active.id}-c${tables.length}`,
                    label: `${active.label}b`,
                    x: Math.min(94, (active.x ?? 50) + 8),
                  };
                  onChange([...tables, copy]);
                  setSelected(copy.id);
                }}
                className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border text-xs"
              >
                <Copy className="h-3.5 w-3.5" /> Kopiera
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange(tables.filter((t) => t.id !== active.id));
                  setSelected(null);
                }}
                className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-destructive/30 text-xs text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" /> Ta bort
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
