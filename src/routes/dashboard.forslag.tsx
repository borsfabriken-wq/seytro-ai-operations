import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Lightbulb,
  MapPin,
  RefreshCw,
  Users2,
} from "lucide-react";

import { useVenue } from "@/components/dashboard/DashboardShell";
import { publishLive } from "@/lib/live-events";
import {
  bestTables,
  betterTimes,
  detectConflicts,
  staffingPeak,
  staffingPlan,
} from "@/lib/capacity-ai";

export const Route = createFileRoute("/dashboard/forslag")({
  head: () => ({
    meta: [
      { title: "AI-förslag — Seytro Dashboard" },
      {
        name: "description",
        content:
          "AI upptäcker kapacitetskonflikter och föreslår bästa bord, zon, tid och bemanning för varje bokning.",
      },
      { property: "og:title", content: "AI-förslag — Seytro Dashboard" },
      {
        property: "og:description",
        content: "Kapacitetskonflikter, bordsförslag och bemanningsplan i realtid.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SuggestionsPage,
});

function SuggestionsPage() {
  const { serviceBookings, data, venue } = useVenue();
  const [resolved, setResolved] = useState<string[]>([]);
  const [applied, setApplied] = useState<string[]>([]);
  const [nonce, setNonce] = useState(0);

  const units = data.units;
  const unit = data.unitWord ?? "bord";
  const Unit = unit.charAt(0).toUpperCase() + unit.slice(1);
  const swap = (text: string) =>
    unit === "bord" ? text : text.replace(/Bord /g, `${Unit} `).replace(/bord /g, `${unit} `);

  const conflicts = useMemo(
    () => detectConflicts(serviceBookings, units).filter((c) => !resolved.includes(c.id)),
    [serviceBookings, units, resolved],
  );

  const perBooking = useMemo(
    () =>
      serviceBookings
        .filter((b) => b.status !== "avbokad" && b.status !== "anlänt")
        .sort((a, b) => a.time.localeCompare(b.time))
        .map((booking) => ({
          booking,
          tables: bestTables(booking, serviceBookings, units),
          times: betterTimes(booking, serviceBookings, units),
        }))
        .filter((row) => row.tables.length > 0 || row.times.length > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [serviceBookings, units, nonce],
  );

  const staffing = useMemo(() => staffingPlan(serviceBookings), [serviceBookings]);
  const peak = staffingPeak(staffing);

  const cards = [
    { label: "Kapacitetskonflikter", value: String(conflicts.length) },
    { label: `Bokningar med ${unit}sförslag`, value: String(perBooking.length) },
    {
      label: "Topptimme",
      value: peak ? `${peak.time} · ${peak.covers} gäster` : "—",
    },
    {
      label: "Servis vid topp",
      value: peak ? `${peak.servers} i servis · ${peak.kitchen} i kök` : "—",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display text-forest">AI-förslag</h1>
          <p className="text-body text-muted-foreground">
            AI läser hela passet, hittar krockar och föreslår {unit}, zon, tid och bemanning.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setResolved([]);
            setApplied([]);
            setNonce((n) => n + 1);
            toast.success("Förslagen omräknade");
          }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-forest"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Räkna om
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <p className="text-2xl tabular-nums text-forest">{c.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Konflikter */}
      <section className="rounded-2xl border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-forest">Kapacitetskonflikter</p>
        </div>
        {conflicts.length === 0 ? (
          <div className="grid place-items-center gap-2 py-14 text-center">
            <CheckCircle2 className="h-7 w-7 text-status-free-fg" />
            <p className="text-forest">Inga konflikter i passet</p>
            <p className="text-sm text-muted-foreground">
              Alla sällskap har plats i rätt zon vid önskad tid.
            </p>
          </div>
        ) : (
          conflicts.map((c) => (
            <div
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-5 py-4 last:border-0"
            >
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 text-forest">
                  {swap(c.title)}
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[11px] ${
                      c.severity === "hög"
                        ? "border-status-alert-border bg-status-alert text-status-alert-fg"
                        : "border-status-clean-border bg-status-clean text-status-clean-fg"
                    }`}
                  >
                    {c.kind}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">{swap(c.detail)}</p>
              </div>
              <div className="flex items-center gap-2">
                {c.fix && (
                  <button
                    type="button"
                    onClick={() => {
                      setResolved((r) => [...r, c.id]);
                      publishLive({
                        kind: "flytt",
                        venue,
                        auto: true,
                        title: "Konflikt löst av AI",
                        detail: c.fix?.label ?? c.title,
                        ...(c.fix?.table ? { payload: { unit: c.fix.table } } : {}),
                      });
                      toast.success(c.fix?.label ?? "Konflikt löst");
                    }}
                    className="rounded-full bg-primary px-3.5 py-1.5 text-xs text-primary-foreground"
                  >
                    {swap(c.fix.label)}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setResolved((r) => [...r, c.id])}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-forest"
                >
                  Avfärda
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Förslag per bokning */}
      <section className="rounded-2xl border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <Lightbulb className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-forest">Bästa {unit}, zon och tid per bokning</p>
        </div>
        {perBooking.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">
            Inga aktiva bokningar i passet.
          </p>
        ) : (
          perBooking.map(({ booking, tables, times }) => (
            <div key={booking.id} className="border-b border-border/60 px-5 py-4 last:border-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-forest">
                  {booking.name}{" "}
                  <span className="text-sm text-muted-foreground">
                    · {booking.party} pers · {booking.time}
                    {booking.table ? ` · ${unit} ${booking.table}` : " · ej placerad"}
                  </span>
                </p>
                {booking.lockedTable && (
                  <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                    Låst bord
                  </span>
                )}
              </div>

              {tables.length > 0 && (
                <div className="mt-3 grid gap-2 md:grid-cols-3">
                  {tables.map((t, i) => {
                    const key = `${booking.id}-${t.table.id}`;
                    const isApplied = applied.includes(key);
                    return (
                      <button
                        key={key}
                        type="button"
                        disabled={isApplied || booking.lockedTable}
                        onClick={() => {
                          setApplied((a) => [...a, key]);
                          publishLive({
                            kind: "flytt",
                            venue,
                            auto: true,
                            title: "AI-placering accepterad",
                            detail: `${booking.name} · bord ${t.table.label} (${t.table.zone}) kl ${booking.time}`,
                            payload: { name: booking.name, unit: t.table.label },
                          });
                          toast.success(`${booking.name} placerad på ${unit} ${t.table.label}`);
                        }}
                        className={`rounded-xl border p-3 text-left transition-colors disabled:opacity-60 ${
                          i === 0
                            ? "border-primary/40 bg-primary/5"
                            : "border-border bg-surface-1 hover:border-primary/30"
                        }`}
                      >
                        <p className="flex items-center justify-between text-sm text-forest">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            {Unit} {t.table.label}
                          </span>
                          <span className="tabular-nums text-xs text-muted-foreground">
                            {t.score} p
                          </span>
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {t.table.zone} · {t.table.seats} platser
                        </p>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {isApplied ? "Placerad" : t.reasons.join(" · ")}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}

              {times.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock3 className="h-3.5 w-3.5" /> Bättre tider:
                  </span>
                  {times.map((t) => (
                    <button
                      key={t.time}
                      type="button"
                      onClick={() =>
                        toast.success(`Förslag skickat till ${booking.name}: kl ${t.time}`)
                      }
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-forest"
                    >
                      {t.time} · {t.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </section>

      {/* Bemanning */}
      <section className="rounded-2xl border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <Users2 className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-forest">Bemanningsförslag per timme</p>
        </div>
        {staffing.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">
            Ingen bemanning att planera för passet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-5 py-2 font-normal">Timme</th>
                  <th className="px-5 py-2 font-normal">Gäster</th>
                  <th className="px-5 py-2 font-normal">Ankomster</th>
                  <th className="px-5 py-2 font-normal">Servis</th>
                  <th className="px-5 py-2 font-normal">Kök</th>
                  <th className="px-5 py-2 font-normal">Värd</th>
                  <th className="px-5 py-2 font-normal">AI-not</th>
                </tr>
              </thead>
              <tbody>
                {staffing.map((s) => (
                  <tr key={s.time} className="border-b border-border/60 last:border-0">
                    <td className="px-5 py-2.5 tabular-nums text-forest">{s.time}</td>
                    <td className="px-5 py-2.5 tabular-nums text-muted-foreground">{s.covers}</td>
                    <td className="px-5 py-2.5 tabular-nums text-muted-foreground">{s.arrivals}</td>
                    <td className="px-5 py-2.5 tabular-nums text-forest">{s.servers}</td>
                    <td className="px-5 py-2.5 tabular-nums text-forest">{s.kitchen}</td>
                    <td className="px-5 py-2.5 tabular-nums text-forest">{s.host}</td>
                    <td className="px-5 py-2.5 text-xs text-muted-foreground">{s.note ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
