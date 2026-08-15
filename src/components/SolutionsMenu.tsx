import { Link } from "@tanstack/react-router";

const columns = [
  {
    title: "Efter verksamhet",
    base: "/losningar",
    items: [
      ["fristaende-restauranger", "Fristående restauranger", "Personlig service i världsklass"],
      ["restauranggrupper", "Restauranggrupper", "Skalbarhet över alla enheter"],
      ["fine-dining", "Fine dining", "Detaljrikedom utan kompromiss"],
    ],
  },
  {
    title: "Efter driftform",
    base: "/losningar",
    items: [
      ["hotell", "Hotell", "Gästservice dygnet runt"],
      ["barer-och-lounger", "Barer och lounger", "Snabb och smidig kommunikation"],
      ["hogvolymsverksamheter", "Högvolymsverksamheter", "Hantera rusning utan stress"],
    ],
  },
];

export function SolutionsMenu({ open }: { open: boolean }) {
  return (
    <div
      className={`absolute left-0 top-full z-50 pt-3 transition-all duration-200 ease-out ${
        open
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-1 opacity-0"
      }`}
    >
      <div className="grid w-[min(90vw,36rem)] grid-cols-1 gap-8 rounded-2xl border border-border bg-card p-7 shadow-overlay sm:grid-cols-2">
        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {col.title}
            </p>
            <ul className="mt-4 space-y-3">
              {col.items.map(([slug, name, desc]) => (
                <li key={name}>
                  <Link
                    to={`${col.base}/${slug}` as string}
                    className="block rounded-lg px-2 py-1.5 transition-colors hover:bg-secondary"
                  >
                    <span className="block text-sm font-medium text-forest">{name}</span>
                    <span className="block text-xs text-muted-foreground">{desc}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

