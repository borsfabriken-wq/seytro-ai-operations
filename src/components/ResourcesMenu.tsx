const columns = [
  {
    title: "Lär dig",
    items: [
      ["Hjälpcenter", "Svar på vanliga frågor"],
      ["Guider", "Kom igång med Seytro"],
      ["Kundberättelser", "Så växer andra med oss"],
    ],
  },
  {
    title: "Håll dig uppdaterad",
    items: [
      ["Restauranginsikter", "Trender och analys"],
      ["Produktnyheter", "Det senaste från Seytro"],
      ["API-dokumentation", "Integrera med plattformen"],
    ],
  },
];

export function ResourcesMenu({ open }: { open: boolean }) {
  return (
    <div
      className={`absolute left-0 top-full z-50 pt-3 transition-all duration-200 ease-out ${
        open
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-1 opacity-0"
      }`}
    >
      <div className="grid w-[min(90vw,36rem)] grid-cols-1 gap-8 rounded-2xl border border-border bg-card p-7 shadow-2xl sm:grid-cols-2">
        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {col.title}
            </p>
            <ul className="mt-4 space-y-3">
              {col.items.map(([name, desc]) => (
                <li key={name}>
                  <a
                    href="#resurser"
                    className="block rounded-lg px-2 py-1.5 transition-colors hover:bg-secondary"
                  >
                    <span className="block text-sm font-medium text-forest">{name}</span>
                    <span className="block text-xs text-muted-foreground">{desc}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
