import type { TableUnit, Venue } from "@/lib/dashboard-data";
import type { MenuTemplate } from "@/lib/pm-templates";


export const SETUP_KEY = "seytro-setup";

export type DayHours = {
  /** 0 = måndag … 6 = söndag */
  day: number;
  label: string;
  closed: boolean;
  /** Kvar för äldre sparade uppsättningar – migreras till pass. */
  lunchOpen?: string;
  lunchClose?: string;
  dinnerOpen?: string;
  dinnerClose?: string;
};

/** Ikoner som ett serveringspass kan märkas med. */
export const PERIOD_ICONS = [
  "frukost",
  "brod",
  "soppa",
  "kaffe",
  "glas",
  "bestick",
  "drink",
  "skaldjur",
  "event",
] as const;

export type PeriodIcon = (typeof PERIOD_ICONS)[number];

/** Ett serveringspass, t.ex. Lunch 11:30–15:00 mån–fre. */
export type ServicePeriod = {
  id: string;
  name: string;
  icon: PeriodIcon;
  /** Tidsperiod passet är bokningsbart. */
  start: string;
  end: string;
  /** Standardtid som föreslås för nya bokningar. */
  defaultTime: string;
  /** 0 = måndag … 6 = söndag */
  days: number[];
  /** Intervall som summeras i dagens siffror. */
  sumStart: string;
  sumEnd: string;
};

export type VenueSetup = {
  /** Verksamhet */
  org: string;
  type: Venue | "hybrid";
  city: string;
  address: string;
  phone: string;
  email: string;
  seatsTotal: number;
  /** Öppettider och pass */
  hours: DayHours[];
  /** Serveringspass med egna tidsinställningar */
  periods: ServicePeriod[];
  /** Salsplan */
  zones: string[];
  tables: TableUnit[];
  /** Bokningsregler */
  rules: {
    slotMinutes: number;
    durationSmall: number;
    durationLarge: number;
    buffer: number;
    maxParty: number;
    largePartyThreshold: number;
    autoConfirm: boolean;
    requirePhone: boolean;
    requireCard: boolean;
    cancellationHours: number;
  };
  /** Menyer, dryckespaket, vin och sprit */
  menus: MenuTemplate[];
  /** Kanaler och AI */

  channels: {
    voice: boolean;
    email: boolean;
    web: boolean;
    sms: boolean;
  };
  ai: {
    autoAnswer: boolean;
    autoRebook: boolean;
    autoOptimise: boolean;
    autoPm: boolean;
    waitlist: boolean;
    tone: "professionell" | "varm" | "kortfattad";
  };
  createdAt: string;
};

const weekdays = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"];

export function defaultHours(): DayHours[] {
  return weekdays.map((label, day) => ({ day, label, closed: day === 6 }));
}

export const weekdayLabels = weekdays;
export const weekdayShort = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];

let periodCounter = 0;
export function newPeriod(partial: Partial<ServicePeriod> = {}): ServicePeriod {
  periodCounter += 1;
  return {
    id: `sp${Date.now().toString(36)}${periodCounter}`,
    name: "Nytt pass",
    icon: "bestick",
    start: "17:00",
    end: "22:00",
    defaultTime: "19:00",
    days: [0, 1, 2, 3, 4, 5, 6],
    sumStart: "17:00",
    sumEnd: "22:00",
    ...partial,
  };
}

export function defaultPeriods(): ServicePeriod[] {
  const all = [0, 1, 2, 3, 4, 5, 6];
  return [
    newPeriod({
      name: "Frukost",
      icon: "frukost",
      start: "06:00",
      end: "10:30",
      defaultTime: "08:00",
      days: all,
      sumStart: "06:00",
      sumEnd: "10:30",
    }),
    newPeriod({
      name: "Lunch",
      icon: "soppa",
      start: "10:30",
      end: "16:30",
      defaultTime: "12:00",
      days: all,
      sumStart: "10:30",
      sumEnd: "16:00",
    }),
    newPeriod({
      name: "Middag",
      icon: "bestick",
      start: "16:15",
      end: "23:59",
      defaultTime: "19:00",
      days: all,
      sumStart: "16:15",
      sumEnd: "23:59",
    }),
  ];
}

/** Passen som gäller en viss veckodag (0 = måndag), sorterade på starttid. */
export function activePeriods(periods: ServicePeriod[], day: number) {
  return periods
    .filter((p) => p.days.includes(day))
    .slice()
    .sort((a, b) => a.start.localeCompare(b.start));
}

/** Snabbtider var 30:e minut inom dagens pass. Faller tillbaka på standardpassen. */
export function periodQuickTimes(periods: ServicePeriod[], day: number, stepMin = 30) {
  const list = activePeriods(periods.length ? periods : defaultPeriods(), day);
  const out: string[] = [];
  for (const p of list) {
    const [sh = 0, sm = 0] = p.start.split(":").map(Number);
    const [eh = 0, em = 0] = p.end.split(":").map(Number);
    for (let m = sh * 60 + sm; m <= eh * 60 + em - stepMin; m += stepMin) {
      out.push(
        `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`,
      );
    }
  }
  return out;
}

