import { createFileRoute } from "@tanstack/react-router";
import { useVenue } from "@/components/dashboard/DashboardShell";
import { unitStatusStyles } from "@/lib/dashboard-data";

export const Route = createFileRoute("/dashboard/salsplan")({
  head: () => ({
    meta: [
      { title: "Salsplan och rumsöversikt — Seytro Dashboard" },
      { name: "description", content: "Live-vy över bord och rum med status i realtid." },
      { property: "og:title", content: "Salsplan och rumsöversikt — Seytro Dashboard" },
      { property: "og:description", content: "Live-vy över bord och rum med status i realtid." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FloorPage,
});

function FloorPage() {
  const { data, venue } = useVenue();
  const zones = Array.from(new Set(data.units.map((u) => u.zone)));
  const counts = {
    ledigt: data.units.filter((u) => u.status === "ledigt").length,
    dukat: data.units.filter((u) => u.status === "dukat").length,
    upptaget: data.units.filter((u) => u.status === "upptaget").length,
    städas: data.units.filter((u) => u.status === "städas").length,
  };

  return (
    <div className="mx-auto max-w-[96rem] space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display text-forest">
            {venue === "hotell" ? "Rumsöversikt" : "Salsplan"}
          </h1>
          <p className="text-body text-muted-foreground">
            {data.units.length} {venue === "hotell" ? "rum" : "bord"} · uppdateras löpande
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {Object.entries(counts).map(([k, v]) => (
            <span
              key={k}
              className={`rounded-full border px-3 py-1 capitalize ${unitStatusStyles[k as keyof typeof counts]}`}
            >
              {k} · {v}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {zones.map((zone) => (
          <div key={zone} className="rounded-2xl border border-border bg-card p-5">
            <p className="eyebrow text-muted-foreground">{zone}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
              {data.units
                .filter((u) => u.zone === zone)
                .map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    className={`rounded-xl border p-4 text-left transition-transform hover:-translate-y-0.5 ${unitStatusStyles[u.status]}`}
                  >
                    <span className="block text-lg font-medium">{u.label}</span>
                    <span className="block text-xs opacity-80">
                      {venue === "hotell" ? `${u.seats} bäddar` : `${u.seats} platser`}
                    </span>
                    <span className="mt-2 block text-xs capitalize opacity-90">{u.status}</span>
                    {u.guest && (
                      <span className="block truncate text-xs opacity-80">
                        {u.guest} · {u.until}
                      </span>
                    )}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
