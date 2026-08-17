import { useMemo, useRef, useState } from "react";
import { ArrowRight, Clock, FileText, Lock, Minus, Plus, Users, X } from "lucide-react";
import type { Booking, TableUnit } from "@/lib/dashboard-data";

/** Endast två relevanta lägen i salen: tillgängligt eller upptaget av ett sällskap. */
export type FloorState = "tillgängligt" | "upptaget";

export const floorStateOf = (u: TableUnit): FloorState =>
  u.status === "upptaget" || u.status === "dukat" ? "upptaget" : "tillgängligt";

export const floorStateLabel: Record<FloorState, string> = {
  tillgängligt: "Tillgängligt",
  upptaget: "Upptaget",
};

const zooms = [0.8, 1, 1.3, 1.7, 2.2] as const;

/** Planen är 16:10 — höjdprocent är 1.6× tätare än breddprocent. */
const ASPECT = 1.6;
/** Marginal runt bordskroppen där stolarna ritas (i breddprocent). */
const CHAIR_PAD = 0.95;

type Body = { w: number; h: number; radius: string; round: boolean };

/** Bordskroppens storlek i breddprocent, utifrån form och antal platser. */
function body(u: TableUnit): Body {
  const seats = u.seats ?? 2;
  const shape = u.shape ?? "fyrkant";
  if (shape === "bar") return { w: 13, h: 7, radius: "0.35rem", round: false };
  if (shape === "lounge") return { w: 1.9, h: 1.9, radius: "999px", round: true };
  if (shape === "rund") {
    const d = 2.6 + seats * 0.25;
    return { w: d, h: d, radius: "999px", round: true };
  }
  if (shape === "avlang") return { w: 2.4 + seats * 0.5, h: 2.6, radius: "0.3rem", round: false };
  if (seats <= 2) return { w: 2.5, h: 2.0, radius: "0.25rem", round: false };
  if (seats <= 4) return { w: 3.1, h: 2.5, radius: "0.25rem", round: false };
  return { w: 3.8, h: 3.0, radius: "0.3rem", round: false };
}

/** Stolarnas placering i andel av hela bordsrutan (kropp + stolsmarginal). */
function chairs(u: TableUnit, b: Body): { x: number; y: number }[] {
  const seats = Math.max(1, Math.min(u.seats ?? 2, 20));
  if (u.shape === "lounge") return [];
  if (b.round) {
    return Array.from({ length: seats }, (_, i) => {
      const a = (i / seats) * Math.PI * 2 - Math.PI / 2;
      return { x: 0.5 + 0.43 * Math.cos(a), y: 0.5 + 0.43 * Math.sin(a) };
    });
  }
  const sides = u.shape === "bar" || seats > 8;
  const perSide = sides ? Math.max(1, Math.round(seats * 0.12)) : 0;
  const rest = seats - perSide * 2;
  const top = Math.ceil(rest / 2);
  const bottom = rest - top;
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < top; i++) out.push({ x: (i + 1) / (top + 1), y: 0.06 });
  for (let i = 0; i < bottom; i++) out.push({ x: (i + 1) / (bottom + 1), y: 0.94 });
  for (let i = 0; i < perSide; i++) {
    out.push({ x: 0.05, y: (i + 1) / (perSide + 1) });
    out.push({ x: 0.95, y: (i + 1) / (perSide + 1) });
  }
  return out;
}

/**
 * Salsplan i fågelvy: borden ligger på sina verkliga platser i lokalen
 * (koordinater från bordskartan), med zonytor i bakgrunden, zoom och en
 * liten ruta vid klick som visar gäst, allergier och kommentar.
 */
