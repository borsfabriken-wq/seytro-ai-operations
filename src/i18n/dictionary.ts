import { core } from "@/i18n/dict/core";
import { home } from "@/i18n/dict/home";
import { platform } from "@/i18n/dict/platform";
import { solutions } from "@/i18n/dict/solutions";
import { resources } from "@/i18n/dict/resources";
import { app } from "@/i18n/dict/app";

/** Swedish source string -> English translation. */
export const en: Record<string, string> = {
  ...core,
  ...home,
  ...platform,
  ...solutions,
  ...resources,
  ...app,
};

/**
 * Rules for dynamically composed strings (template literals) that can never
 * match the dictionary exactly. Applied in order to any string without an
 * exact hit; the result is used only if at least one rule matched.
 */
export const patterns: Array<[RegExp, string]> = [
  // sentences
  [/har bara (\d+) platser för (\d+) gäster/g, "has only $1 seats for $2 guests"],
  [/överlappar med (\d+) min turtid\./g, "overlap with a $1 min turn time."],
  [/(\d+) ankomster på en timme/g, "$1 arrivals in one hour"],
  [/extra värd i entrén/g, "extra host at the door"],
  [/sitter för trångt/g, "is seated too tightly"],
  [/är inte placerade\./g, "are not seated."],
  [/frigörs för större sällskap/g, "is freed up for larger parties"],
  [/AI föreslår att sprida sittningarna (\d+) min\./g, "AI suggests spreading seatings by $1 min."],
  [/har låst (bordet|rummet) och kan inte flyttas/g, "has locked the $1 and cannot be moved"],
  [/städklara · /g, "ready to clean · "],
  [/behöver städas\./g, "need cleaning."],
  [/är nu en bokning/g, "is now a booking"],
  [/avbokade kl /g, "cancelled at "],
  [/är ledigt igen/g, "is free again"],
  [/flyttades till /g, "was moved to "],
  [/för att frigöra kapacitet kl /g, "to free up capacity at "],
  [/tackade ja — bokningen är bekräftad på /g, "accepted — the booking is confirmed at "],
  [/inlagd av röstagenten/g, "added by the voice agent"],
  [/har 15 minuter på sig att svara\./g, "has 15 minutes to reply."],
  [/rum är belagda av totalt (\d+)\./g, "rooms are occupied out of $1."],
  [/rum är förberedda/g, "rooms are ready"],
  [/väntar bekräftelse\./g, "awaiting confirmation."],
  [/rum väntar på städ\./g, "rooms are waiting to be cleaned."],
  [/obekräftade/g, "unconfirmed"],
  [/i servis · /g, "on service · "],
  [/ i kök\b/g, " in the kitchen"],
  [/(\d+) bokningar/g, "$1 bookings"],
  [/(\d+) platser över/g, "$1 seats to spare"],
  [/Alternativ finns för /g, "Alternatives exist for "],
  [/Aviseringar/g, "Notifications"],
  [/Bokningar med (bords|rums)förslag/g, "Bookings with suggestions"],
  [/är dubbelbokat/g, "is double booked"],
  [/Flytta till bord /g, "Move to table "],
  [/^Flytta /g, "Move "],
  [/Förslag skickat till /g, "Suggestion sent to "],
  [/^Gå till /g, "Go to "],
  [/^Krock på /g, "Clash at "],
  [/Lugn zon \(([^)]+)\) passar tillfället/g, "Quiet zone ($1) suits the occasion"],
  [/^Lås /g, "Lock "],
  [/^Placera på /g, "Seat at "],
  [/^Placerad på /g, "Seated at "],
  [/^Ta bort /g, "Remove "],
  [/skickat till städ\./g, "sent for cleaning."],
  [/Välj (bord|rum) på planen…/g, "Pick a $1 on the plan…"],
  [/^från (\d+) pers/g, "from $1 people"],
  [/ per gäst/g, " per guest"],
  [/^Överbelastning kl /g, "Overload at "],
  [/placerad på /g, "seated at "],
  // fragments / units
  [/(\d+) gäster/g, "$1 guests"],
  [/(\d+) pers\b/g, "$1 people"],
  [/(\d+) platser/g, "$1 seats"],
  [/(\d+) nätter/g, "$1 nights"],
  [/(\d+) pl\b/g, "$1 seats"],
  [/\bönskar\b/g, "wants"],
  [/\bbord\b/g, "table"],
  [/\bBord\b/g, "Table"],
  [/\bRum\b/g, "Room"],
  [/\brum\b/g, "room"],
  [/\bmot\b/g, "vs"],
  [/\bkl\b/g, "at"],
  [/\bär låst\b/g, "is locked"],
  [/\bflytta\b/g, "move"],
  [/\bpå lunch\b/g, "at lunch"],
  [/\bpå middag\b/g, "at dinner"],
  [/\bpå kväll\b/g, "in the evening"],
];
