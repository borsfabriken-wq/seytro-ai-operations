import { Link } from "@tanstack/react-router";

const columns = [
  {
    title: "Gästkommunikation",
    items: [
      ["Röstagent", "Varje samtal besvaras"],
      ["E-postconcierge", "Svar i er ton"],
      ["Bokningsassistent", "Samtal och mejl blir färdiga bokningar"],
    ],
  },
  {
    title: "Restaurangdrift",
    items: [
      ["Bordsplacering", "Rätt gäst på rätt bord"],
      ["Salsplan", "Live-vy över servicen"],
      ["Tillgänglighet", "Kapacitet i realtid"],
      ["Bokningsregler", "Er servicepolicy"],
    ],
  },
  {
    title: "Gästtillväxt",
    items: [
      ["Gästinsikt", "Levande gästprofiler"],
      ["Analys", "Service och intäkter"],
      ["Kampanjer", "Genomtänkt kommunikation"],
    ],
  },
];

export function PlatformMenu({ open }: { open: boolean }) {
  return (
    <div
      className={`absolute left-0 top-full z-50 pt-3 transition-all duration-200 ease-out ${
        open
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-1 opacity-0"
      }`}
    >
      <div className="grid w-[min(90vw,52rem)] grid-cols-1 gap-8 rounded-2xl border border-border bg-card p-7 shadow-2xl sm:grid-cols-3">
        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {col.title}
            </p>
            <ul className="mt-4 space-y-3">
              {col.items.map(([name, desc]) => {
                const linkProps =
                  name === "Röstagent"
                    ? ({ to: "/voice-agent" } as const)
                    : name === "E-postconcierge"
                      ? ({ to: "/epostagent" } as const)
                      : name === "Bokningsassistent"
                        ? ({ to: "/bokningsassistent" } as const)
                        : ({ to: "/", hash: "pelare" } as const);
                return (
                  <li key={name}>
                    <Link
                      {...linkProps}
                      className="block rounded-lg px-2 py-1.5 transition-colors hover:bg-secondary"
                    >
                      <span className="block text-sm font-medium text-forest">{name}</span>
                      <span className="block text-xs text-muted-foreground">{desc}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
