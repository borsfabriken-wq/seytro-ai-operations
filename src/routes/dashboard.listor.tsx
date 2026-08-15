import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { useVenue } from "@/components/dashboard/DashboardShell";
import { serviceOf, statusStyles, type BookingStatus } from "@/lib/dashboard-data";
import { assessRisk, riskStyles } from "@/lib/booking-ai";

export const Route = createFileRoute("/dashboard/listor")({
  head: () => ({
    meta: [
      { title: "Listor — Seytro Dashboard" },
      { name: "description", content: "Alla bokningar i tabellform med filter och status." },
      { property: "og:title", content: "Listor — Seytro Dashboard" },
      { property: "og:description", content: "Alla bokningar i tabellform med filter och status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ListsPage,
});

const statuses: (BookingStatus | "alla")[] = ["alla", "bekräftad", "väntar", "anlänt", "avbokad"];

function ListsPage() {
  const { data, venue } = useVenue();
  const [status, setStatus] = useState<BookingStatus | "alla">("alla");
  const [service, setService] = useState<"alla" | "lunch" | "middag">("alla");
  const [zone, setZone] = useState("alla");
  const [query, setQuery] = useState("");

  const zones = useMemo(
    () => ["alla", ...Array.from(new Set(data.units.map((u) => u.zone)))],
    [data.units],
  );
  const zoneOfTable = useMemo(() => {
    const map = new Map<string, string>();
    data.units.forEach((u) => map.set(u.label, u.zone));
    return map;
  }, [data.units]);

  const rows = data.bookings.filter((b) => {
    if (status !== "alla" && b.status !== status) return false;
    if (venue === "restaurang" && service !== "alla" && serviceOf(b.time) !== service) return false;
    if (zone !== "alla" && zoneOfTable.get(b.table) !== zone) return false;
    if (query && !(b.name + b.id).toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });
  const covers = rows.filter((b) => b.status !== "avbokad").reduce((s, b) => s + b.party, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-display text-forest">Listor</h1>
        <p className="text-body text-muted-foreground">
          Alla bokningar för dagen — filtrera, sök och öppna.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-soft">
          {statuses.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`rounded-full px-3 py-1 text-sm capitalize transition-colors ${
                status === s ? "bg-accent text-forest" : "text-muted-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {venue === "restaurang" && (
          <select
            value={service}
            onChange={(e) => setService(e.target.value as typeof service)}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-sm outline-none"
          >
            <option value="alla">Alla pass</option>
            <option value="lunch">Lunch</option>
            <option value="middag">Middag</option>
          </select>
        )}
        <select
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          className="rounded-full border border-border bg-card px-3 py-1.5 text-sm outline-none"
        >
          {zones.map((z) => (
            <option key={z} value={z}>
              {z === "alla" ? "Alla zoner" : z}
            </option>
          ))}
        </select>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Sök gäst eller referens"
          className="w-56 rounded-full border border-border bg-card px-4 py-1.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[52rem] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 font-normal">Tid</th>
              <th className="px-5 py-3 font-normal">Gäst</th>
              <th className="px-5 py-3 font-normal">Sällskap</th>
              <th className="px-5 py-3 font-normal">{venue === "hotell" ? "Rum" : "Bord"}</th>
              <th className="px-5 py-3 font-normal">Kanal</th>
              <th className="px-5 py-3 font-normal">No-show-risk</th>
              <th className="px-5 py-3 font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => {
              const risk = assessRisk(b);
              return (
                <tr key={b.id} className="border-b border-border/60 last:border-0 hover:bg-muted/50">
                  <td className="px-5 py-3 text-forest">{b.time}</td>
                  <td className="px-5 py-3">
                    <span className="block text-forest">{b.name}</span>
                    <span className="block text-[11px] text-muted-foreground">#{b.id}</span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{b.party}</td>
                  <td className="px-5 py-3 text-muted-foreground">{b.table || "—"}</td>
                  <td className="px-5 py-3 text-muted-foreground">{b.source}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[11px] ${riskStyles[risk.level]}`}
                      title={risk.reasons.join(" · ")}
                    >
                      {risk.level}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] ${statusStyles[b.status]}`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">
            Inga bokningar matchar filtret.
          </p>
        )}
        <div className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
          {rows.length} bokningar · {covers} täckningar
        </div>
      </div>
    </div>
  );
}
