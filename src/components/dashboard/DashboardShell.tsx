import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { toast } from "sonner";

import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  CalendarRange,
  ClipboardList,
  Clock,
  GanttChartSquare as GanttChart,
  Lightbulb,
  Inbox,
  LayoutGrid,
  ListChecks,
  LogOut,
  PhoneCall,
  Plus,
  Search,
  Settings2,
  Sparkle,
  UserPlus,
  Users,
  UtensilsCrossed,
  Wand2,
  Zap,
} from "lucide-react";

import logoAsset from "@/assets/seytro-logo.png.asset.json";
import {
  dashboardData,
  serviceOf,
  servicePeriods,
  type ServicePeriod,
  type Venue,
} from "@/lib/dashboard-data";
import { readAccountPlan, venuesForPlan, type AccountPlan } from "@/lib/account";
import { applySetup, readSetup, type VenueSetup } from "@/lib/onboarding";
import { DateNav } from "@/components/dashboard/DateNav";

const VenueContext = createContext<{
  venue: Venue;
  setVenue: (v: Venue) => void;
  date: Date;
  setDate: (d: Date) => void;
  service: ServicePeriod;
  setService: (s: ServicePeriod) => void;
  setup: VenueSetup | null;
}>({
  venue: "restaurang",
  setVenue: () => {},
  date: new Date(2026, 7, 13),
  setDate: () => {},
  service: "middag",
  setService: () => {},
  setup: null,
});

export function useVenue() {
  const { venue, setVenue, date, setDate, service, setService, setup } =
    useContext(VenueContext);
  const data = useMemo(() => {
    const base = dashboardData[venue];
    return setup ? applySetup(base, setup, venue) : base;
  }, [venue, setup]);
  /** Bokningar för valt pass (hotellet visar hela dygnet). */
  const serviceBookings =
    venue === "hotell" ? data.bookings : data.bookings.filter((b) => serviceOf(b.time) === service);
  return { venue, setVenue, date, setDate, service, setService, data, serviceBookings, setup };
}

type NavItem = { to: string; label: string; icon: typeof CalendarDays; exact?: boolean };
type NavGroup = { title?: string; items: NavItem[] };

function navGroups(venue: Venue): NavGroup[] {
  const isHotel = venue === "hotell";
  return [
    {
      items: [
        { to: "/dashboard", label: "Hem", icon: LayoutGrid, exact: true },
        { to: "/dashboard/assistent", label: "Assistent", icon: Sparkle },
      ],
    },
    {
      title: "Kommunikation",
      items: [
        { to: "/dashboard/epost", label: "E-post", icon: Inbox },
        { to: "/dashboard/samtal", label: "Samtal", icon: PhoneCall },
        { to: "/dashboard/eskaleringar", label: "Eskaleringar", icon: AlertTriangle },
      ],
    },
    {
      title: "Drift",
      items: isHotel
        ? [
            { to: "/dashboard/salsplan", label: "Rum", icon: LayoutGrid },
            { to: "/dashboard/kalender", label: "Kalender", icon: CalendarRange },
            { to: "/dashboard/listor", label: "Listor", icon: ListChecks },
            { to: "/dashboard/vantelista", label: "Väntelista", icon: Clock },
            { to: "/dashboard/forslag", label: "AI-förslag", icon: Lightbulb },
          ]
        : [
            { to: "/dashboard/salsplan", label: "Bord", icon: LayoutGrid },
            { to: "/dashboard/kalender", label: "Kalender", icon: CalendarRange },
            { to: "/dashboard/tidslinje", label: "Tidslinje", icon: GanttChart },
            { to: "/dashboard/optimering", label: "Optimering", icon: Wand2 },
            { to: "/dashboard/forslag", label: "AI-förslag", icon: Lightbulb },
            { to: "/dashboard/listor", label: "Listor", icon: ListChecks },
            { to: "/dashboard/vantelista", label: "Väntelista", icon: Clock },
          ],
    },
    {
      title: isHotel ? "Hotell" : "Restaurang",
      items: [
        { to: "/dashboard/gaster", label: "Gäster", icon: Users },
        ...(isHotel ? [] : [{ to: "/dashboard/pm", label: "PM & sällskap", icon: ClipboardList }]),
        { to: "/dashboard/analys", label: "Analys", icon: BarChart3 },
        { to: "/dashboard/konfiguration", label: "Konfiguration", icon: Settings2 },
      ],
    },
  ];
}


function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildQuickDays(selected: Date) {
  const base = new Date(2026, 7, 13);
  const anchor = isSameDay(selected, base) || selected > base ? base : selected;
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() + i);
    const label =
      i === 0 ? "idag" : i === 1 ? "imorgon" : d.toLocaleDateString("sv-SE", { weekday: "long" });
    return { date: d, label };
  });
}

import { LiveFeed } from "@/components/dashboard/LiveFeed";
import { CommandPalette, useCommandPalette } from "@/components/dashboard/CommandPalette";


