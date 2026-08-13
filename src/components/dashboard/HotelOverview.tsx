import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BedDouble,
  BrushCleaning,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  DoorOpen,
  LogIn,
  LogOut,
  TriangleAlert,
  UserRoundPlus,
} from "lucide-react";
import { toast } from "sonner";
import { useVenue } from "@/components/dashboard/DashboardShell";

function greetingFor(h: number) {
  if (h < 10) return "God morgon";
  if (h < 17) return "God eftermiddag";
  return "God kväll";
}

const statusStyles: Record<string, { chip: string; label: string; dot: string }> = {
  ledigt: { chip: "border-emerald-200 bg-emerald-50 text-emerald-800", label: "Städklart", dot: "bg-emerald-500" },
  städas: { chip: "border-amber-200 bg-amber-50 text-amber-800", label: "Städas", dot: "bg-amber-500" },
  upptaget: { chip: "border-rose-200 bg-rose-50 text-rose-800", label: "Upptaget", dot: "bg-rose-500" },
  dukat: { chip: "border-primary/25 bg-primary/5 text-primary", label: "Ankomstklart", dot: "bg-primary" },
};

export function HotelOverview() {
  const [greeting, setGreeting] = useState("God dag");
  useEffect(() => setGreeting(greetingFor(new Date().getHours())), []);

  const { data, date, setDate } = useVenue();
  const navigate = useNavigate();

  const shiftDay = (delta: number) => {
    const next = new Date(date);
    next.setDate(next.getDate() + delta);
    setDate(next);
  };

  const active = data.bookings.filter((b) => b.status !== "avbokad");
  const arrivals = active.filter((b) => b.status !== "anlänt");
  const checkedIn = active.filter((b) => b.status === "anlänt");
  const pending = active.filter((b) => b.status === "väntar");
  const rooms = data.units;
  const clean = rooms.filter((u) => u.status === "ledigt");
  const dirty = rooms.filter((u) => u.status === "städas");
  const occupied = rooms.filter((u) => u.status === "upptaget");
  const ready = rooms.filter((u) => u.status === "dukat");
  const departures = occupied.slice(0, 4);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Rubrik + datum */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-heading text-forest">{greeting}, receptionen</h1>
          <p className="mt-1 text-caption text-muted-foreground">
            Här är läget på {data.label} just nu.
          </p>
        </div>
        <div className="flex w-full items-center justify-between gap-1 rounded-full border border-border bg-card px-2 py-1.5 sm:w-auto sm:justify-start">
          <button
            type="button"
            aria-label="Föregående dag"
            onClick={() => shiftDay(-1)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-forest"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="truncate px-2 text-center text-xs capitalize text-forest sm:min-w-[200px] sm:text-sm">
            {date.toLocaleDateString("sv-SE", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <button
            type="button"
            aria-label="Nästa dag"
            onClick={() => shiftDay(1)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-forest"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Snabbaste vägen */}
      <div className="flex flex-col gap-5 rounded-2xl bg-forest p-5 text-primary-foreground sm:p-7 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-6">
        <div className="min-w-0">
          <p className="eyebrow text-primary-foreground/60">Snabbaste vägen</p>
          <h2 className="mt-2 text-xl font-medium sm:text-2xl">Checka in gäst</h2>
          <p className="mt-1.5 text-sm text-primary-foreground/70">
            {arrivals.reduce((s, b) => s + b.party, 0)} gäster väntas idag · {clean.length} rum är
            städklara nu
          </p>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-3 lg:flex lg:flex-wrap lg:gap-3">
          <button
            type="button"
            onClick={() => toast.success("Incheckning startad", { description: "Välj gäst i ankomstlistan." })}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-background px-5 py-2.5 text-sm font-medium text-forest transition-opacity hover:opacity-90"
          >
            <UserRoundPlus className="h-4 w-4" /> Checka in gäst
          </button>
          <button
            type="button"
            onClick={() => toast("Drop in-gäst", { description: `${clean.length} rum kan tilldelas direkt.` })}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-primary-foreground/25 px-5 py-2.5 text-sm transition-colors hover:bg-primary-foreground/10"
          >
            <DoorOpen className="h-4 w-4" /> Drop in-gäst
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard/salsplan", search: { new: true } })}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-primary-foreground/25 px-5 py-2.5 text-sm transition-colors hover:bg-primary-foreground/10"
          >
            <CalendarPlus className="h-4 w-4" /> Ny bokning
          </button>
        </div>
      </div>

      {/* Nyckeltal */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">

        <MiniStat
          icon={LogIn}
          label="Incheckade"
          value={`${checkedIn.length}`}
          suffix={`/ ${active.length}`}
          hint={`${occupied.length} rum är belagda av totalt ${rooms.length}.`}
          scrollTo="rumsstatus"
        />
        <MiniStat
          icon={BedDouble}
          label="Ankomster idag"
          value={`${arrivals.length}`}
          suffix="bokningar"
          hint={`${ready.length} rum är förberedda · ${pending.length} väntar bekräftelse.`}
          scrollTo="ankomster"
        />
        <MiniStat
          icon={DoorOpen}
          label="Lediga rum"
          value={`${clean.length}`}
          suffix={`/ ${rooms.length} rum`}
          hint={`${clean.length} städklara · ${dirty.length} behöver städas.`}
          scrollTo="rumsstatus"
        />
        <MiniStat
          icon={TriangleAlert}
          label="Kräver uppmärksamhet"
          value={`${pending.length + dirty.length}`}
          suffix="ärenden"
          hint={`${pending.length} obekräftade · ${dirty.length} rum väntar på städ.`}
          scrollTo="uppmärksamhet"
        />
      </div>

      {/* Rumsstatus */}
      <div id="rumsstatus" className="rounded-2xl border border-border bg-card p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <h2 className="inline-flex items-center gap-2 text-base font-medium text-forest">
            <BedDouble className="h-4 w-4 text-primary" /> Rumsstatus
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            {Object.entries(statusStyles).map(([key, s]) => (
              <span key={key} className="inline-flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${s.dot}`} /> {s.label}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5 min-[420px]:grid-cols-3 sm:mt-5 sm:grid-cols-5 xl:grid-cols-8">
          {rooms.map((u) => {
            const s = statusStyles[u.status]!;
            return (
              <Link
                key={u.id}
                to="/dashboard/salsplan"
                className={`flex min-h-16 flex-col items-center justify-center rounded-xl border p-3 text-center transition-transform hover:-translate-y-0.5 ${s.chip}`}
              >
                <p className="text-sm font-medium">{u.label}</p>
                <p className="mt-0.5 text-[11px] opacity-80">{s.label}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Ankomster & avresor */}
      <div id="uppmärksamhet" className="grid gap-4 lg:grid-cols-2">
        <div id="ankomster" className="rounded-2xl border border-border bg-card p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-medium text-forest">Dagens ankomster</h2>
            <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
              {arrivals.length} väntar
            </span>
          </div>
          <ul className="mt-4 space-y-2.5">
            {arrivals.map((b) => (
              <li
                key={b.id}
                className="flex flex-col gap-2.5 rounded-xl bg-muted/50 px-4 py-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between min-[420px]:gap-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-forest">{b.name}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {b.table || "Ej tilldelat rum"} · {b.party} gäster · {b.nights ?? 1} nätter
                  </p>
                </div>
                <div className="flex shrink-0 items-center justify-between gap-3 min-[420px]:justify-end">
                  <span className="text-xs text-muted-foreground">{b.time}</span>
                  <button
                    type="button"
                    onClick={() =>
                      toast.success("Incheckad", { description: `${b.name} · ${b.table || "rum tilldelas"}` })
                    }
                    className="inline-flex min-h-9 items-center rounded-full bg-forest px-4 py-1.5 text-xs text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Checka in
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>


        <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-medium text-forest">Dagens avresor</h2>
            <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
              {departures.length} totalt
            </span>
          </div>
          <ul className="mt-4 space-y-2.5">
            {departures.map((u) => (
              <li
                key={u.id}
                className="flex flex-col gap-2.5 rounded-xl bg-muted/50 px-4 py-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between min-[420px]:gap-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background text-xs font-medium text-forest">
                    {u.label}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-forest">{u.guest}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      Utcheckning {u.until} · {u.zone}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toast.success("Utcheckad", { description: `Rum ${u.label} skickat till städ.` })}
                  className="inline-flex min-h-9 shrink-0 items-center justify-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-xs text-forest transition-colors hover:border-primary hover:text-primary"
                >
                  <LogOut className="h-3.5 w-3.5" /> Checka ut
                </button>
              </li>
            ))}
          </ul>

          <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <BrushCleaning className="h-3.5 w-3.5 text-primary" />
            {dirty.length} rum ligger i städkö efter avresa.
          </p>
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
  suffix,
  hint,
  scrollTo,
}: {
  icon: typeof BedDouble;
  label: string;
  value: string;
  suffix: string;
  hint: string;
  scrollTo?: string;
}) {
  const clickable = Boolean(scrollTo);
  const handleClick = () => {
    if (!scrollTo) return;
    const el = document.getElementById(scrollTo);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const wrapperClasses = [
    "rounded-2xl border border-border bg-card p-4 text-left transition-all sm:p-5",
    clickable
      ? "cursor-pointer hover:border-primary/40 hover:bg-primary/[0.02] hover:shadow-sm"
      : "",
  ].join(" ");


  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!clickable}
      className={wrapperClasses}
      aria-label={clickable ? `Gå till ${label.toLowerCase()}` : undefined}
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <p className="eyebrow">{label}</p>
      </div>
      <p className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-medium text-forest">{value}</span>
        <span className="text-xs text-muted-foreground">{suffix}</span>
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{hint}</p>
    </button>
  );
}
