import { createContext, useContext, useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  Clock,
  Inbox,
  LayoutGrid,
  LogOut,
  Plus,
  Search,
  UserPlus,
  Users,
  UtensilsCrossed,
  Zap,
} from "lucide-react";
import logoAsset from "@/assets/seytro-logo.png.asset.json";
import { dashboardData, type Venue } from "@/lib/dashboard-data";
import { DateNav } from "@/components/dashboard/DateNav";

const VenueContext = createContext<{
  venue: Venue;
  setVenue: (v: Venue) => void;
  date: Date;
  setDate: (d: Date) => void;
}>({
  venue: "restaurang",
  setVenue: () => {},
  date: new Date(2026, 7, 13),
  setDate: () => {},
});

export function useVenue() {
  const { venue, setVenue, date, setDate } = useContext(VenueContext);
  return { venue, setVenue, date, setDate, data: dashboardData[venue] };
}

const nav = [
  { to: "/dashboard", label: "Översikt", icon: CalendarDays, exact: true },
  { to: "/dashboard/salsplan", label: "Salsplan", icon: LayoutGrid, exact: false },
  { to: "/dashboard/pm", label: "PM & sällskap", icon: ClipboardList, exact: false },
  { to: "/dashboard/gaster", label: "Gästregister", icon: Users, exact: false },
  { to: "/dashboard/inkorg", label: "Inkorg", icon: Inbox, exact: false },
  { to: "/dashboard/analys", label: "Analys", icon: BarChart3, exact: false },
] as const;

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [venue, setVenueState] = useState<Venue>("restaurang");
  const [date, setDate] = useState<Date>(() => new Date(2026, 7, 13));
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const stored = window.localStorage.getItem("seytro-venue");
    if (stored === "restaurang" || stored === "hotell") setVenueState(stored);
  }, []);

  const setVenue = (v: Venue) => {
    window.localStorage.setItem("seytro-venue", v);
    setVenueState(v);
  };

  const data = dashboardData[venue];

  return (
    <VenueContext.Provider value={{ venue, setVenue, date, setDate }}>
      <div className="flex min-h-[100svh] bg-muted/40">
        <aside className="sticky top-0 hidden h-[100svh] w-60 shrink-0 flex-col border-r border-border bg-forest-deep px-4 py-5 text-primary-foreground lg:flex">
          <Link to="/" className="px-2">
            <img src={logoAsset.url} alt="Seytro" className="h-5 w-auto" />
          </Link>

          <div className="mt-7 rounded-xl bg-primary-foreground/8 p-1">
            {(["restaurang", "hotell"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVenue(v)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm capitalize transition-colors ${
                  venue === v
                    ? "bg-primary-foreground text-forest-deep"
                    : "text-primary-foreground/70 hover:text-primary-foreground"
                }`}
              >
                {v === "restaurang" ? "Restaurang" : "Hotell"}
              </button>
            ))}
          </div>
          <p className="mt-3 px-3 text-xs text-primary-foreground/50">{data.label}</p>

          <nav className="mt-6 flex flex-1 flex-col gap-1">
            {nav.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-primary-foreground/12 text-primary-foreground"
                      : "text-primary-foreground/65 hover:bg-primary-foreground/8 hover:text-primary-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-primary-foreground/65 transition-colors hover:text-primary-foreground"
          >
            <LogOut className="h-4 w-4" />
            Logga ut
          </Link>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <div className="flex min-w-0 items-center gap-2">
                {stats.map((s) => (
                  <span
                    key={s.label}
                    title={s.label}
                    className="hidden items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm text-forest sm:inline-flex"
                  >
                    <s.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium">{s.value}</span>
                    <span className="hidden text-xs text-muted-foreground xl:inline">
                      {s.label}
                    </span>
                  </span>
                ))}
              </div>

              <DateNav date={date} onChange={setDate} />

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 md:flex">
                  <Search className="h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    placeholder="Sök gäst eller bokning"
                    className="w-36 bg-transparent text-sm outline-none placeholder:text-muted-foreground xl:w-44"
                  />
                </div>
                <select
                  value={venue}
                  onChange={(e) => setVenue(e.target.value as Venue)}
                  className="hidden rounded-full border border-border bg-background px-3 py-1.5 text-sm text-forest sm:block"
                >
                  <option value="restaurang">Restaurang</option>
                  <option value="hotell">Hotell</option>
                </select>
                <button
                  type="button"
                  className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90"
                  aria-label="Ny bokning"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 overflow-x-auto border-t border-border/70 px-4 py-2 sm:px-6">
              <p className="hidden shrink-0 truncate text-sm font-medium text-forest lg:block">
                {data.label}
              </p>
              <div className="flex shrink-0 items-center gap-1">
                {quickDays.map((q) => {
                  const active = isSameDay(q.date, date);
                  return (
                    <button
                      key={q.label}
                      type="button"
                      onClick={() => setDate(q.date)}
                      className={`whitespace-nowrap rounded-full px-3 py-1 text-sm capitalize transition-colors ${
                        active
                          ? "bg-forest text-primary-foreground"
                          : "text-muted-foreground hover:text-forest"
                      }`}
                    >
                      {q.label}
                    </button>
                  );
                })}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {quickActions.map((a) => (
                  <button
                    key={a.label}
                    type="button"
                    className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-forest"
                  >
                    <a.icon className="h-3.5 w-3.5" />
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
            <nav className="mt-3 flex gap-1 overflow-x-auto lg:hidden">
              {nav.map((item) => {
                const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm ${
                      active ? "bg-forest text-primary-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </header>
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </VenueContext.Provider>
  );
}
