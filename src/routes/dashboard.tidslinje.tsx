import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus, Users } from "lucide-react";

import { useVenue } from "@/components/dashboard/DashboardShell";
import { serviceOf, type Booking } from "@/lib/dashboard-data";

export const Route = createFileRoute("/dashboard/tidslinje")({
  head: () => ({
    meta: [
      { title: "Tidslinje — Seytro Dashboard" },
      { name: "description", content: "Bord och sittningar över dagen i en tidslinje." },
      { property: "og:title", content: "Tidslinje — Seytro Dashboard" },
      { property: "og:description", content: "Bord och sittningar över dagen i en tidslinje." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TimelinePage,
});

const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));

const spans = {
  hela: { from: 11 * 60, to: 23 * 60 + 30 },
  lunch: { from: 11 * 60, to: 15 * 60 },
  middag: { from: 17 * 60, to: 23 * 60 + 30 },
} as const;

function TimelinePage() {
  const { data, venue } = useVenue();
  const navigate = useNavigate();
  const [span, setSpan] = useState<keyof typeof spans>("hela");
  const [zone, setZone] = useState("alla");
  const [query, setQuery] = useState("");
  const [zoom, setZoom] = useState(2.6);

  const zones = useMemo(
    () => ["alla", ...Array.from(new Set(data.units.map((u) => u.zone)))],
    [data.units],
  );
  const units = data.units.filter((u) => zone === "alla" || u.zone === zone);
  const { from, to } = spans[span];
  const width = ((to - from) / 60) * 60 * zoom;

  const hours = Array.from({ length: Math.ceil((to - from) / 60) + 1 }, (_, i) =>
    Math.floor(from / 60) + i,
  );

  const bookingsFor = (label: string): Booking[] =>
    data.bookings.filter(
      (b) =>
        b.table === label &&
        b.status !== "avbokad" &&
        (query ? b.name.toLowerCase().includes(query.toLowerCase()) : true) &&
        (venue === "hotell" || span === "hela" || serviceOf(b.time) === span),
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display text-forest">Tidslinje</h1>
          <p className="text-body text-muted-foreground">
            Se hela dagen bord för bord och hitta luckor direkt.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard/vantelista" })}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-forest"
          >
            <Users className="h-3.5 w-3.5" /> Väntelista
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard/salsplan", search: { new: true } })}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" /> Ny bokning
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {venue === "restaurang" && (
          <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-soft">
            {(["hela", "lunch", "middag"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpan(s)}
                className={`rounded-full px-3 py-1 text-sm capitalize transition-colors ${
                  span === s ? "bg-accent text-forest" : "text-muted-foreground"
                }`}
              >
                {s === "hela" ? "Hela dagen" : s}
              </button>
            ))}
          </div>
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
          placeholder="Sök gäst"
          className="w-48 rounded-full border border-border bg-card px-4 py-1.5 text-sm outline-none focus:border-primary"
        />
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          Zoom
          <input
            type="range"
            min={1.4}
            max={4.5}
            step={0.2}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <div style={{ width: width + 96 }} className="min-w-full">
          <div className="flex border-b border-border bg-muted/40">
            <div className="w-24 shrink-0 px-4 py-2 text-xs uppercase tracking-wider text-muted-foreground">
              {venue === "hotell" ? "Rum" : "Bord"}
            </div>
            <div className="relative flex-1" style={{ height: 32 }}>
              {hours.map((h) => (
                <span
                  key={h}
                  className="absolute top-1.5 text-[11px] text-muted-foreground"
                  style={{ left: ((h * 60 - from) / 60) * 60 * zoom }}
                >
                  {String(h).padStart(2, "0")}:00
                </span>
              ))}
            </div>
          </div>

          {units.map((u) => (
            <div key={u.id} className="flex border-b border-border/60 last:border-0">
              <div className="w-24 shrink-0 px-4 py-3">
                <span className="block text-sm text-forest">{u.label}</span>
                <span className="block text-[11px] text-muted-foreground">{u.seats} pl</span>
              </div>
              <div className="relative flex-1" style={{ height: 52 }}>
                {hours.map((h) => (
                  <span
                    key={h}
                    className="absolute top-0 bottom-0 border-l border-border/50"
                    style={{ left: ((h * 60 - from) / 60) * 60 * zoom }}
                  />
                ))}
                {bookingsFor(u.label).map((b) => {
                  const start = toMin(b.time);
                  const end = b.end ? toMin(b.end) : start + 120;
                  const left = ((start - from) / 60) * 60 * zoom;
                  const w = Math.max(((end - start) / 60) * 60 * zoom, 44);
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => navigate({ to: "/dashboard/salsplan", search: { q: b.name } })}
                      title={`${b.name} · ${b.party} pers · ${b.time}–${b.end ?? ""}`}
                      className={`absolute top-2 h-9 overflow-hidden rounded-lg border px-2 text-left text-[11px] transition-shadow hover:shadow-soft ${
                        b.status === "anlänt"
                          ? "border-status-free-border bg-status-free text-status-free-fg"
                          : b.status === "väntar"
                            ? "border-status-clean-border bg-status-clean text-status-clean-fg"
                            : "border-status-set-border bg-status-set text-status-set-fg"
                      }`}
                      style={{ left, width: w }}
                    >
                      <span className="block truncate leading-4">{b.name}</span>
                      <span className="block truncate leading-4 opacity-70">
                        {b.time} · {b.party} pers
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
