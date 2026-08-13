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
}: {
  units: TableUnit[];
  selected?: string | null;
  onSelect: (unit: TableUnit) => void;
}) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-muted/30">
      {/* Bar */}
      <div className="absolute left-[24%] top-[62%] flex h-[18%] w-[18%] items-center justify-center rounded-lg border border-dashed border-border bg-card/60 text-xs uppercase tracking-widest text-muted-foreground">
        Bar
      </div>

      {units.map((u) => {
        const isSelected = selected === u.id;
        return (
          <button
            key={u.id}
            type="button"
            onClick={() => onSelect(u)}
            title={`${u.label} · ${u.seats} platser · ${u.status}`}
            style={{ left: `${u.x ?? 50}%`, top: `${u.y ?? 50}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 border text-xs font-medium leading-none transition-all hover:scale-105 ${
              shapeClass[u.shape ?? "fyrkant"]
            } ${fill[u.status]} ${
              isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
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
