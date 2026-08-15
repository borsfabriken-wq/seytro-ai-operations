/**
 * Enkel realtidsbuss för dashboarden.
 * Modulnivå-store som komponenter prenumererar på via useSyncExternalStore.
 */

export type LiveEventKind =
  | "vantelista-ny"
  | "vantelista-match"
  | "vantelista-erbjudande"
  | "vantelista-svar"
  | "vantelista-omvandlad"
  | "flytt"
  | "avbokning"
  | "ny-bokning";

export type LiveEvent = {
  id: string;
  kind: LiveEventKind;
  title: string;
  detail: string;
  at: number;
  venue: "restaurang" | "hotell";
  /** Sant när AI:n hanterade händelsen utan mänsklig åtgärd. */
  auto?: boolean;
  read?: boolean;
  /** Fritt nyttolastfält så vyer kan uppdatera sin egen lista. */
  payload?: Record<string, unknown>;
};

type Listener = () => void;

let events: LiveEvent[] = [];
const listeners = new Set<Listener>();

function emit() {
  for (const l of listeners) l();
}

export function subscribeLive(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getLiveEvents() {
  return events;
}

export function publishLive(
  event: Omit<LiveEvent, "id" | "at" | "read"> & { id?: string; at?: number },
): LiveEvent {
  const full: LiveEvent = {
    id: event.id ?? `ev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    at: event.at ?? Date.now(),
    read: false,
    ...event,
  };
  events = [full, ...events].slice(0, 60);
  emit();
  return full;
}

export function markAllRead() {
  if (!events.some((e) => !e.read)) return;
  events = events.map((e) => (e.read ? e : { ...e, read: true }));
  emit();
}

export function clearLive() {
  events = [];
  emit();
}

export function unreadCount(list: LiveEvent[] = events) {
  return list.filter((e) => !e.read).length;
}

export function timeAgo(at: number, now = Date.now()) {
  const s = Math.max(0, Math.round((now - at) / 1000));
  if (s < 45) return "nyss";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min sedan`;
  const h = Math.round(m / 60);
  return `${h} h sedan`;
}

/* --- Simulerad livedrift (demodata tills backend är påkopplad) ------------ */

type Venue = LiveEvent["venue"];

const guests = [
  "Familjen Norell",
  "Elisabet Ohlsson",
  "Yuki Tanaka",
  "Sällskap Lindh",
  "Maria Kallio",
  "Peter Sjöberg",
  "Konferens Vinge",
  "Anders Wik",
];

const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)]!;
const time = () => `${18 + Math.floor(Math.random() * 4)}:${pick(["00", "15", "30", "45"])}`;

function randomEvent(venue: Venue): Omit<LiveEvent, "id" | "at" | "read"> {
  const guest = pick(guests);
  const party = 2 + Math.floor(Math.random() * 7);
  const unit = venue === "hotell" ? `rum ${200 + Math.floor(Math.random() * 30)}` : `bord ${1 + Math.floor(Math.random() * 24)}`;

  const kind = pick([
    "vantelista-match",
    "vantelista-ny",
    "vantelista-svar",
    "flytt",
    "avbokning",
    "ny-bokning",
  ] as const);

  switch (kind) {
    case "vantelista-ny":
      return {
        kind,
        venue,
        auto: true,
        title: "Ny gäst i väntelistan",
        detail: `${guest} · ${party} pers · önskar ${time()} — inlagd av röstagenten`,
        payload: { name: guest, party, wanted: time() },
      };
    case "vantelista-match":
      return {
        kind,
        venue,
        auto: true,
        title: "Väntelistan matchad",
        detail: `${guest} (${party} pers) matchades mot ${unit} kl ${time()} — erbjudande skickat`,
        payload: { name: guest, unit },
      };
    case "vantelista-svar":
      return {
        kind,
        venue,
        title: "Svar på erbjudande",
        detail: `${guest} tackade ja — bokningen är bekräftad på ${unit}`,
        payload: { name: guest, unit },
      };
    case "flytt":
      return {
        kind,
        venue,
        auto: true,
        title: "Placering flyttad",
        detail: `${guest} flyttades till ${unit} för att frigöra kapacitet kl ${time()}`,
        payload: { name: guest, unit },
      };
    case "avbokning":
      return {
        kind,
        venue,
        title: "Avbokning",
        detail: `${guest} (${party} pers) avbokade kl ${time()} — ${unit} är ledigt igen`,
        payload: { name: guest, unit, party },
      };
    default:
      return {
        kind: "ny-bokning",
        venue,
        auto: true,
        title: "Ny bokning",
        detail: `${guest} · ${party} pers kl ${time()} via ${pick(["röstagenten", "e-postconciergen", "webben"])}`,
        payload: { name: guest, party },
      };
  }
}

let timer: ReturnType<typeof setTimeout> | null = null;
let running = 0;

/** Startar den simulerade strömmen. Returnerar en stop-funktion. */
export function startLiveSimulation(getVenue: () => Venue) {
  running += 1;
  if (timer === null) {
    const schedule = () => {
      timer = setTimeout(
        () => {
          publishLive(randomEvent(getVenue()));
          schedule();
        },
        18000 + Math.random() * 22000,
      );
    };
    schedule();
  }
  return () => {
    running -= 1;
    if (running <= 0 && timer !== null) {
      clearTimeout(timer);
      timer = null;
      running = 0;
    }
  };
}
