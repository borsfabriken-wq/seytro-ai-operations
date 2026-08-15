import type { Booking, TableUnit } from "@/lib/dashboard-data";

/* ============================================================
 * Kapacitets-AI: hittar konflikter och föreslår bord/zon,
 * alternativa tider och bemanning. Deterministisk logik mot
 * demodata — samma indata ger alltid samma förslag.
 * ============================================================ */

const DEFAULT_TURN_MIN = 105;

export function toMinutes(time: string) {
  const [h, m] = time.split(":");
  return Number(h) * 60 + Number(m ?? 0);
}

export function toTime(minutes: number) {
  const m = ((minutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

/** Turtid i minuter — större sällskap sitter längre. */
export function turnTime(booking: Booking) {
  if (booking.end) return Math.max(30, toMinutes(booking.end) - toMinutes(booking.time));
  if (booking.party >= 8) return 150;
  if (booking.party >= 5) return 120;
  return DEFAULT_TURN_MIN;
}

function span(booking: Booking) {
  const start = toMinutes(booking.time);
  return { start, end: start + turnTime(booking) };
}

function overlaps(a: Booking, b: Booking) {
  const x = span(a);
  const y = span(b);
  return x.start < y.end && y.start < x.end;
}

const active = (b: Booking) => b.status !== "avbokad";

/* --- Konflikter ---------------------------------------------------------- */

export type ConflictKind = "dubbelbokat" | "för litet bord" | "oplacerad" | "överbelastning";

export type CapacityConflict = {
  id: string;
  kind: ConflictKind;
  severity: "hög" | "medel";
  title: string;
  detail: string;
  bookingIds: string[];
  time: string;
  /** Föreslagen lösning, när en sådan finns. */
  fix?: { bookingId: string; table?: string; time?: string; label: string };
};

function seatsOf(units: TableUnit[], label: string) {
  return units.find((u) => u.label === label)?.seats ?? 0;
}

/** Bord som är fria under bokningens hela tidsfönster. */
export function freeTablesFor(
  booking: Booking,
  bookings: Booking[],
  units: TableUnit[],
  atTime?: string,
) {
  const probe: Booking = atTime ? { ...booking, time: atTime, end: undefined } : booking;
  return units.filter((unit) => {
    const clash = bookings.some(
      (other) =>
        other.id !== booking.id &&
        active(other) &&
        other.table === unit.label &&
        overlaps(probe, other),
    );
    return !clash;
  });
}

export function detectConflicts(bookings: Booking[], units: TableUnit[]): CapacityConflict[] {
  const list = bookings.filter(active);
  const out: CapacityConflict[] = [];
  const seen = new Set<string>();

  // 1. Samma bord, överlappande tider.
  for (const a of list) {
    if (!a.table) continue;
    for (const b of list) {
      if (a.id >= b.id || b.table !== a.table) continue;
      if (!overlaps(a, b)) continue;
      const key = `${a.id}-${b.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const moveable = a.lockedTable ? b : a;
      const alt = freeTablesFor(moveable, list, units)
        .filter((u) => u.seats >= moveable.party)
        .sort((x, y) => x.seats - y.seats)[0];
      out.push({
        id: `cf-dbl-${a.id}-${b.id}`,
        kind: "dubbelbokat",
        severity: "hög",
        title: `Bord ${a.table} är dubbelbokat`,
        detail: `${a.name} ${a.time} och ${b.name} ${b.time} överlappar med ${turnTime(a)} min turtid.`,
        bookingIds: [a.id, b.id],
        time: a.time,
        ...(alt
          ? {
              fix: {
                bookingId: moveable.id,
                table: alt.label,
                label: `Flytta ${moveable.name} till bord ${alt.label} (${alt.seats} pl, ${alt.zone})`,
              },
            }
          : {}),
      });
    }
  }

  // 2. För litet bord för sällskapet.
  for (const b of list) {
    if (!b.table || !b.placed) continue;
    const seats = seatsOf(units, b.table);
    if (!seats || seats >= b.party) continue;
    const alt = freeTablesFor(b, list, units)
      .filter((u) => u.seats >= b.party)
      .sort((x, y) => x.seats - y.seats)[0];
    out.push({
      id: `cf-small-${b.id}`,
      kind: "för litet bord",
      severity: "hög",
      title: `${b.name} sitter för trångt`,
      detail: `${b.party} gäster på bord ${b.table} med ${seats} platser.`,
      bookingIds: [b.id],
      time: b.time,
      ...(alt
        ? {
            fix: {
              bookingId: b.id,
              table: alt.label,
              label: `Flytta till bord ${alt.label} (${alt.seats} pl)`,
            },
          }
        : {}),
    });
  }

  // 3. Oplacerade bokningar.
  for (const b of list) {
    if (b.placed || !b.table === false) continue;
    if (b.placed) continue;
    const best = bestTables(b, list, units)[0];
    out.push({
      id: `cf-unplaced-${b.id}`,
      kind: "oplacerad",
      severity: "medel",
      title: `${b.name} saknar bord`,
      detail: `${b.party} gäster kl ${b.time} är inte placerade.`,
      bookingIds: [b.id],
      time: b.time,
      ...(best
        ? {
            fix: {
              bookingId: b.id,
              table: best.table.label,
              label: `Placera på bord ${best.table.label} (${best.table.zone})`,
            },
          }
        : {}),
    });
  }

  // 4. Överbelastning: fler gäster än platser i samma tidsfönster.
  const totalSeats = units.reduce((sum, u) => sum + u.seats, 0);
  const buckets = new Map<number, number>();
  for (const b of list) {
    const { start, end } = span(b);
    for (let t = start - (start % 15); t < end; t += 15) {
      buckets.set(t, (buckets.get(t) ?? 0) + b.party);
    }
  }
  for (const [slot, covers] of [...buckets.entries()].sort((a, b) => a[0] - b[0])) {
    if (totalSeats === 0 || covers <= totalSeats) continue;
    out.push({
      id: `cf-load-${slot}`,
      kind: "överbelastning",
      severity: "hög",
      title: `Överbelastning kl ${toTime(slot)}`,
      detail: `${covers} gäster mot ${totalSeats} platser — AI föreslår att sprida sittningarna 30 min.`,
      bookingIds: [],
      time: toTime(slot),
    });
  }

  return out.sort((a, b) => (a.severity === b.severity ? a.time.localeCompare(b.time) : a.severity === "hög" ? -1 : 1));
}

/* --- Bästa bord och zon -------------------------------------------------- */

export type TableSuggestion = {
  table: TableUnit;
  score: number;
  reasons: string[];
};

/** Poängsätter lediga bord för en bokning: passform, zon och tillfälle. */
export function bestTables(
  booking: Booking,
  bookings: Booking[],
  units: TableUnit[],
  atTime?: string,
): TableSuggestion[] {
  const wantsQuiet =
    booking.tags.includes("VIP") ||
    /bröllop|födelsedag|jubileum|frieri|årsdag/i.test(`${booking.occasion ?? ""} ${booking.note ?? ""}`);
  const isGroup = booking.party >= 8;

  return freeTablesFor(booking, bookings, units, atTime)
    .filter((u) => u.seats >= booking.party)
    .map((table) => {
      const reasons: string[] = [];
      let score = 100;

      const slack = table.seats - booking.party;
      score -= slack * 9;
      if (slack === 0) reasons.push("Exakt passform");
      else if (slack <= 1) reasons.push("Minimalt spill");
      else reasons.push(`${slack} platser över`);

      const zone = table.zone.toLowerCase();
      if (wantsQuiet && /fönster|lounge|separé|matsal|terrass/.test(zone)) {
        score += 14;
        reasons.push(`Lugn zon (${table.zone}) passar tillfället`);
      }
      if (isGroup && /separé|sällskap|matsal|balkong/.test(zone)) {
        score += 12;
        reasons.push("Zon som klarar stora sällskap");
      }
      if (isGroup && /bar|entré/.test(zone)) {
        score -= 16;
        reasons.push("Livlig zon — mindre lämplig för sällskap");
      }
      if (booking.tags.includes("Barnvagn") && /entré|matsal/.test(zone)) {
        score += 6;
        reasons.push("Lätt att nå med barnvagn");
      }
      if (table.status === "ledigt") score += 6;
      if (table.status === "städas") {
        score -= 10;
        reasons.push("Behöver städas först");
      }

      return { table, score: Math.max(0, Math.round(score)), reasons };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

/* --- Alternativa tider --------------------------------------------------- */

export type TimeSuggestion = {
  time: string;
  freeTables: number;
  label: string;
};

/** Tider ±60 min där kapaciteten är bättre än vid önskad tid. */
export function betterTimes(
  booking: Booking,
  bookings: Booking[],
  units: TableUnit[],
  windowMin = 60,
): TimeSuggestion[] {
  const base = toMinutes(booking.time);
  const fitting = (time: string) =>
    freeTablesFor(booking, bookings, units, time).filter((u) => u.seats >= booking.party).length;
  const current = fitting(booking.time);

  const out: TimeSuggestion[] = [];
  for (let delta = -windowMin; delta <= windowMin; delta += 15) {
    if (delta === 0) continue;
    const time = toTime(base + delta);
    const free = fitting(time);
    if (free <= current) continue;
    out.push({
      time,
      freeTables: free,
      label: `${delta > 0 ? "+" : ""}${delta} min · ${free} passande bord lediga`,
    });
  }
  return out.sort((a, b) => b.freeTables - a.freeTables).slice(0, 3);
}

/* --- Bemanning ----------------------------------------------------------- */

export type StaffingSlot = {
  time: string;
  covers: number;
  arrivals: number;
  servers: number;
  kitchen: number;
  host: number;
  note?: string;
};

/**
 * Bemanningsförslag per timme: en servis per 14 sittande gäster,
 * kök efter kuvert och en extra värd vid ankomsttoppar.
 */
export function staffingPlan(bookings: Booking[]): StaffingSlot[] {
  const list = bookings.filter(active);
  if (list.length === 0) return [];

  const starts = list.map((b) => toMinutes(b.time));
  const first = Math.min(...starts) - (Math.min(...starts) % 60);
  const last = Math.max(...list.map((b) => span(b).end));

  const slots: StaffingSlot[] = [];
  for (let t = first; t < last; t += 60) {
    const inHouse = list.filter((b) => {
      const s = span(b);
      return s.start < t + 60 && s.end > t;
    });
    const covers = inHouse.reduce((sum, b) => sum + b.party, 0);
    const arrivals = list.filter((b) => toMinutes(b.time) >= t && toMinutes(b.time) < t + 60).length;
    if (covers === 0 && arrivals === 0) continue;

    const servers = Math.max(1, Math.ceil(covers / 14));
    const kitchen = Math.max(1, Math.ceil(covers / 22));
    const host = arrivals >= 6 ? 2 : 1;

    slots.push({
      time: toTime(t),
      covers,
      arrivals,
      servers,
      kitchen,
      host,
      ...(arrivals >= 6
        ? { note: `${arrivals} ankomster på en timme — extra värd i entrén` }
        : covers >= 60
          ? { note: "Hög beläggning — håll en runner på golvet" }
          : {}),
    });
  }
  return slots;
}

export function staffingPeak(slots: StaffingSlot[]) {
  return slots.reduce<StaffingSlot | null>(
    (peak, slot) => (!peak || slot.covers > peak.covers ? slot : peak),
    null,
  );
}
