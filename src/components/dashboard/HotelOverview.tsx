import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  BedDouble,
  BellRing,
  BrushCleaning,
  CalendarClock,
  ChevronRight,
  Clock,
  Lightbulb,
  LogIn,
  LogOut,
  Mail,
  Megaphone,
  PhoneCall,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";
import { useVenue } from "@/components/dashboard/DashboardShell";
import { hotelFunctions, hotelPromises } from "@/lib/dashboard-data";

const quickDays = [
  { label: "Idag", offset: 0 },
  { label: "Imorgon", offset: 1 },
  { label: "Om 2 dagar", offset: 2 },
  { label: "Om 3 dagar", offset: 3 },
  { label: "Om en vecka", offset: 7 },
];

const functionIcons = {
  voice: PhoneCall,
  mail: Mail,
  room: BedDouble,
  guest: UserRound,
  analytics: BarChart3,
  campaign: Megaphone,
} as const;

function greetingFor(h: number) {
  if (h < 10) return "God morgon";
  if (h < 17) return "God eftermiddag";
  return "God kväll";
}

export function HotelOverview() {
  const [greeting, setGreeting] = useState("God dag");
  useEffect(() => setGreeting(greetingFor(new Date().getHours())), []);

  const { data, date, setDate } = useVenue();

  const baselineNow = new Date();
  const baseline = new Date(
    baselineNow.getFullYear(),
    baselineNow.getMonth(),
    baselineNow.getDate(),
  );
  const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

  const active = data.bookings.filter((b) => b.status !== "avbokad");
  const arrivals = active.filter((b) => b.status !== "anlänt");
  const checkedIn = active.filter((b) => b.status === "anlänt");
  const pending = active.filter((b) => b.status === "väntar");
  const inHouse = data.units.filter((u) => u.status === "upptaget");
  const housekeeping = {
    ledigt: data.units.filter((u) => u.status === "ledigt").length,
    städas: data.units.filter((u) => u.status === "städas").length,
    dukat: data.units.filter((u) => u.status === "dukat").length,
    upptaget: inHouse.length,
  };
  const occupancy = Math.round(
    ((housekeeping.upptaget + housekeeping.dukat) / Math.max(1, data.units.length)) * 100,
  );
  const unhandled = data.messages.filter((m) => !m.handled).length;
  const requests = data.messages.slice(0, 4);

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
            const isActive = dayKey(target) === dayKey(date);
            return (
              <button
                key={q.label}
                type="button"
                onClick={() => setDate(target)}
                className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  isActive
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
            {housekeeping.ledigt} rum är fortfarande lediga — låt e-postconciergen erbjuda dem till
            sena ankomster och gäster på väntelistan.
          </span>
        </p>
      </div>

      {/* Dygnets rytm: ankomster, avresor, inhouse, städ */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat
          icon={LogIn}
          label="Ankomster"
          value={arrivals.length}
          hint={`${arrivals.reduce((s, b) => s + b.party, 0)} gäster väntas checka in`}
        />
        <MiniStat
          icon={LogOut}
          label="Avresor"
          value={housekeeping.städas + 2}
          hint="Utcheckning senast 11:00"
        />
        <MiniStat
          icon={BedDouble}
          label="Beläggning"
          value={`${occupancy}%`}
          hint={`${housekeeping.upptaget + housekeeping.dukat} av ${data.units.length} rum`}
        />
        <MiniStat
          icon={BrushCleaning}
          label="Städ kvar"
          value={housekeeping.städas}
          hint={`${housekeeping.ledigt} rum klara för incheckning`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Ankomster */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarClock className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-base font-medium text-forest">Dagens ankomster</h2>
                <p className="text-caption text-muted-foreground">Rum tilldelas automatiskt</p>
              </div>
            </div>
            <span className="rounded-full bg-primary px-2.5 py-1 text-xs text-primary-foreground">
              {arrivals.length}
            </span>
          </div>

          <ul className="mt-4 space-y-3">
            {arrivals.slice(0, 4).map((b) => (
              <li key={b.id} className="rounded-xl bg-muted/50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-medium text-forest">{b.name}</p>
                  <Link
                    to="/dashboard/salsplan"
                    className="shrink-0 rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground"
                  >
                    {b.table ? "Visa rum" : "Placera"}
                  </Link>
                </div>
                <p className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {b.time}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3 w-3" /> {b.party} gäster · {b.nights ?? 1} nätter
                  </span>
                  <span>{b.table || "Ej tilldelat rum"}</span>
                </p>
              </li>
            ))}
          </ul>
          {pending.length > 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              {pending.length} ankomster inväntar bekräftelse.
            </p>
          )}
        </div>

        {/* Gästförfrågningar */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-medium text-forest">Gästförfrågningar</h2>
              <p className="text-caption text-muted-foreground">Samtal, mejl och SMS dygnet runt</p>
            </div>
            <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
              {unhandled} obesvarade
            </span>
          </div>

          <ul className="mt-4 space-y-3">
            {requests.map((m) => (
              <li key={m.id} className="rounded-xl border border-border p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-medium text-forest">{m.intent}</p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] ${
                      m.handled
                        ? "bg-emerald-500/15 text-emerald-700"
                        : "bg-amber-500/15 text-amber-700"
                    }`}
                  >
                    {m.handled ? "Hanterad av AI" : "Väntar"}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{m.preview}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {m.channel} · {m.from} · {m.time}
                </p>
              </li>
            ))}
          </ul>
          <Link
            to="/dashboard/inkorg"
            className="mt-4 inline-flex items-center gap-1 text-xs text-primary"
          >
            Öppna inkorgen <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Bor på hotellet + housekeeping */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-forest">Bor på hotellet</h2>
              <Link
                to="/dashboard/salsplan"
                className="inline-flex items-center gap-1 text-xs text-primary"
              >
                Rumsöversikt <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <ul className="mt-4 space-y-2">
              {inHouse.slice(0, 4).map((u) => (
                <li
                  key={u.id}
                  className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2 text-sm"
                >
                  <span className="text-forest">
                    <span className="font-medium">{u.label}</span>{" "}
                    <span className="text-muted-foreground">· {u.zone}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {u.guest} · till {u.until}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-base font-medium text-forest">Housekeeping</h2>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                ["Klara", housekeeping.ledigt],
                ["Städas", housekeeping.städas],
                ["Ankomstklart", housekeeping.dukat],
              ].map(([label, value]) => (
                <div key={label as string} className="rounded-xl bg-muted/50 p-3">
                  <p className="text-[11px] text-muted-foreground">{label}</p>
                  <p className="mt-1 text-xl font-medium text-forest">{value}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              Seytro besvarade {data.messages.length - unhandled} av {data.messages.length}{" "}
              gästkonversationer automatiskt.
            </p>
          </div>
        </div>
      </div>

      {/* Funktionerna från Seytro för hotell */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow text-muted-foreground">Seytro på hotellet</p>
            <h2 className="mt-1 text-heading text-forest">Från förfrågan till rumsplacering</h2>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
            <BellRing className="h-3.5 w-3.5" /> Alla agenter aktiva
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {hotelFunctions.map((f) => {
            const Icon = functionIcons[f.icon];
            return (
              <Link
                key={f.title}
                to={f.to}
                className="group rounded-2xl border border-border bg-background p-5 transition-colors hover:border-primary/50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-medium text-forest">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                <p className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-forest">{f.metric}</span>
                  <span className="inline-flex items-center gap-1 text-primary">
                    Öppna <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </p>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-muted/50 p-5 lg:grid-cols-4">
          {hotelPromises.map(([value, label]) => (
            <div key={label}>
              <p className="text-2xl font-medium text-forest">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof BedDouble;
  label: string;
  value: string | number;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        <p className="text-caption">{label}</p>
      </div>
      <p className="mt-2 text-3xl font-medium text-forest">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
