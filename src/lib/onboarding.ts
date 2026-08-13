import type { TableUnit, Venue } from "@/lib/dashboard-data";

export const SETUP_KEY = "seytro-setup";

export type DayHours = {
  /** 0 = måndag … 6 = söndag */
  day: number;
  label: string;
  closed: boolean;
  lunchOpen: string;
  lunchClose: string;
  dinnerOpen: string;
  dinnerClose: string;
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
  return weekdays.map((label, day) => ({
    day,
    label,
    closed: day === 6,
    lunchOpen: "11:30",
    lunchClose: "15:00",
    dinnerOpen: "17:00",
    dinnerClose: day >= 4 ? "23:30" : "22:30",
  }));
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
    zones: ["Matsalen", "Bar", "Uteservering"],
    tables: [],
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
    return { ...emptySetup(), ...parsed };
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
