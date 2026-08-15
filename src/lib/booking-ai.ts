import type { Booking, TableUnit } from "@/lib/dashboard-data";
import type { WaitlistEntry } from "@/lib/ops-data";

/* ============================================================
 * Deterministisk AI-logik för bokningsdashboarden.
 * Reglerna körs mot demodata och ger samma svar varje gång.
 * ============================================================ */

export type RiskLevel = "låg" | "medel" | "hög";

export type RiskAssessment = {
  level: RiskLevel;
  score: number;
  reasons: string[];
  action?: string;
};

/** No-show-risk utifrån kanal, storlek, status och historik. */
export function assessRisk(booking: Booking): RiskAssessment {
  let score = 8;
  const reasons: string[] = [];

  if (booking.status === "väntar") {
    score += 26;
    reasons.push("Ej bekräftad av gästen");
  }
  if (!booking.phone && !booking.email) {
    score += 22;
    reasons.push("Saknar kontaktuppgifter");
  }
  if (booking.party >= 8) {
    score += 14;
    reasons.push("Stort sällskap");
  }
  if (booking.source === "Webb") {
    score += 10;
    reasons.push("Bokad online utan personlig kontakt");
  }
  if (booking.source === "Röstagent" || booking.source === "Telefon") {
    score -= 6;
  }
  if (booking.tags.includes("VIP") || booking.tags.includes("Återkommande")) {
    score -= 14;
    reasons.push("Känd gäst med god historik");
  }
  if (booking.status === "anlänt") {
    score = 0;
    reasons.length = 0;
    reasons.push("Gästen är på plats");
  }
  const hour = Number(booking.time.slice(0, 2));
  if (hour >= 21) {
    score += 8;
    reasons.push("Sen sittning");
  }

  score = Math.max(0, Math.min(99, score));
  const level: RiskLevel = score >= 45 ? "hög" : score >= 22 ? "medel" : "låg";
  const action =
    level === "hög"
      ? "AI skickar bekräftelse nu och ringer om 2 timmar vid uteblivet svar"
      : level === "medel"
        ? "AI skickar påminnelse 4 timmar innan"
        : undefined;

  return { level, score, reasons, action };
}

export const riskStyles: Record<RiskLevel, string> = {
  låg: "border-status-free-border bg-status-free text-status-free-fg",
  medel: "border-status-clean-border bg-status-clean text-status-clean-fg",
  hög: "border-status-alert-border bg-status-alert text-status-alert-fg",
};

export type MoveSuggestion = {
  id: string;
  bookingId: string;
  guest: string;
  party: number;
  time: string;
  from: string;
  to: string;
  reason: string;
  gain: number;
};

function seatsOf(units: TableUnit[], label: string) {
  return units.find((u) => u.label === label)?.seats ?? 0;
}

/**
 * Förslag på omplaceringar: flytta små sällskap från stora bord
 * till minsta möjliga bord, så att stora bord frigörs.
 * Låsta bord rörs aldrig.
 */
export function suggestMoves(bookings: Booking[], units: TableUnit[]): MoveSuggestion[] {
  const taken = new Set(bookings.filter((b) => b.placed && b.table).map((b) => b.table));
  const out: MoveSuggestion[] = [];

  for (const b of bookings) {
    if (!b.placed || !b.table || b.lockedTable) continue;
    if (b.status === "avbokad" || b.status === "anlänt") continue;
    const current = seatsOf(units, b.table);
    if (!current || current - b.party < 2) continue;

    const candidate = units
      .filter((u) => u.seats >= b.party && u.seats < current && !taken.has(u.label))
      .sort((a, c) => a.seats - c.seats)[0];
    if (!candidate) continue;

    taken.delete(b.table);
    taken.add(candidate.label);
    out.push({
      id: `mv-${b.id}`,
      bookingId: b.id,
      guest: b.name,
      party: b.party,
      time: b.time,
      from: b.table,
      to: candidate.label,
      reason: `${b.party} gäster på ${current} platser — bord ${b.table} frigörs för större sällskap`,
      gain: current - candidate.seats,
    });
  }

  return out;
}

/** Sällskap som väntar på placering och de bord som faktiskt räcker. */
export function unplacedWithOptions(bookings: Booking[], units: TableUnit[]) {
  const taken = new Set(bookings.filter((b) => b.placed && b.table).map((b) => b.table));
  return bookings
    .filter((b) => !b.placed && b.status !== "avbokad")
    .map((b) => ({
      booking: b,
      options: units
        .filter((u) => !taken.has(u.label) && u.seats >= b.party)
        .sort((a, c) => a.seats - c.seats)
        .slice(0, 3),
    }));
}

export type WaitlistMatch = {
  entry: WaitlistEntry;
  table: string;
  time: string;
  seats: number;
};

/** Matchar väntande gäster mot bord som blivit lediga (avbokningar). */
export function matchWaitlist(
  waitlist: WaitlistEntry[],
  bookings: Booking[],
  units: TableUnit[],
): WaitlistMatch[] {
  const freed = bookings
    .filter((b) => b.status === "avbokad" && b.table)
    .map((b) => ({ table: b.table, time: b.time, seats: seatsOf(units, b.table) }));
  const free = units
    .filter((u) => u.status === "ledigt")
    .map((u) => ({ table: u.label, time: "", seats: u.seats }));
  const pool = [...freed, ...free];
  const used = new Set<string>();
  const out: WaitlistMatch[] = [];

  for (const entry of waitlist.filter((w) => w.status === "väntar")) {
    const slot = pool
      .filter((p) => !used.has(p.table) && p.seats >= entry.party)
      .sort((a, b) => a.seats - b.seats)[0];
    if (!slot) continue;
    used.add(slot.table);
    out.push({
      entry,
      table: slot.table,
      time: slot.time || entry.wanted,
      seats: slot.seats,
    });
  }
  return out;
}
