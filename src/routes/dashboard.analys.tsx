import { createFileRoute } from "@tanstack/react-router";
import { useVenue } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/dashboard/analys")({
  head: () => ({
    meta: [
      { title: "Analys — Seytro Dashboard" },
      { name: "description", content: "Beläggning, kanaler och nyckeltal för service och intäkter." },
      { property: "og:title", content: "Analys — Seytro Dashboard" },
      { property: "og:description", content: "Beläggning, kanaler och nyckeltal för service och intäkter." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { data, venue } = useVenue();
  const max = Math.max(...data.occupancy.map((o) => o.value));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-display text-forest">Analys</h1>
        <p className="text-body text-muted-foreground">Rullande 7 dagar · {data.label}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-caption text-muted-foreground">{kpi.label}</p>
            <p className="mt-2 text-3xl font-medium text-forest">{kpi.value}</p>
            <p className="mt-1 text-xs text-primary">{kpi.delta}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-subheading text-forest">
            {venue === "hotell" ? "Beläggning per dag" : "Bordsbeläggning per dag"}
          </h2>
          <div className="mt-6 flex h-52 items-end gap-3">
            {data.occupancy.map((o) => (
              <div key={o.label} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs text-muted-foreground">{o.value}%</span>
                <div
                  className="w-full rounded-t-lg bg-forest/85 transition-all"
                  style={{ height: `${(o.value / max) * 100}%` }}
                />
                <span className="text-xs text-muted-foreground">{o.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-subheading text-forest">Bokningskanaler</h2>
          <div className="mt-6 space-y-4">
            {data.channels.map((c) => (
              <div key={c.label}>
                <div className="flex justify-between text-sm">
                  <span className="text-forest">{c.label}</span>
                  <span className="text-muted-foreground">{c.value}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${c.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 rounded-xl bg-muted/60 p-4 text-xs text-muted-foreground">
            {venue === "hotell"
              ? "Direktbokningarna ökar när röstagenten fångar upp samtal utanför receptionens bemanning."
              : "Röstagenten står för störst andel av kvällens bokningar — inga missade samtal under rusningen."}
          </p>
        </div>
      </div>
    </div>
  );
}
