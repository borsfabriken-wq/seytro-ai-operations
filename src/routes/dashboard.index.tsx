import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useVenue } from "@/components/dashboard/DashboardShell";
import { statusStyles, type BookingStatus } from "@/lib/dashboard-data";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Bokningsöversikt — Seytro Dashboard" },
      { name: "description", content: "Dagens bokningar, tidslinje och status i realtid." },
      { property: "og:title", content: "Bokningsöversikt — Seytro Dashboard" },
      { property: "og:description", content: "Dagens bokningar, tidslinje och status i realtid." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OverviewPage,
});

const days = ["Mån", "Tis", "Ons", "Tors", "Fre", "Lör", "Sön"];
const dates = [10, 11, 12, 13, 14, 15, 16];
const filters: (BookingStatus | "alla")[] = ["alla", "bekräftad", "väntar", "anlänt", "avbokad"];

function OverviewPage() {
  const { data, venue } = useVenue();
  const [selectedDay, setSelectedDay] = useState(3);
  const [filter, setFilter] = useState<BookingStatus | "alla">("alla");
  const [query, setQuery] = useState("");

  const bookings = data.bookings.filter(
    (b) =>
      (filter === "alla" || b.status === filter) &&
      b.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-[96rem] space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-caption text-muted-foreground">{kpi.label}</p>
            <p className="mt-2 text-3xl font-medium text-forest">{kpi.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              <span className="text-primary">{kpi.delta}</span> {kpi.hint}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="rounded-2xl border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
            <div>
              <h1 className="text-heading text-forest">Bokningar</h1>
              <p className="text-caption text-muted-foreground">
                {bookings.length} av {data.bookings.length} visas
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Sök namn"
                className="rounded-full border border-border bg-background px-3 py-1.5 text-sm outline-none"
              />
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-3 py-1.5 text-xs capitalize transition-colors ${
                    filter === f
                      ? "bg-forest text-primary-foreground"
                      : "border border-border text-muted-foreground hover:text-forest"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[46rem] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-normal">Tid</th>
                  <th className="px-5 py-3 font-normal">Gäst</th>
                  <th className="px-5 py-3 font-normal">
                    {venue === "hotell" ? "Nätter" : "Sällskap"}
                  </th>
                  <th className="px-5 py-3 font-normal">
                    {venue === "hotell" ? "Rum" : "Bord"}
                  </th>
                  <th className="px-5 py-3 font-normal">Källa</th>
                  <th className="px-5 py-3 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-border/60 last:border-0">
                    <td className="whitespace-nowrap px-5 py-3 font-medium text-forest">{b.time}</td>
                    <td className="px-5 py-3">
                      <span className="block text-forest">{b.name}</span>
                      {b.note && (
                        <span className="block text-xs text-muted-foreground">{b.note}</span>
                      )}
                      {b.tags.length > 0 && (
                        <span className="mt-1 flex flex-wrap gap-1">
                          {b.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                            >
                              {t}
                            </span>
                          ))}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {venue === "hotell" ? `${b.nights ?? 1} nätter` : `${b.party} pers`}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{b.table}</td>
                    <td className="px-5 py-3 text-muted-foreground">{b.source}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs ${statusStyles[b.status]}`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                      Inga bokningar matchar filtret.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-subheading text-forest">Augusti 2026</h2>
            <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
              {days.map((d) => (
                <span key={d}>{d}</span>
              ))}
              {dates.map((d, i) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDay(i)}
                  className={`mt-2 aspect-square rounded-lg text-sm transition-colors ${
                    selectedDay === i
                      ? "bg-forest text-primary-foreground"
                      : "bg-muted/60 text-forest hover:bg-muted"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              {data.occupancy.map((o, i) => (
                <div key={o.label} className="flex items-center gap-3">
                  <span className="w-9 text-xs text-muted-foreground">{o.label}</span>
                  <div className="h-1.5 flex-1 rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${i === selectedDay ? "bg-forest" : "bg-primary/40"}`}
                      style={{ width: `${o.value}%` }}
                    />
                  </div>
                  <span className="w-9 text-right text-xs text-muted-foreground">{o.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-subheading text-forest">AI-agenterna idag</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {data.messages.slice(0, 3).map((m) => (
                <li key={m.id} className="rounded-xl bg-muted/50 p-3">
                  <p className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{m.channel}</span>
                    <span>{m.time}</span>
                  </p>
                  <p className="mt-1 text-forest">{m.preview}</p>
                  <p className="mt-1 text-xs text-primary">
                    {m.handled ? "Hanterat av Seytro" : "Väntar på er"}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
