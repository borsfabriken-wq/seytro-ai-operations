import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useVenue } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/dashboard/gaster")({
  head: () => ({
    meta: [
      { title: "Gästregister — Seytro Dashboard" },
      { name: "description", content: "Gästprofiler med historik, preferenser och taggar." },
      { property: "og:title", content: "Gästregister — Seytro Dashboard" },
      { property: "og:description", content: "Gästprofiler med historik, preferenser och taggar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: GuestsPage,
});

function GuestsPage() {
  const { data } = useVenue();
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(data.guests[0]?.id ?? "");
  const guests = data.guests.filter((g) => g.name.toLowerCase().includes(query.toLowerCase()));
  const active = data.guests.find((g) => g.id === activeId) ?? guests[0] ?? data.guests[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-display text-forest">Gästregister</h1>
        <p className="text-body text-muted-foreground">
          {data.guests.length} profiler byggda av bokningar, samtal och mejl.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border p-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Sök gäst"
              className="w-full rounded-full border border-border bg-background px-4 py-2 text-sm outline-none"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[42rem] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-normal">Gäst</th>
                  <th className="px-5 py-3 font-normal">Besök</th>
                  <th className="px-5 py-3 font-normal">Omsättning</th>
                  <th className="px-5 py-3 font-normal">Senast</th>
                  <th className="px-5 py-3 font-normal">Taggar</th>
                </tr>
              </thead>
              <tbody>
                {guests.map((g) => (
                  <tr
                    key={g.id}
                    onClick={() => setActiveId(g.id)}
                    className={`cursor-pointer border-b border-border/60 last:border-0 transition-colors hover:bg-muted/50 ${
                      active?.id === g.id ? "bg-muted/60" : ""
                    }`}
                  >
                    <td className="px-5 py-3">
                      <span className="block text-forest">{g.name}</span>
                      <span className="block text-xs text-muted-foreground">{g.email}</span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{g.visits}</td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {g.spend.toLocaleString("sv-SE")} kr
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{g.last}</td>
                    <td className="px-5 py-3">
                      <span className="flex flex-wrap gap-1">
                        {g.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                          >
                            {t}
                          </span>
                        ))}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {active && (
          <aside className="h-fit rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-forest text-sm text-primary-foreground">
                {active.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-forest">{active.name}</p>
                <p className="truncate text-xs text-muted-foreground">{active.phone}</p>
              </div>
            </div>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Besök</dt>
                <dd className="text-forest">{active.visits}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Livstidsvärde</dt>
                <dd className="text-forest">{active.spend.toLocaleString("sv-SE")} kr</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Snitt per besök</dt>
                <dd className="text-forest">
                  {Math.round(active.spend / active.visits).toLocaleString("sv-SE")} kr
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Senaste besök</dt>
                <dd className="text-forest">{active.last}</dd>
              </div>
            </dl>
            <p className="mt-5 text-caption text-muted-foreground">Preferenser</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {active.tags.map((t) => (
                <span key={t} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-5 rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
              Seytro föreslår: skicka personlig inbjudan till höstens meny — gästen bokar oftast
              torsdagar.
            </p>
          </aside>
        )}
      </div>
    </div>
  );
}