export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [venue, setVenueState] = useState<Venue>("restaurang");
  const [plan, setPlan] = useState<AccountPlan>("hybrid");
  const [date, setDate] = useState<Date>(() => new Date(2026, 7, 13));
  const [service, setService] = useState<ServicePeriod>("middag");
  const [query, setQuery] = useState("");
  const [setup, setSetup] = useState<VenueSetup | null>(null);
  const { open: paletteOpen, setOpen: setPaletteOpen } = useCommandPalette();

  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const venues = venuesForPlan(plan, setup?.type);
  const canSwitch = venues.length > 1;
  const groups = useMemo(() => navGroups(venue), [venue]);
  const flatNav = useMemo(() => groups.flatMap((g) => g.items), [groups]);


  useEffect(() => {
    const p = readAccountPlan();
    setPlan(p);
    const own = p === "custom" ? readSetup() : null;
    setSetup(own);
    const allowed = venuesForPlan(p, own?.type);
    const stored = window.localStorage.getItem("seytro-venue");
    const next =
      stored === "restaurang" || stored === "hotell"
        ? (stored as Venue)
        : allowed[0]!;
    setVenueState(allowed.includes(next) ? next : allowed[0]!);
  }, []);

  const setVenue = (v: Venue) => {
    if (!venuesForPlan(plan, setup?.type).includes(v)) return;
    window.localStorage.setItem("seytro-venue", v);
    setVenueState(v);
  };

  const data = useMemo(
    () => (setup ? applySetup(dashboardData[venue], setup, venue) : dashboardData[venue]),
    [venue, setup],
  );

  const inService =
    venue === "hotell" ? data.bookings : data.bookings.filter((b) => serviceOf(b.time) === service);
  const active = inService.filter((b) => b.status !== "avbokad");
  const stats = [
    {
      label: venue === "hotell" ? "ankomster" : "bokningar",
      hint:
        venue === "hotell"
          ? "Ankommande gäster idag"
          : "Antal bokade sällskap i valt pass",
      value: active.length,
      icon: CalendarDays,
    },
    {
      label: "gäster",
      hint:
        venue === "hotell"
          ? "Totalt antal gäster som checkar in"
          : "Totalt antal personer i valt pass",
      value: active.reduce((s, b) => s + b.party, 0),
      icon: UtensilsCrossed,
    },
    {
      label: "väntar",
      hint: "Bokningar som inte är bekräftade än",
      value: active.filter((b) => b.status === "väntar").length,
      icon: Clock,
    },
  ];


  const serviceCounts = servicePeriods.map((p) => ({
    ...p,
    covers: data.bookings
      .filter((b) => serviceOf(b.time) === p.id && b.status !== "avbokad")
      .reduce((s, b) => s + b.party, 0),
  }));

  const quickDays = buildQuickDays(date);
  const quickActions = [
    {
      label: "Kölista",
      icon: Users,
      run: () =>
        toast("Kölista", {
          description: "3 sällskap i kö – nästa lediga bord ca 20 min.",
        }),
    },
    {
      label: "Drop in",
      icon: UserPlus,
      run: () => navigate({ to: "/dashboard/salsplan", search: { new: true } }),
    },
    {
      label: "Snabbokning",
      icon: Zap,
      run: () => navigate({ to: "/dashboard/salsplan", search: { new: true } }),
    },
  ];


  return (
    <VenueContext.Provider
      value={{ venue, setVenue, date, setDate, service, setService, setup }}
    >
      <div data-app-ui className="flex min-h-[100svh] bg-muted/40">
        <CommandPalette
          open={paletteOpen}
          onOpenChange={setPaletteOpen}
          items={groups.flatMap((g) =>
            g.items.map((i) => ({ ...i, group: g.title ?? "Översikt" })),
          )}
          actions={[
            {
              label: "Ny bokning",
              icon: Plus,
              run: () => navigate({ to: "/dashboard/salsplan", search: { new: true } }),
            },
            ...quickActions.map((a) => ({ label: a.label, icon: a.icon, run: a.run })),
          ]}
        />
        <aside className="side-nav sticky top-0 hidden h-[100svh] w-60 shrink-0 flex-col border-r border-border bg-forest-deep px-4 py-5 text-primary-foreground lg:flex">
          <Link to="/" className="px-2">
            <img src={logoAsset.url} alt="Seytro" className="h-5 w-auto" />
          </Link>

          {canSwitch && (
            <div className="mt-8 grid grid-cols-2 gap-1 rounded-full bg-primary-foreground/10 p-1">
              {venues.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVenue(v)}
                  className={`rounded-full px-3 py-1.5 text-center text-sm transition-colors ${
                    venue === v
                      ? "bg-primary-foreground text-forest-deep shadow-soft"
                      : "text-primary-foreground/65 hover:text-primary-foreground"
                  }`}
                >
                  {v === "restaurang" ? "Restaurang" : "Hotell"}
                </button>
              ))}
            </div>
          )}
          <div className="mt-4 rounded-xl border border-primary-foreground/10 bg-primary-foreground/[0.06] px-3 py-2.5">
            <p className="truncate text-sm text-primary-foreground/90">{data.label}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-primary-foreground/45">
              <span className="dot bg-status-free-fg text-status-free-fg" />
              {venue === "hotell" ? "Hotelldrift" : "Restaurangdrift"} · live
            </p>
          </div>

          <nav className="mt-6 flex flex-1 flex-col gap-0.5 overflow-y-auto pb-4">
            {groups.map((group, gi) => (
              <div key={group.title ?? `g${gi}`} className={group.title ? "mt-5" : ""}>
                {group.title && (
                  <p className="eyebrow px-3 pb-1 text-primary-foreground/40">{group.title}</p>
                )}
                <div className="flex flex-col gap-0.5">
                  {group.items.map((item) => {
                    const isActive = item.exact
                      ? pathname === item.to
                      : pathname.startsWith(item.to);
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        data-active={isActive}
                        className={`side-link flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                          isActive
                            ? "bg-primary-foreground/12 text-primary-foreground"
                            : "text-primary-foreground/65 hover:bg-primary-foreground/8 hover:text-primary-foreground"
                        }`}
                      >
                        <item.icon
                          className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : ""}`}
                        />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>



          {plan === "custom" && (
            <Link
              to="/onboarding"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-primary-foreground/65 transition-colors hover:text-primary-foreground"
            >
              <Settings2 className="h-4 w-4" />
              Uppsättning
            </Link>
          )}
          <Link
            to="/login"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-primary-foreground/65 transition-colors hover:text-primary-foreground"
          >
            <LogOut className="h-4 w-4" />
            Logga ut
          </Link>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 w-full min-w-0 overflow-x-clip border-b border-dashboard-header-edge bg-dashboard-header">
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <div className="hidden min-w-0 items-stretch divide-x divide-forest/10 overflow-hidden rounded-xl border border-dashboard-header-edge bg-background shadow-soft shadow-soft sm:flex">
                {stats.map((s) => (
                  <span
                    key={s.label}
                    title={s.hint}
                    className="flex items-center gap-2 px-3.5 py-1.5"
                  >
                    <s.icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="leading-tight">
                      <span className="block text-sm font-semibold text-forest">{s.value}</span>
                      <span className="block text-[11px] capitalize text-muted-foreground">
                        {s.label}
                      </span>
                    </span>
                  </span>
                ))}
              </div>

              <DateNav date={date} onChange={setDate} />

              <div className="flex items-center gap-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    navigate({
                      to: "/dashboard/salsplan",
                      search: query ? { q: query } : {},
                    });
                  }}
                  className="hidden items-center gap-2 rounded-full border border-dashboard-header-edge bg-background px-3 py-1.5 shadow-soft shadow-soft md:flex"
                >
                  <Search className="h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Sök gäst eller bokning"
                    className="w-36 bg-transparent text-sm outline-none placeholder:text-muted-foreground xl:w-44"
                  />
                </form>
                <LiveFeed venue={venue} />
                <button
                  type="button"
                  onClick={() => navigate({ to: "/dashboard/salsplan", search: { new: true } })}
                  className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft shadow-forest/10 transition-opacity hover:opacity-90"
                  aria-label="Ny bokning"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

            </div>

            <div className="flex items-center justify-between gap-4 overflow-x-auto border-t border-forest/8 px-4 py-2.5 sm:px-6">
              {venue === "restaurang" ? (
                <div className="flex shrink-0 items-center gap-1 rounded-full border border-dashboard-header-edge bg-background p-1 shadow-soft shadow-soft">
                  {serviceCounts.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setService(p.id)}
                      title={p.span}
                      className={`whitespace-nowrap rounded-full px-3.5 py-1 text-sm transition-colors ${
                        service === p.id
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-forest"
                      }`}

                    >
                      {p.label}
                      <span className="ml-1.5 text-xs text-muted-foreground">{p.covers}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="hidden shrink-0 truncate text-sm font-semibold text-forest lg:block">
                  {data.label}
                </p>
              )}
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
                          ? "bg-forest text-primary-foreground shadow-soft"
                          : "text-muted-foreground hover:bg-background hover:text-forest"
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
                    onClick={a.run}
                    className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-background hover:text-forest"
                  >

                    <a.icon className="h-3.5 w-3.5" />
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto border-t border-forest/8 px-4 py-2 sm:px-6 lg:hidden">
              {canSwitch && (
                <div className="flex shrink-0 items-center gap-1 rounded-full border border-dashboard-header-edge bg-background p-1">
                  {venues.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVenue(v)}
                      className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors ${
                        venue === v ? "bg-forest text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {v === "restaurang" ? "Restaurang" : "Hotell"}
                    </button>
                  ))}
                </div>
              )}
              <nav className="flex gap-1">
                {flatNav.map((item) => {
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
            </div>

          </header>
          <main className="mx-auto w-full max-w-[112rem] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-9 lg:py-10">
            {children}
          </main>
        </div>
      </div>
    </VenueContext.Provider>
  );
}
