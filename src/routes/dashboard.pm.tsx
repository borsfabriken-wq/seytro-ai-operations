import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, ClipboardList, Users } from "lucide-react";
import { useVenue } from "@/components/dashboard/DashboardShell";
import { statusStyles, type Booking } from "@/lib/dashboard-data";

export const Route = createFileRoute("/dashboard/pm")({
  head: () => ({
    meta: [
      { title: "Kommande PM och sällskap — Seytro Dashboard" },
      {
        name: "description",
        content: "Kommande dagars PM-noteringar och stora sällskap samlade på ett ställe.",
      },
      { property: "og:title", content: "Kommande PM och sällskap — Seytro Dashboard" },
      {
        property: "og:description",
        content: "Kommande dagars PM-noteringar och stora sällskap samlade på ett ställe.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: UpcomingPmPage,
});

const RANGES = [7, 14, 30] as const;

function addDays(base: Date, days: number) {
  const d = new Date(base.getFullYear(), base.getMonth(), base.getDate());
  d.setDate(d.getDate() + days);
  return d;
}

function dayKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/** Deterministiskt urval per dag så vyn ser stabil ut mellan renderingar. */
function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function labelFor(date: Date, today: Date) {
  const diff = Math.round((date.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return "Idag";
  if (diff === 1) return "Imorgon";
  return date.toLocaleDateString("sv-SE", { weekday: "long" });
}

function UpcomingPmPage() {
  const { data, venue, date } = useVenue();
  const unitWord = venue === "hotell" ? "Rum" : "Bord";
  const [range, setRange] = useState<(typeof RANGES)[number]>(14);
  const [onlyUnplaced, setOnlyUnplaced] = useState(false);

  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const days = useMemo(() => {
    const pool = data.bookings.filter(
      (b) => b.status !== "avbokad" && (b.party >= 8 || Boolean(b.note)),
    );
    return Array.from({ length: range }, (_, i) => {
      const d = addDays(today, i);
      const seed = hash(`${venue}-${dayKey(d)}`);
      const items = pool.filter((b, idx) => (seed >> idx % 24) % 3 === 0 || (i === 0 && idx < 2));
      return { date: d, items: [...items].sort((a, b) => a.time.localeCompare(b.time)) };
    }).filter((d) => d.items.length > 0);
  }, [data.bookings, range, today.getTime(), venue]);

  const visible = days
    .map((d) => ({ ...d, items: onlyUnplaced ? d.items.filter((b) => !b.placed) : d.items }))
    .filter((d) => d.items.length > 0);

  const total = visible.reduce((sum, d) => sum + d.items.length, 0);
  const guests = visible.reduce(
    (sum, d) => sum + d.items.reduce((s, b) => s + b.party, 0),
    0,
  );

  return (
    <div className="mx-auto max-w-[80rem] space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-heading text-forest">Kommande PM och stora sällskap</h1>
            <p className="text-caption text-muted-foreground">
              {total} bokningar · {guests} gäster de kommande {range} dagarna
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                  range === r
                    ? "bg-forest text-primary-foreground"
                    : "border border-border text-muted-foreground hover:text-forest"
                }`}
              >
                {r} dagar
              </button>
            ))}
            <button
              type="button"
              onClick={() => setOnlyUnplaced((v) => !v)}
              className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                onlyUnplaced
                  ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                  : "border border-border text-muted-foreground hover:text-forest"
              }`}
            >
              Endast ej placerade
            </button>
          </div>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
          Inga PM eller stora sällskap inbokade i perioden.
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((day) => (
            <section key={dayKey(day.date)} className="rounded-2xl border border-border bg-card">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-semibold capitalize text-forest">
                    {labelFor(day.date, today)}
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    {day.date.toLocaleDateString("sv-SE", { day: "numeric", month: "long" })}
                  </span>
                </div>
                <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                  {day.items.length} st · {day.items.reduce((s, b) => s + b.party, 0)} gäster
                </span>
              </div>
              <ul className="divide-y divide-border/60">
                {day.items.map((b) => (
                  <PmRow key={`${dayKey(day.date)}-${b.id}`} booking={b} unitWord={unitWord} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function PmRow({ booking, unitWord }: { booking: Booking; unitWord: string }) {
  return (
    <li className="px-5 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="w-12 text-sm font-medium text-forest">{booking.time}</span>
          <span className="text-sm text-forest">{booking.name}</span>
          {booking.party >= 8 && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary">
              Stort sällskap
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {booking.party}
          </span>
          <span>{booking.table ? `${unitWord} ${booking.table}` : "Ej placerad"}</span>
          <span className={`rounded-full px-2 py-0.5 ${statusStyles[booking.status]}`}>
            {booking.status}
          </span>
        </div>
      </div>
      {booking.note && (
        <p className="mt-1.5 flex items-start gap-1.5 text-xs text-forest/80">
          <ClipboardList className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          PM: {booking.note}
        </p>
      )}
      {booking.tags.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {booking.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </li>
  );
}
