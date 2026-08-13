import { useState } from "react";
import type { TableUnit } from "@/lib/dashboard-data";

const fill: Record<TableUnit["status"], string> = {
  ledigt: "border-border bg-card text-muted-foreground",
  dukat: "border-primary/40 bg-primary/12 text-primary",
  upptaget: "border-forest bg-forest text-primary-foreground",
  städas: "border-amber-500/40 bg-amber-500/15 text-amber-700",
};

const shapeClass: Record<NonNullable<TableUnit["shape"]>, string> = {
  rund: "rounded-full h-14 w-14",
  fyrkant: "rounded-md h-11 w-11",
  avlang: "rounded-lg h-11 w-24",
};

export function FloorPlan({
  units,
  selected,
  onSelect,
  dragging = false,
  onDropBooking,
}: {
  units: TableUnit[];
  selected?: string | null;
  onSelect: (unit: TableUnit) => void;
  dragging?: boolean;
  onDropBooking?: (unit: TableUnit, bookingId: string) => void;
}) {
  const [over, setOver] = useState<string | null>(null);

  return (
    <div
      className={`relative aspect-[16/10] w-full overflow-hidden rounded-2xl border bg-muted/30 transition-colors ${
        dragging ? "border-primary/50 bg-primary/5" : "border-border"
      }`}
    >
      {/* Bar */}
      <div className="absolute left-[24%] top-[62%] flex h-[18%] w-[18%] items-center justify-center rounded-lg border border-dashed border-border bg-card/60 text-xs uppercase tracking-widest text-muted-foreground">
        Bar
      </div>

      {units.map((u) => {
        const isSelected = selected === u.id;
        const isOver = over === u.id;
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
            title={`${u.label} · ${u.seats} platser · ${u.status}`}
            style={{ left: `${u.x ?? 50}%`, top: `${u.y ?? 50}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 border text-xs font-medium leading-none transition-all hover:scale-105 ${
              shapeClass[u.shape ?? "fyrkant"]
            } ${fill[u.status]} ${
              isOver
                ? "scale-110 ring-2 ring-primary ring-offset-2 ring-offset-background"
                : isSelected
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : dragging
                    ? "ring-1 ring-primary/30"
                    : ""
            } grid place-items-center`}
          >
            <span>{u.label}</span>
            <span className="text-[10px] font-normal opacity-70">{u.seats}p</span>
          </button>
        );
      })}
    </div>
  );
}