/** Bygger pass av äldre uppsättningar som bara hade lunch- och middagsfält. */
function migratePeriods(hours: DayHours[]): ServicePeriod[] {
  const first = hours.find((h) => h.lunchOpen || h.dinnerOpen);
  if (!first) return defaultPeriods();
  const lunchDays = hours.filter((h) => !h.closed && h.lunchOpen).map((h) => h.day);
  const dinnerDays = hours.filter((h) => !h.closed && h.dinnerOpen).map((h) => h.day);
  const out: ServicePeriod[] = [];
  if (first.lunchOpen) {
    out.push(
      newPeriod({
        name: "Lunch",
        icon: "soppa",
        start: first.lunchOpen,
        end: first.lunchClose ?? "16:30",
        defaultTime: "12:00",
        days: lunchDays.length ? lunchDays : [0, 1, 2, 3, 4, 5, 6],
        sumStart: first.lunchOpen,
        sumEnd: first.lunchClose ?? "16:00",
      }),
    );
  }
  if (first.dinnerOpen) {
    out.push(
      newPeriod({
        name: "Middag",
        icon: "bestick",
        start: first.dinnerOpen,
        end: first.dinnerClose ?? "23:59",
        defaultTime: "19:00",
        days: dinnerDays.length ? dinnerDays : [0, 1, 2, 3, 4, 5, 6],
        sumStart: first.dinnerOpen,
        sumEnd: first.dinnerClose ?? "23:59",
      }),
    );
  }
  return out.length ? out : defaultPeriods();
}

export function emptySetup(): VenueSetup {
  return {
    org: "",
    type: "restaurang",
    city: "",
    address: "",
    phone: "",
    email: "",
    seatsTotal: 0,
    hours: defaultHours(),
    periods: defaultPeriods(),
    zones: ["Matsalen", "Bar", "Uteservering"],
    tables: [],
    menus: [],

    rules: {
      slotMinutes: 15,
      durationSmall: 105,
      durationLarge: 150,
      buffer: 15,
      maxParty: 12,
      largePartyThreshold: 8,
      autoConfirm: true,
      requirePhone: true,
      requireCard: false,
      cancellationHours: 4,
    },
    channels: { voice: true, email: true, web: true, sms: false },
    ai: {
      autoAnswer: true,
      autoRebook: true,
      autoOptimise: true,
      autoPm: true,
      waitlist: true,
      tone: "varm",
    },
    createdAt: new Date().toISOString(),
  };
}

export function readSetup(): VenueSetup | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SETUP_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as VenueSetup;
    if (!parsed || typeof parsed.org !== "string") return null;
    const hours = parsed.hours?.length ? parsed.hours : defaultHours();
    return {
      ...emptySetup(),
      ...parsed,
      hours,
      periods: parsed.periods?.length ? parsed.periods : migratePeriods(hours),
      menus: parsed.menus ?? [],
    };
  } catch {
    return null;
  }
}

export function writeSetup(setup: VenueSetup) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SETUP_KEY, JSON.stringify(setup));
}

export function clearSetup() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SETUP_KEY);
}

export function seatCount(tables: TableUnit[]) {
  return tables.reduce((sum, t) => sum + (t.seats || 0), 0);
}

/** Enkel kapacitetsberäkning per pass utifrån platser och sittningslängd. */
export function coversPerService(setup: VenueSetup, minutesOpen: number) {
  const seats = seatCount(setup.tables);
  const turn = setup.rules.durationSmall + setup.rules.buffer;
  const sittings = Math.max(1, Math.round((minutesOpen / turn) * 10) / 10);
  return Math.round(seats * sittings);
}

export function minutesBetween(from: string, to: string) {
  const [fh = 0, fm = 0] = from.split(":").map(Number);
  const [th = 0, tm = 0] = to.split(":").map(Number);
  return Math.max(0, th * 60 + tm - (fh * 60 + fm));
}

let counter = 0;
export function newTable(zone: string, x: number, y: number, label: string): TableUnit {
  counter += 1;
  return {
    id: `nt${Date.now().toString(36)}${counter}`,
    label,
    seats: 2,
    status: "ledigt",
    zone,
    x,
    y,
    shape: "fyrkant",
  };
}

/** Ersätter demodata med den egna uppsättningen för ett onboardat konto. */
export function applySetup<
  T extends {
    label: string;
    units: TableUnit[];
    bookings: unknown[];
    guests: unknown[];
    messages: unknown[];
    kpis: { label: string; value: string; delta: string; hint: string }[];
  },
>(base: T, setup: VenueSetup, venue: Venue): T {
  return {
    ...base,
    label: setup.org || base.label,
    units: venue === "restaurang" ? setup.tables : base.units,
    bookings: [],
    guests: [],
    messages: [],
    kpis: base.kpis.map((k) => ({ ...k, value: "—", delta: "", hint: "Ny verksamhet" })),
  };
}
