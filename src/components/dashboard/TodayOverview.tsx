import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  CalendarClock,
  ChevronRight,
  Clock,
  Lightbulb,
  MessageSquare,
  Sparkles,
  UserX,
  Users,
} from "lucide-react";
import { useVenue } from "@/components/dashboard/DashboardShell";
import { serviceOf, servicePeriods } from "@/lib/dashboard-data";

const quickDays = [
  { label: "Idag", offset: 0 },
  { label: "Imorgon", offset: 1 },
  { label: "Om 2 dagar", offset: 2 },
  { label: "Om 3 dagar", offset: 3 },
  { label: "Om en vecka", offset: 7 },
];


function greetingFor(h: number) {
  if (h < 10) return "God morgon";
  if (h < 17) return "God eftermiddag";
  return "God kväll";
}

export function TodayOverview() {
  const [greeting, setGreeting] = useState("God dag");
  useEffect(() => setGreeting(greetingFor(new Date().getHours())), []);

  const { data, venue, date, setDate, service, setService, serviceBookings } = useVenue();

  const today = new Date();
  const baseline = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

  const pending = serviceBookings.filter((b) => b.status === "väntar");
  const special = serviceBookings.filter((b) => b.note || b.tags.length > 0).slice(0, 4);
  const covers = data.bookings.reduce((sum, b) => sum + b.party, 0);
  const unhandled = data.messages.filter((m) => !m.handled).length;

  const serviceReport = servicePeriods.map((p) => {
    const rows = data.bookings.filter(
      (b) => serviceOf(b.time) === p.id && b.status !== "avbokad",
    );
    return { ...p, covers: rows.reduce((s, b) => s + b.party, 0), bookings: rows.length };
  });

  const withData = data.bookings.filter((b) => b.phone || b.email).length;
  const dataShare = Math.round((withData / Math.max(1, data.bookings.length)) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-heading text-forest">
            {greeting}, {data.label}
          </h1>
          <p className="mt-1 text-caption capitalize text-muted-foreground">
            {date.toLocaleDateString("sv-SE", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {quickDays.map((q) => {
            const target = new Date(baseline);
            target.setDate(target.getDate() + q.offset);
            const active = dayKey(target) === dayKey(date);
            return (
              <button
                key={q.label}
                type="button"
                onClick={() => setDate(target)}
                className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-forest text-primary-foreground"
                    : "border border-border text-muted-foreground hover:text-forest"
                }`}
              >
                {q.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-muted/40 px-5 py-3">
        <Lightbulb className="h-4 w-4 text-primary" />
        <p className="text-sm text-muted-foreground">
          Dagens tips:{" "}
          <span className="font-medium text-forest">
            {venue === "hotell"
              ? "Fyll lediga rum med sena incheckningar via e-postconciergen"
              : "Fyll tomma bord genom att låta röstagenten ringa upp väntelistan"}
          </span>
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Bokningsförfrågningar */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarClock className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-base font-medium text-forest">Bokningsförfrågningar</h2>
                <p className="text-caption text-muted-foreground">Inväntar bekräftelse</p>
              </div>
            </div>
            <span className="rounded-full bg-primary px-2.5 py-1 text-xs text-primary-foreground">
              {pending.length}
            </span>
          </div>

          <ul className="mt-4 space-y-3">
            {pending.slice(0, 3).map((b) => (
              <li key={b.id} className="rounded-xl bg-muted/50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-forest">{b.name}</p>
                  <Link
                    to="/dashboard/salsplan"
                    className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground"
                  >
                    Visa förfrågan
                  </Link>
                </div>
                <p className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {b.time}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3 w-3" />{" "}
                    {venue === "hotell" ? `${b.nights ?? 1} nätter` : `${b.party} gäster`}
                  </span>
                  <span>{b.source}</span>
                </p>
              </li>
            ))}
            {pending.length === 0 && (
              <li className="rounded-xl bg-muted/50 p-3 text-sm text-muted-foreground">
                Inga obesvarade förfrågningar — agenterna har hanterat allt.
              </li>
            )}
          </ul>
        </div>

        {/* Specialgäster */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-medium text-forest">Specialgäster</h2>
              <p className="text-caption text-muted-foreground">Gäster med extra information</p>
            </div>
            <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
              {special.length} noteringar
            </span>
          </div>

          <ul className="mt-4 space-y-3">
            {special.map((b) => (
              <li key={b.id} className="rounded-xl border border-border p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-forest">{b.name}</p>
                  <span className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {b.time}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3 w-3" /> {b.party}
                    </span>
                  </span>
                </div>
                <p className="mt-1 flex items-start gap-1.5 text-xs text-muted-foreground">
                  <AlertTriangle className="mt-0.5 h-3 w-3 text-primary" />
                  {b.note ?? b.tags.join(" · ")}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Dagsrapport + gårdagen */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-forest">Dagsrapport</h2>
              <Link
                to="/dashboard/analys"
                className="inline-flex items-center gap-1 text-xs text-primary"
              >
                Hela rapporten <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {serviceReport.map((s) => {
                const active = venue === "restaurang" && service === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setService(s.id)}
                    className={`rounded-xl border p-3 text-center transition-colors ${
                      active ? "border-primary bg-primary/8" : "border-transparent bg-muted/50"
                    }`}
                  >
                    <p className="text-sm font-medium text-forest">{s.label}</p>
                    <p className="text-[11px] text-muted-foreground">{s.span}</p>
                    <p className="mt-2 text-lg font-medium text-forest">{s.covers}</p>
                    <p className="text-[11px] text-muted-foreground">
                      gäster · {s.bookings} bokningar
                    </p>
                  </button>
                );
              })}
            </div>
            <div className="mt-3 rounded-xl bg-muted/50 p-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Gästdata insamlad (telefon eller e-post)</span>
                <span className="font-medium text-forest">{dataShare}%</span>
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-border">
                <div className="h-full rounded-full bg-primary" style={{ width: `${dataShare}%` }} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-base font-medium text-forest">Gårdagens sammanfattning</h2>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Users className="h-3 w-3" /> Gäster
                </p>
                <p className="mt-1 text-xl font-medium text-forest">{covers + 233}</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <UserX className="h-3 w-3" /> No-shows
                </p>
                <p className="mt-1 text-xl font-medium text-forest">2</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <MessageSquare className="h-3 w-3" /> Obesvarat
                </p>
                <p className="mt-1 text-xl font-medium text-forest">{unhandled}</p>
              </div>
            </div>
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              Seytro besvarade {data.messages.length - unhandled} av {data.messages.length}{" "}
              konversationer automatiskt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
