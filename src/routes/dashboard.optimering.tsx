import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { publishLive } from "@/lib/live-events";
import { CheckCircle2, Lock, RefreshCw, Wand2 } from "lucide-react";

import { useVenue } from "@/components/dashboard/DashboardShell";
import { suggestMoves, unplacedWithOptions } from "@/lib/booking-ai";

export const Route = createFileRoute("/dashboard/optimering")({
  head: () => ({
    meta: [
      { title: "Optimering — Seytro Dashboard" },
      { name: "description", content: "AI föreslår omplaceringar som frigör fler täckningar." },
      { property: "og:title", content: "Optimering — Seytro Dashboard" },
      { property: "og:description", content: "AI föreslår omplaceringar som frigör fler täckningar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OptimizePage,
});

function OptimizePage() {
  const { serviceBookings, data } = useVenue();
  const [accepted, setAccepted] = useState<string[]>([]);

  const moves = useMemo(
    () => suggestMoves(serviceBookings, data.units),
    [serviceBookings, data.units],
  );
  const pending = moves.filter((m) => !accepted.includes(m.id));
  const unplaced = useMemo(
    () => unplacedWithOptions(serviceBookings, data.units),
    [serviceBookings, data.units],
  );

  const seatsNow = serviceBookings
    .filter((b) => b.placed && b.status !== "avbokad")
    .reduce((s, b) => s + b.party, 0);
  const gain = pending.reduce((s, m) => s + m.gain, 0);
  const locked = serviceBookings.filter((b) => b.lockedTable).length;

  const cards = [
    { label: "Placerade täckningar nu", value: String(seatsNow) },
    { label: "Efter föreslagna flyttar", value: String(seatsNow + gain) },
    { label: "Extra täckningar som frigörs", value: `+${gain}` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display text-forest">Optimering</h1>
          <p className="text-body text-muted-foreground">
            AI räknar om rummet och föreslår flyttar. {locked} bord är låsta och rörs aldrig.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setAccepted([]);
            toast.success("Rummet omräknat");
          }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-forest"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Räkna om
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <p className="text-3xl text-forest">{c.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>

      {pending.length === 0 ? (
        <div className="grid place-items-center gap-2 rounded-2xl border border-border bg-card py-20 text-center">
          <CheckCircle2 className="h-8 w-8 text-status-free-fg" />
          <p className="text-lg text-forest">Rummet är redan optimalt</p>
          <p className="text-sm text-muted-foreground">
            Inga flyttar skulle frigöra fler täckningar just nu.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
            <p className="flex items-center gap-2 text-sm text-forest">
              <Wand2 className="h-4 w-4 text-muted-foreground" />
              {pending.length} föreslagna flyttar
            </p>
            <button
              type="button"
              onClick={() => {
                setAccepted(moves.map((m) => m.id));
                for (const m of moves) {
                  publishLive({
                    kind: "flytt",
                    venue,
                    auto: true,
                    title: "Placering flyttad",
                    detail: `${m.guest} · bord ${m.from} → ${m.to} kl ${m.time}`,
                    payload: { name: m.guest, unit: m.to },
                  });
                }
                toast.success("Alla flyttar accepterade");
              }}
              className="rounded-full bg-primary px-4 py-1.5 text-sm text-primary-foreground"
            >
              Acceptera alla
            </button>
          </div>
          {pending.map((m) => (
            <div
              key={m.id}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-5 py-4 last:border-0"
            >
              <div className="min-w-0">
                <p className="text-forest">
                  {m.guest} <span className="text-sm text-muted-foreground">· {m.party} pers · {m.time}</span>
                </p>
                <p className="text-xs text-muted-foreground">{m.reason}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                  Bord {m.from} → {m.to}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setAccepted((a) => [...a, m.id]);
                    publishLive({
                      kind: "flytt",
                      venue,
                      auto: true,
                      title: "Placering flyttad",
                      detail: `${m.guest} · bord ${m.from} → ${m.to} kl ${m.time}`,
                      payload: { name: m.guest, unit: m.to },
                    });
                    toast.success(`${m.guest} flyttad till bord ${m.to}`);
                  }}
                  className="rounded-full bg-primary px-3.5 py-1.5 text-xs text-primary-foreground"
                >
                  Acceptera
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {unplaced.length > 0 && (
        <div className="rounded-2xl border border-border bg-card">
          <p className="border-b border-border px-5 py-4 text-sm text-forest">
            {unplaced.length} sällskap väntar på placering
          </p>
          {unplaced.map(({ booking, options }) => (
            <div
              key={booking.id}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-5 py-4 last:border-0"
            >
              <div>
                <p className="text-forest">
                  {booking.name}{" "}
                  <span className="text-sm text-muted-foreground">
                    · {booking.party} pers · {booking.time}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {options.length > 0
                    ? `AI föreslår bord ${options.map((o) => o.label).join(", ")}`
                    : "Inget bord räcker — dela sällskapet eller erbjud annan tid"}
                </p>
              </div>
              {booking.lockedTable && (
                <span className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" /> Låst
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