export function FloorPlan({
  units,
  bookings = [],
  selected,
  onSelect,
  onOpenBooking,
  dragging = false,
  onDropBooking,
  highlight,
}: {
  units: TableUnit[];
  bookings?: Booking[];
  selected?: string | null;
  onSelect: (unit: TableUnit) => void;
  onOpenBooking?: (booking: Booking) => void;
  dragging?: boolean;
  onDropBooking?: (unit: TableUnit, bookingId: string) => void;
  /** Id på bord som matchar aktuell sökning — övriga tonas ned. */
  highlight?: string[] | null;
}) {
  const [over, setOver] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [peek, setPeek] = useState<{ id: string; x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const bookingFor = (u: TableUnit) =>
    bookings.find(
      (b) => b.placed !== false && b.status !== "avbokad" && b.table === u.label,
    ) ?? null;

  /** Enheter utan koordinater (t.ex. hotellrum) får en jämn placering per zon. */
  const placed = useMemo(() => {
    const zoneOrder = Array.from(new Set(units.map((u) => u.zone)));
    const perZone = new Map<string, number>();
    return units.map((u) => {
      if (typeof u.x === "number" && typeof u.y === "number") return u;
      const zi = zoneOrder.indexOf(u.zone);
      const i = perZone.get(u.zone) ?? 0;
      perZone.set(u.zone, i + 1);
      const cols = 6;
      return {
        ...u,
        x: 10 + (i % cols) * 15,
        y: 12 + zi * 22 + Math.floor(i / cols) * 10,
      };
    });
  }, [units]);

  /** Diskret etikett per zon, satt vid zonens övre vänstra hörn. */
  const zoneLabels = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    for (const u of placed) {
      const x = u.x ?? 50;
      const y = u.y ?? 50;
      const cur = map.get(u.zone);
      map.set(u.zone, cur ? { x: Math.min(cur.x, x), y: Math.min(cur.y, y) } : { x, y });
    }
    return Array.from(map, ([zone, p]) => ({ zone, ...p }));
  }, [placed]);

  const peekUnit = peek ? placed.find((u) => u.id === peek.id) ?? null : null;
  const peekBooking = peekUnit ? bookingFor(peekUnit) : null;

  const occupied = placed.filter((u) => floorStateOf(u) === "upptaget").length;
  const hits = highlight && highlight.length > 0 ? new Set(highlight) : null;

  return (
    <div className="relative rounded-[1.75rem] border border-border-subtle bg-card">
      {/* Verktygsrad */}
      <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-4 py-2.5">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full border border-border-subtle bg-background" />
            Tillgängligt
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-surface-inverse" />
            Upptaget
          </span>
          <span className="tabular-nums">
            {occupied}/{placed.length} bord
          </span>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-border p-0.5">
          <button
            type="button"
            aria-label="Zooma ut"
            onClick={() =>
              setZoom((z) => zooms[Math.max(0, zooms.indexOf(z as never) - 1)] ?? z)
            }
            className="grid h-6 w-6 place-items-center rounded-full text-muted-foreground hover:text-forest"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-9 text-center text-[11px] tabular-nums text-muted-foreground">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            aria-label="Zooma in"
            onClick={() =>
              setZoom(
                (z) => zooms[Math.min(zooms.length - 1, zooms.indexOf(z as never) + 1)] ?? z,
              )
            }
            className="grid h-6 w-6 place-items-center rounded-full text-muted-foreground hover:text-forest"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Rullbar yta */}
      <div
        className={`max-h-[36rem] overflow-auto rounded-b-[1.75rem] p-4 ${
          dragging ? "ring-1 ring-inset ring-primary/40" : ""
        }`}
      >
        {/* Själva planen i fågelvy */}
        <div
          ref={canvasRef}
          onClick={(e) => {
            if (e.target === e.currentTarget) setPeek(null);
          }}
          className="relative overflow-hidden rounded-2xl border border-border-subtle bg-background"
          style={{
            width: `${100 * zoom}%`,
            aspectRatio: "16 / 10",
            backgroundImage:
              "linear-gradient(to right, color-mix(in oklab, var(--color-foreground) 4%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--color-foreground) 4%, transparent) 1px, transparent 1px)",
            backgroundSize: "4% 6.25%",
          }}
        >
          {/* Zonytor */}
          {zoneAreas.map((z) => (
            <div
              key={z.zone}
              className="pointer-events-none absolute rounded-2xl border border-dashed border-border-subtle bg-muted/40"
              style={{
                left: `${z.x1}%`,
                top: `${z.y1}%`,
                width: `${z.x2 - z.x1}%`,
                height: `${z.y2 - z.y1}%`,
              }}
            >
              <span className="absolute left-2 top-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {z.zone}
              </span>
            </div>
          ))}

          {/* Bord */}
          {placed.map((u) => {
            const isSelected = selected === u.id;
            const isOver = over === u.id;
            const state = floorStateOf(u);
            const booking = bookingFor(u);
            const guest = booking?.name ?? u.guest;
            const party = booking?.party;
            const f = footprint(u);
            const isHit = hits ? hits.has(u.id) : null;

            return (
              <button
                key={u.id}
                type="button"
                onClick={(e) => {
                  const box = canvasRef.current?.getBoundingClientRect();
                  const el = e.currentTarget.getBoundingClientRect();
                  if (box) {
                    setPeek((p) =>
                      p?.id === u.id
                        ? null
                        : {
                            id: u.id,
                            x: el.left - box.left + el.width / 2,
                            y: el.top - box.top + el.height,
                          },
                    );
                  }
                  onSelect(u);
                }}
                onDragOver={(e) => {
                  if (!onDropBooking) return;
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (over !== u.id) setOver(u.id);
                }}
                onDragLeave={() => setOver((v) => (v === u.id ? null : v))}
                onDrop={(e) => {
                  if (!onDropBooking) return;
                  e.preventDefault();
                  setOver(null);
                  const id = e.dataTransfer.getData("text/booking-id");
                  if (id) onDropBooking(u, id);
                }}
                title={`${u.label} · ${u.seats} platser · ${floorStateLabel[state]}${guest ? ` · ${guest}` : ""}`}
                style={{
                  left: `${u.x}%`,
                  top: `${u.y}%`,
                  width: `${f.w}%`,
                  height: `${f.h * 1.6}%`,
                  borderRadius: f.radius,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center border px-1 transition-all duration-150 ${
                  state === "upptaget"
                    ? "border-transparent bg-surface-inverse text-primary-foreground shadow-[0_10px_28px_-18px_color-mix(in_oklab,var(--color-foreground)_70%,transparent)]"
                    : "border-border-subtle bg-card text-forest shadow-hairline hover:border-primary/60"
                } ${
                  isOver
                    ? "scale-[1.08] ring-2 ring-primary"
                    : isSelected || peek?.id === u.id
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                      : isHit
                        ? "ring-2 ring-primary/70 ring-offset-2 ring-offset-background"
                        : dragging && state === "tillgängligt"
                          ? "ring-1 ring-primary/40"
                          : ""
                } ${isHit === false ? "opacity-25" : ""}`}
              >
                <span className="text-[11px] font-medium leading-none tabular-nums">
                  {u.label}
                </span>
                <span
                  className={`mt-0.5 inline-flex items-center gap-0.5 text-[9px] leading-none tabular-nums ${
                    state === "upptaget" ? "opacity-70" : "text-muted-foreground"
                  }`}
                >
                  <Users className="h-2 w-2" />
                  {party ? `${party}/${u.seats}` : u.seats}
                </span>
                {booking?.lockedTable && (
                  <Lock className="absolute right-1 top-1 h-2 w-2 opacity-70" />
                )}
              </button>
            );
          })}

          {/* Liten, kompakt popup vid bordsklick */}
          {peekUnit && peek && (
            <div
              className="absolute z-20 w-56 -translate-x-1/2 translate-y-2 overflow-hidden rounded-xl border border-border-subtle bg-card p-2.5 text-left shadow-overlay"
              style={{ left: peek.x, top: peek.y }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Bord {peekUnit.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{peekUnit.zone}</span>
                </div>
                <button
                  type="button"
                  aria-label="Stäng"
                  onClick={() => setPeek(null)}
                  className="rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-forest"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {peekBooking ? (
                <div className="mt-2 space-y-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground leading-tight">
                      {peekBooking.name}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {peekBooking.time}
                        {peekBooking.end ? `–${peekBooking.end}` : ""}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {peekBooking.party}/{peekUnit.seats}
                      </span>
                    </div>
                  </div>

                  {peekBooking.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {peekBooking.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-border-subtle bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {peekBooking.note && (
                    <div className="rounded-lg border-l-2 border-primary bg-accent/40 px-2 py-1.5">
                      <p className="flex items-start gap-1 text-[11px] leading-snug text-foreground">
                        <FileText className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                        {peekBooking.note}
                      </p>
                    </div>
                  )}

                  {onOpenBooking && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenBooking(peekBooking);
                        setPeek(null);
                      }}
                      className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Öppna bokning och profil
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-2 space-y-0.5">
                  <p className="text-xs font-medium text-muted-foreground">Ledigt</p>
                  <p className="text-[11px] text-muted-foreground">{peekUnit.seats} platser</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
