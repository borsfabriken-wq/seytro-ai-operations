import { useState } from "react";
import { Lock, Users } from "lucide-react";
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
  rund: "rounded-full h-[4.5rem] w-[4.5rem]",
  fyrkant: "rounded-2xl h-[4.25rem] w-[4.25rem]",
  avlang: "rounded-2xl h-[4.25rem] w-[7.5rem]",
};

/**
 * Salsplan i ett rent, futuristiskt uttryck: mjukt rutnät i botten,
 * bord som lysande paneler och gästen kopplad direkt till bordet.
 */
export function FloorPlan({
  units,
  bookings = [],
  selected,
  onSelect,
  dragging = false,
  onDropBooking,
}: {
  units: TableUnit[];
  bookings?: Booking[];
  selected?: string | null;
  onSelect: (unit: TableUnit) => void;
  dragging?: boolean;
  onDropBooking?: (unit: TableUnit, bookingId: string) => void;
}) {
  const [over, setOver] = useState<string | null>(null);

  const bookingFor = (u: TableUnit) =>
    bookings.find(
      (b) => b.placed !== false && b.status !== "avbokad" && b.table === u.label,
    ) ?? null;

  return (
    <div
      className={`relative aspect-[16/10] w-full overflow-hidden rounded-[1.75rem] border transition-colors ${
        dragging ? "border-primary/50" : "border-border-subtle"
      }`}
      style={{
        background:
          "radial-gradient(120% 90% at 50% 0%, color-mix(in oklab, var(--color-primary) 7%, transparent) 0%, transparent 60%), var(--color-surface-1, var(--color-card))",
      }}
    >
      {/* Rutnät */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--color-foreground) 6%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--color-foreground) 6%, transparent) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(110% 90% at 50% 45%, #000 55%, transparent 100%)",
        }}
      />

      {/* Bar */}
      <div className="absolute left-[24%] top-[62%] flex h-[18%] w-[18%] items-center justify-center rounded-2xl border border-dashed border-border-subtle bg-background/40 text-[10px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-sm">
        Bar
      </div>

      {units.map((u) => {
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
            onClick={() => onSelect(u)}
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
            style={{ left: `${u.x ?? 50}%`, top: `${u.y ?? 50}%` }}
            className={`group absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center border backdrop-blur-sm transition-all duration-200 hover:-translate-y-[calc(50%+2px)] ${
              shapeClass[u.shape ?? "fyrkant"]
            } ${
              state === "upptaget"
                ? "border-transparent bg-surface-inverse text-primary-foreground shadow-[0_10px_30px_-14px_color-mix(in_oklab,var(--color-foreground)_60%,transparent)]"
                : "border-border-subtle bg-background/75 text-forest shadow-hairline hover:border-primary/60"
            } ${
              isOver
                ? "scale-[1.08] ring-2 ring-primary"
                : isSelected
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : dragging && state === "tillgängligt"
                    ? "ring-1 ring-primary/40"
                    : ""
            }`}
          >
            <span className="text-sm font-medium leading-none tabular-nums">{u.label}</span>
            <span
              className={`mt-1 inline-flex items-center gap-0.5 text-[10px] leading-none tabular-nums ${
                state === "upptaget" ? "opacity-70" : "text-muted-foreground"
              }`}
            >
              <Users className="h-2.5 w-2.5" />
              {party ? `${party}/${u.seats}` : u.seats}
            </span>

            {guest ? (
              <span className="mt-1 max-w-[6.5rem] truncate text-[10px] leading-none opacity-80">
                {guest.split(" ")[0]}
                {until ? ` · ${until}` : ""}
              </span>
            ) : (
              <span className="mt-1 text-[9px] uppercase tracking-[0.14em] text-muted-foreground opacity-70">
                Ledigt
              </span>
            )}

            {booking?.lockedTable && (
              <Lock className="absolute right-1.5 top-1.5 h-2.5 w-2.5 opacity-70" />
            )}
          </button>
        );
      })}

      {/* Förklaring */}
      <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-full border border-border-subtle bg-background/70 px-3 py-1.5 text-[10px] text-muted-foreground backdrop-blur-sm">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full border border-border-subtle bg-background" />
          Tillgängligt
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-surface-inverse" />
          Upptaget
        </span>
      </div>
    </div>
  );
}
