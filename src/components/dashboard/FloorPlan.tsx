import { useMemo, useRef, useState } from "react";
import { ArrowRight, Lock, Minus, Plus, Users, X } from "lucide-react";
import type { Booking, TableUnit } from "@/lib/dashboard-data";

/** Endast två relevanta lägen i salen: tillgängligt eller upptaget av ett sällskap. */
export type FloorState = "tillgängligt" | "upptaget";

export const floorStateOf = (u: TableUnit): FloorState =>
  u.status === "upptaget" || u.status === "dukat" ? "upptaget" : "tillgängligt";

export const floorStateLabel: Record<FloorState, string> = {
  tillgängligt: "Tillgängligt",
  upptaget: "Upptaget",
};

const shapeClass: Record<NonNullable<TableUnit["shape"]>, string> = {
  rund: "rounded-full",
  fyrkant: "rounded-2xl",
  avlang: "rounded-[1.25rem]",
};

const zooms = [0.85, 1, 1.2] as const;

/**
 * Salsplan som skalar till hundratals bord: borden ligger i ett luftigt rutnät
 * per zon (kan aldrig hamna ovanpå varandra) och ett klick öppnar en liten
 * ruta med gästen, allergier och kommentar.
 */
export function FloorPlan({
  units,
  bookings = [],
  selected,
  onSelect,
  onOpenBooking,
  dragging = false,
  onDropBooking,
}: {
  units: TableUnit[];
  bookings?: Booking[];
  selected?: string | null;
  onSelect: (unit: TableUnit) => void;
  onOpenBooking?: (booking: Booking) => void;
  dragging?: boolean;
  onDropBooking?: (unit: TableUnit, bookingId: string) => void;
}) {
  const [over, setOver] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [peek, setPeek] = useState<{ id: string; x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const bookingFor = (u: TableUnit) =>
    bookings.find(
      (b) => b.placed !== false && b.status !== "avbokad" && b.table === u.label,
    ) ?? null;

  const zones = useMemo(() => {
    const map = new Map<string, TableUnit[]>();
    for (const u of units) {
      const list = map.get(u.zone) ?? [];
      list.push(u);
      map.set(u.zone, list);
    }
    return Array.from(map, ([zone, list]) => ({
      zone,
      list: [...list].sort((a, b) =>
        a.label.localeCompare(b.label, "sv", { numeric: true }),
      ),
    }));
  }, [units]);

  const peekUnit = peek ? units.find((u) => u.id === peek.id) ?? null : null;
  const peekBooking = peekUnit ? bookingFor(peekUnit) : null;

  const size = Math.round(78 * zoom);

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
          <span className="tabular-nums">{units.length} bord</span>
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

      {/* Canvas */}
      <div
        ref={canvasRef}
        onClick={(e) => {
          if (e.target === e.currentTarget) setPeek(null);
        }}
        className={`relative max-h-[34rem] overflow-auto rounded-b-[1.75rem] p-4 transition-colors ${
          dragging ? "ring-1 ring-inset ring-primary/40" : ""
        }`}
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--color-foreground) 4%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--color-foreground) 4%, transparent) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      >
        <div className="space-y-5">
          {zones.map(({ zone, list }) => (
            <section key={zone}>
              <div className="mb-2 flex items-center gap-2">
                <span className="eyebrow text-muted-foreground">{zone}</span>
                <span className="h-px flex-1 bg-border-subtle" />
                <span className="text-[11px] tabular-nums text-muted-foreground">
                  {list.filter((u) => floorStateOf(u) === "upptaget").length}/{list.length}
                </span>
              </div>
              <div
                className="grid gap-3"
                style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))` }}
              >
                {list.map((u) => {
                  const isSelected = selected === u.id;
                  const isOver = over === u.id;
                  const state = floorStateOf(u);
                  const booking = bookingFor(u);
                  const guest = booking?.name ?? u.guest;
                  const until = booking?.end ?? u.until;
                  const party = booking?.party;

                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={(e) => {
                        const box = canvasRef.current?.getBoundingClientRect();
                        const el = e.currentTarget.getBoundingClientRect();
                        if (box && canvasRef.current) {
                          setPeek((p) =>
                            p?.id === u.id
                              ? null
                              : {
                                  id: u.id,
                                  x: el.left - box.left + canvasRef.current!.scrollLeft + el.width / 2,
                                  y: el.top - box.top + canvasRef.current!.scrollTop + el.height,
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
                      style={{ height: size }}
                      className={`relative flex flex-col items-center justify-center border px-2 transition-all duration-150 ${
                        shapeClass[u.shape ?? "fyrkant"]
                      } ${
                        state === "upptaget"
                          ? "border-transparent bg-surface-inverse text-primary-foreground shadow-[0_10px_28px_-18px_color-mix(in_oklab,var(--color-foreground)_70%,transparent)]"
                          : "border-border-subtle bg-background text-forest shadow-hairline hover:border-primary/60"
                      } ${
                        isOver
                          ? "scale-[1.05] ring-2 ring-primary"
                          : isSelected || peek?.id === u.id
                            ? "ring-2 ring-primary ring-offset-2 ring-offset-card"
                            : dragging && state === "tillgängligt"
                              ? "ring-1 ring-primary/40"
                              : ""
                      }`}
                    >
                      <span className="text-sm font-medium leading-none tabular-nums">
                        {u.label}
                      </span>
                      <span
                        className={`mt-1 inline-flex items-center gap-0.5 text-[10px] leading-none tabular-nums ${
                          state === "upptaget" ? "opacity-70" : "text-muted-foreground"
                        }`}
                      >
                        <Users className="h-2.5 w-2.5" />
                        {party ? `${party}/${u.seats}` : u.seats}
                      </span>
                      {guest ? (
                        <span className="mt-1 w-full truncate text-center text-[10px] leading-none opacity-80">
                          {guest.split(" ")[0]}
                          {until ? ` · ${until}` : ""}
                        </span>
                      ) : null}
                      {booking?.lockedTable && (
                        <Lock className="absolute right-1.5 top-1.5 h-2.5 w-2.5 opacity-70" />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Liten ruta vid klick */}
        {peekUnit && peek && (
          <div
            className="absolute z-20 w-60 -translate-x-1/2 translate-y-2 rounded-2xl border border-border-subtle bg-card p-3 shadow-overlay"
            style={{ left: peek.x, top: peek.y }}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Bord {peekUnit.label} · {peekUnit.zone}
                </p>
                <p className="mt-0.5 text-sm font-medium text-forest">
                  {peekBooking?.name ?? peekUnit.guest ?? "Tillgängligt"}
                </p>
              </div>
              <button
                type="button"
                aria-label="Stäng"
                onClick={() => setPeek(null)}
                className="text-muted-foreground hover:text-forest"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {peekBooking ? (
              <>
                <p className="mt-1 text-xs tabular-nums text-muted-foreground">
                  {peekBooking.time}
                  {peekBooking.end ? `–${peekBooking.end}` : ""} · {peekBooking.party} gäster ·{" "}
                  {peekUnit.seats} platser
                </p>
                {peekBooking.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {peekBooking.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {peekBooking.note && (
                  <p className="mt-2 rounded-xl bg-muted px-2.5 py-1.5 text-[11px] leading-relaxed text-forest">
                    {peekBooking.note}
                  </p>
                )}
                {onOpenBooking && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenBooking(peekBooking);
                      setPeek(null);
                    }}
                    className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-forest px-3 py-1.5 text-xs text-primary-foreground"
                  >
                    Öppna bokning och profil
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">
                {peekUnit.seats} platser · inga gäster på detta pass
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
