export type Venue = "restaurang" | "hotell";

export type BookingStatus = "bekräftad" | "väntar" | "anlänt" | "avbokad";
export type BookingSource = "Röstagent" | "E-postconcierge" | "Webb" | "Telefon" | "Walk-in";

export type Booking = {
  id: string;
  time: string;
  name: string;
  party: number;
  nights?: number;
  table: string;
  status: BookingStatus;
  source: BookingSource;
  note?: string;
  tags: string[];
  /** false = ej placerad på salsplanen */
  placed?: boolean;
  /** true = AI får inte flytta bokningen vid optimering */
  lockedTable?: boolean;
  end?: string;
  /** Gästdata — samlas in vid varje bokning */
  phone?: string;
  email?: string;
  company?: string;
  occasion?: string;
  consent?: boolean;
  /** Kopplat PM (förbeställning med fasta menyer) */
  pmId?: string;
};

/** Lunch- eller middagspass utifrån starttid. */
export type ServicePeriod = "lunch" | "middag";

export function serviceOf(time: string): ServicePeriod {
  return Number(time.slice(0, 2)) < 16 ? "lunch" : "middag";
}

export const servicePeriods: { id: ServicePeriod; label: string; span: string }[] = [
  { id: "lunch", label: "Lunch", span: "11:00–15:00" },
  { id: "middag", label: "Middag", span: "17:00–23:00" },
];

export type Guest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  visits: number;
  spend: number;
  last: string;
  tags: string[];
};

export type Message = {
  id: string;
  channel: "Samtal" | "E-post" | "SMS";
  from: string;
  preview: string;
  time: string;
  handled: boolean;
  intent: string;
};

export type TableUnit = {
  id: string;
  label: string;
  seats: number;
  status: "ledigt" | "dukat" | "upptaget" | "städas";
  guest?: string;
  until?: string;
  zone: string;
  /** Position i procent på salsplanen (endast restaurang) */
  x?: number;
  y?: number;
  shape?: "rund" | "fyrkant" | "avlang";
};

type VenueData = {
  label: string;
  unitWord: string;
  kpis: { label: string; value: string; delta: string; hint: string }[];
  bookings: Booking[];
  units: TableUnit[];
  guests: Guest[];
  messages: Message[];
  occupancy: { label: string; value: number }[];
  channels: { label: string; value: number }[];
};

export const dashboardData: Record<Venue, VenueData> = {
  restaurang: {
    label: "Brasserie Astrid",
    unitWord: "Bord",
    kpis: [
      { label: "Täckningar idag", value: "182", delta: "+12%", hint: "mot förra torsdagen" },
      { label: "Beläggning kväll", value: "94%", delta: "+6 p.e.", hint: "18:00–22:00" },
      { label: "Besvarade samtal", value: "100%", delta: "43 st", hint: "varav 38 av röstagenten" },
      { label: "No-show", value: "1,8%", delta: "−2,4 p.e.", hint: "efter automatisk bekräftelse" },
    ],
    bookings: [
      { id: "l1", time: "11:30", end: "12:45", name: "Elin Sandberg", party: 2, table: "2", status: "anlänt", source: "Webb", tags: ["Snabb lunch"], placed: true, phone: "+46 70 445 12 09", email: "elin.sandberg@mail.se", consent: true },
      { id: "l2", time: "12:00", end: "13:15", name: "Bolander & Co", party: 6, table: "15", status: "bekräftad", source: "E-postconcierge", note: "Affärslunch, samlad nota", tags: ["Företag"], placed: true, company: "Bolander & Co", email: "kontor@bolander.se", consent: true },
      { id: "l3", time: "12:15", end: "13:30", name: "Karin Nyström", party: 3, table: "11", status: "bekräftad", source: "Röstagent", note: "Laktosfritt", tags: ["Allergi"], placed: true, phone: "+46 76 221 88 41" },
      { id: "l4", time: "12:30", end: "13:45", name: "Oskar Vinge", party: 2, table: "", status: "väntar", source: "Telefon", tags: [], placed: false, phone: "+46 73 909 44 12" },
      { id: "l5", time: "13:00", end: "14:15", name: "Team Ramblas", party: 8, table: "", status: "bekräftad", source: "Röstagent", note: "Dagens lunch x8, klara 14:15", tags: ["Sällskap", "Företag"], placed: false, company: "Ramblas AB" },
      { id: "l6", time: "13:30", end: "14:30", name: "Lisa Ahl", party: 2, table: "25", status: "bekräftad", source: "Webb", tags: ["Uteservering"], placed: true, email: "lisa.ahl@mail.se", consent: true },
      { id: "b1", time: "17:00", end: "19:00", name: "Familjen Lindqvist", party: 4, table: "12", status: "anlänt", source: "Webb", tags: ["Fönsterbord"], placed: true, phone: "+46 70 331 20 15", consent: true },
      { id: "b2", time: "17:30", end: "19:30", name: "Marcus Ehn", party: 2, table: "5", status: "bekräftad", source: "Röstagent", note: "Firar årsdag", tags: ["VIP", "Årsdag"], placed: true },
      { id: "b3", time: "18:00", end: "21:00", name: "Nordea Corporate", party: 10, table: "20–21", status: "bekräftad", source: "E-postconcierge", note: "Faktura, meny 3", tags: ["Företag", "PM"], placed: true, pmId: "pm2", email: "events@nordea.se", company: "Nordea", consent: true },
      { id: "b13", time: "18:30", end: "22:00", name: "Stockholms Handelskammare", party: 13, table: "", status: "bekräftad", source: "E-postconcierge", note: "Förbeställt: 12 × Meny 2 kött, 1 × Meny 2 fisk, fördrink, snacks och vinpaket. Faktura.", tags: ["Företag", "PM", "Sällskap"], placed: false, pmId: "pm1", email: "invoice@stockholmshandelskammare.se", company: "Stockholms Handelskammare Service AB", occasion: "Affärsmiddag", consent: true },
      { id: "b4", time: "18:15", end: "20:15", name: "Sara Holmberg", party: 3, table: "8", status: "väntar", source: "Röstagent", note: "Glutenallergi", tags: ["Allergi"], placed: true },
      { id: "b5", time: "19:00", end: "21:00", name: "Petter Ask", party: 2, table: "3", status: "bekräftad", source: "Telefon", tags: [], placed: true },
      { id: "b6", time: "19:30", end: "21:30", name: "Anna Wiklund", party: 6, table: "15", status: "bekräftad", source: "Webb", note: "Barnstol x1", tags: ["Barn"], placed: true },
      { id: "b7", time: "20:00", end: "22:00", name: "Jonas Rehn", party: 2, table: "7", status: "väntar", source: "E-postconcierge", tags: ["Återkommande"], placed: true },
      { id: "b8", time: "20:30", end: "22:30", name: "Klara Sjögren", party: 4, table: "11", status: "avbokad", source: "Webb", tags: [], placed: false },
      { id: "b9", time: "21:00", end: "23:00", name: "Team Melanders", party: 8, table: "22", status: "bekräftad", source: "Röstagent", tags: ["Sen sittning"], placed: true },
      { id: "b10", time: "18:30", end: "20:30", name: "Tove Stenquist", party: 9, table: "", status: "väntar", source: "Röstagent", note: "Vanlig middag", tags: ["Sällskap"], placed: false },
      { id: "b11", time: "19:15", end: "21:15", name: "Marcus Rosander", party: 10, table: "", status: "bekräftad", source: "E-postconcierge", note: "Väntar på bordsplacering", tags: ["Företag"], placed: false },
      { id: "b12", time: "20:45", end: "22:45", name: "Vendela Lundberg", party: 5, table: "", status: "väntar", source: "Webb", tags: [], placed: false },
    ],
    units: [
      { id: "t1", label: "1", seats: 2, status: "upptaget", guest: "Ek", until: "19:15", zone: "Matsalen", x: 5, y: 6, shape: "fyrkant" },
      { id: "t2", label: "2", seats: 2, status: "ledigt", zone: "Matsalen", x: 5, y: 14, shape: "fyrkant" },
      { id: "t3", label: "3", seats: 2, status: "upptaget", guest: "Petter Ask", until: "21:00", zone: "Matsalen", x: 5, y: 22, shape: "fyrkant" },
      { id: "t4", label: "4", seats: 2, status: "ledigt", zone: "Matsalen", x: 5, y: 30, shape: "fyrkant" },
      { id: "t5", label: "5", seats: 2, status: "upptaget", guest: "Marcus Ehn", until: "19:30", zone: "Matsalen", x: 5, y: 38, shape: "fyrkant" },
      { id: "t6", label: "6", seats: 2, status: "ledigt", zone: "Matsalen", x: 5, y: 46, shape: "fyrkant" },
      { id: "t7", label: "7", seats: 2, status: "ledigt", zone: "Matsalen", x: 5, y: 54, shape: "fyrkant" },
      { id: "t8", label: "8", seats: 2, status: "upptaget", guest: "Sara Holmberg", until: "20:15", zone: "Matsalen", x: 5, y: 62, shape: "fyrkant" },
      { id: "t11", label: "11", seats: 4, status: "ledigt", zone: "Bar", x: 20, y: 22, shape: "fyrkant" },
      { id: "t12", label: "12", seats: 4, status: "upptaget", guest: "Familjen Lindqvist", until: "19:00", zone: "Bar", x: 26, y: 22, shape: "fyrkant" },
      { id: "t9", label: "9", seats: 2, status: "ledigt", zone: "Bar", x: 20, y: 40, shape: "fyrkant" },
      { id: "t10", label: "10", seats: 2, status: "upptaget", guest: "Holm", until: "19:00", zone: "Bar", x: 26, y: 40, shape: "fyrkant" },
      { id: "bar", label: "BAR", seats: 18, status: "ledigt", zone: "Bar", x: 41, y: 30, shape: "bar" },
      { id: "t200", label: "200", seats: 2, status: "ledigt", zone: "Lounge", x: 50, y: 8, shape: "lounge" },
      { id: "t201", label: "201", seats: 2, status: "ledigt", zone: "Lounge", x: 54, y: 5, shape: "lounge" },
      { id: "t202", label: "202", seats: 2, status: "ledigt", zone: "Lounge", x: 58, y: 3, shape: "lounge" },
      { id: "t203", label: "203", seats: 2, status: "ledigt", zone: "Lounge", x: 62, y: 3, shape: "lounge" },
      { id: "t204", label: "204", seats: 2, status: "ledigt", zone: "Lounge", x: 66, y: 4, shape: "lounge" },
      { id: "t205", label: "205", seats: 2, status: "ledigt", zone: "Lounge", x: 70, y: 6, shape: "lounge" },
      { id: "t206", label: "206", seats: 2, status: "ledigt", zone: "Lounge", x: 70, y: 11, shape: "lounge" },
      { id: "t207", label: "207", seats: 2, status: "ledigt", zone: "Lounge", x: 79, y: 13, shape: "lounge" },
      { id: "t208", label: "208", seats: 2, status: "ledigt", zone: "Lounge", x: 81, y: 20, shape: "lounge" },
      { id: "t209", label: "209", seats: 2, status: "ledigt", zone: "Lounge", x: 81, y: 30, shape: "lounge" },
      { id: "t21", label: "21", seats: 2, status: "ledigt", zone: "Matsalen", x: 22, y: 56, shape: "fyrkant" },
      { id: "t20", label: "20", seats: 2, status: "upptaget", guest: "Nordea", until: "21:00", zone: "Matsalen", x: 22, y: 63, shape: "fyrkant" },
      { id: "t23", label: "23", seats: 2, status: "ledigt", zone: "Matsalen", x: 30, y: 56, shape: "fyrkant" },
      { id: "t22", label: "22", seats: 2, status: "upptaget", guest: "Melanders", until: "23:00", zone: "Matsalen", x: 30, y: 63, shape: "fyrkant" },
      { id: "t25", label: "25", seats: 2, status: "upptaget", guest: "Lisa Ahl", until: "14:30", zone: "Matsalen", x: 38, y: 56, shape: "fyrkant" },
      { id: "t24", label: "24", seats: 2, status: "ledigt", zone: "Matsalen", x: 38, y: 63, shape: "fyrkant" },
      { id: "t28", label: "28", seats: 2, status: "ledigt", zone: "Matsalen", x: 50, y: 56, shape: "fyrkant" },
      { id: "t27", label: "27", seats: 2, status: "ledigt", zone: "Matsalen", x: 50, y: 63, shape: "fyrkant" },
      { id: "t26", label: "26", seats: 2, status: "ledigt", zone: "Matsalen", x: 44, y: 62, shape: "fyrkant" },
      { id: "t100", label: "100", seats: 8, status: "ledigt", zone: "Matsalen", x: 22, y: 76, shape: "rund" },
      { id: "t30", label: "30", seats: 6, status: "upptaget", guest: "Ahl", until: "20:00", zone: "Matsalen", x: 32, y: 76, shape: "rund" },
      { id: "t31", label: "31", seats: 7, status: "ledigt", zone: "Matsalen", x: 40, y: 76, shape: "rund" },
      { id: "t32", label: "32", seats: 6, status: "upptaget", guest: "Wallgren", until: "19:30", zone: "Matsalen", x: 48, y: 76, shape: "rund" },
      { id: "t33", label: "33", seats: 6, status: "ledigt", zone: "Matsalen", x: 56, y: 76, shape: "rund" },
      { id: "t34", label: "34", seats: 6, status: "upptaget", guest: "Anna Wiklund", until: "21:30", zone: "Matsalen", x: 64, y: 76, shape: "rund" },
      { id: "t73", label: "73", seats: 4, status: "ledigt", zone: "Fönster", x: 5, y: 74, shape: "fyrkant" },
      { id: "t72", label: "72", seats: 4, status: "ledigt", zone: "Fönster", x: 10, y: 74, shape: "fyrkant" },
      { id: "t71", label: "71", seats: 4, status: "ledigt", zone: "Fönster", x: 15, y: 74, shape: "fyrkant" },
      { id: "t70", label: "70", seats: 4, status: "ledigt", zone: "Fönster", x: 20, y: 74, shape: "fyrkant" },
      { id: "t74", label: "74", seats: 2, status: "ledigt", zone: "Fönster", x: 5, y: 86, shape: "fyrkant" },
      { id: "t75", label: "75", seats: 2, status: "ledigt", zone: "Fönster", x: 9, y: 88, shape: "fyrkant" },
      { id: "t76", label: "76", seats: 2, status: "ledigt", zone: "Fönster", x: 14, y: 90, shape: "fyrkant" },
      { id: "t77", label: "77", seats: 2, status: "ledigt", zone: "Fönster", x: 19, y: 92, shape: "fyrkant" },
      { id: "t40", label: "40", seats: 2, status: "ledigt", zone: "Uteservering", x: 32, y: 86, shape: "rund" },
      { id: "t41", label: "41", seats: 2, status: "ledigt", zone: "Uteservering", x: 37, y: 87, shape: "rund" },
      { id: "t42", label: "42", seats: 2, status: "ledigt", zone: "Uteservering", x: 42, y: 87, shape: "rund" },
      { id: "t43", label: "43", seats: 2, status: "ledigt", zone: "Uteservering", x: 47, y: 87, shape: "rund" },
      { id: "t44", label: "44", seats: 2, status: "ledigt", zone: "Uteservering", x: 52, y: 86, shape: "rund" },
      { id: "t45", label: "45", seats: 2, status: "ledigt", zone: "Uteservering", x: 62, y: 86, shape: "rund" },
      { id: "t50", label: "50", seats: 2, status: "ledigt", zone: "Uteservering", x: 34, y: 92, shape: "lounge" },
      { id: "t55", label: "55", seats: 2, status: "ledigt", zone: "Uteservering", x: 60, y: 92, shape: "lounge" },
      { id: "t60", label: "60", seats: 2, status: "ledigt", zone: "Uteservering", x: 30, y: 95, shape: "lounge" },
      { id: "t61", label: "61", seats: 2, status: "ledigt", zone: "Uteservering", x: 35, y: 96, shape: "lounge" },
      { id: "t62", label: "62", seats: 2, status: "ledigt", zone: "Uteservering", x: 40, y: 96, shape: "lounge" },
      { id: "t63", label: "63", seats: 2, status: "ledigt", zone: "Uteservering", x: 45, y: 97, shape: "lounge" },
      { id: "t64", label: "64", seats: 2, status: "ledigt", zone: "Uteservering", x: 51, y: 95, shape: "lounge" },
      { id: "t65", label: "65", seats: 2, status: "ledigt", zone: "Uteservering", x: 56, y: 94, shape: "lounge" },
      { id: "t66", label: "66", seats: 2, status: "ledigt", zone: "Uteservering", x: 61, y: 94, shape: "lounge" },
    guests: [
      { id: "g1", name: "Marcus Ehn", email: "marcus.ehn@mail.se", phone: "+46 70 118 22 40", visits: 14, spend: 21400, last: "12 aug 2026", tags: ["VIP", "Rödvin", "Fönsterbord"] },
      { id: "g2", name: "Anna Wiklund", email: "anna.w@mail.se", phone: "+46 73 442 09 11", visits: 6, spend: 8100, last: "28 jul 2026", tags: ["Barnfamilj"] },
      { id: "g3", name: "Nordea Corporate", email: "events@nordea.se", phone: "+46 8 614 70 00", visits: 9, spend: 64200, last: "5 aug 2026", tags: ["Företag", "Faktura"] },
      { id: "g4", name: "Sara Holmberg", email: "sara.holmberg@mail.se", phone: "+46 76 300 55 12", visits: 3, spend: 3950, last: "19 jun 2026", tags: ["Glutenallergi"] },
      { id: "g5", name: "Jonas Rehn", email: "jonas@rehn.co", phone: "+46 70 992 14 08", visits: 21, spend: 33800, last: "9 aug 2026", tags: ["Stamgäst", "Bar"] },
    ],
    messages: [
      { id: "m1", channel: "Samtal", from: "+46 70 118 22 40", preview: "Vill flytta bordet från 19:00 till 20:00 på fredag.", time: "för 4 min", handled: true, intent: "Ombokning" },
      { id: "m2", channel: "E-post", from: "events@nordea.se", preview: "Kan ni ta 24 personer den 3 september, meny och dryckespaket?", time: "för 22 min", handled: false, intent: "Sällskap" },
      { id: "m3", channel: "Samtal", from: "+46 76 300 55 12", preview: "Fråga om glutenfria alternativ till förrätterna.", time: "för 1 tim", handled: true, intent: "Allergi" },
      { id: "m4", channel: "SMS", from: "+46 73 442 09 11", preview: "Vi blir 6 istället för 5 ikväll.", time: "för 2 tim", handled: true, intent: "Ändring" },
      { id: "m5", channel: "E-post", from: "press@matmagasinet.se", preview: "Förfrågan om intervju med köksmästaren.", time: "idag 09:14", handled: false, intent: "Press" },
    ],
    occupancy: [
      { label: "Mån", value: 52 },
      { label: "Tis", value: 61 },
      { label: "Ons", value: 74 },
      { label: "Tors", value: 88 },
      { label: "Fre", value: 96 },
      { label: "Lör", value: 98 },
      { label: "Sön", value: 67 },
    ],
    channels: [
      { label: "Röstagent", value: 42 },
      { label: "E-postconcierge", value: 23 },
      { label: "Webb", value: 26 },
      { label: "Walk-in", value: 9 },
    ],
  },
  hotell: {
    label: "Hotell Astrid",
    unitWord: "Rum",
    kpis: [
      { label: "Beläggning", value: "91%", delta: "+8 p.e.", hint: "138 av 152 rum" },
      { label: "RevPAR", value: "2 140 kr", delta: "+11%", hint: "rullande 7 dagar" },
      { label: "Besvarade förfrågningar", value: "100%", delta: "87 st", hint: "dygnet runt" },
      { label: "Direktbokningar", value: "58%", delta: "+9 p.e.", hint: "lägre OTA-provision" },
    ],
    bookings: [
      { id: "h1", time: "14:00", name: "Elisabet Ohlsson", party: 2, nights: 3, table: "412 – Deluxe", status: "anlänt", source: "Webb", tags: ["Sen utcheckning"] },
      { id: "h2", time: "14:30", name: "Thomas Brandt", party: 1, nights: 1, table: "208 – Standard", status: "bekräftad", source: "Röstagent", note: "Tidig frukost 06:30", tags: ["Affärsresa"] },
      { id: "h3", time: "15:00", name: "Konferens Vinge", party: 18, nights: 2, table: "Flera rum", status: "bekräftad", source: "E-postconcierge", note: "Konferenspaket helpension", tags: ["Grupp"] },
      { id: "h4", time: "15:30", name: "Familjen Norell", party: 4, nights: 4, table: "306 – Svit", status: "väntar", source: "Webb", note: "Extrasäng barn", tags: ["Familj"] },
      { id: "h5", time: "16:00", name: "Yuki Tanaka", party: 2, nights: 2, table: "501 – Junior svit", status: "bekräftad", source: "Röstagent", tags: ["Engelska"] },
      { id: "h6", time: "17:00", name: "Per Sandell", party: 1, nights: 1, table: "115 – Standard", status: "avbokad", source: "Telefon", tags: [] },
      { id: "h7", time: "18:00", name: "Maria Kallio", party: 2, nights: 5, table: "410 – Deluxe", status: "bekräftad", source: "E-postconcierge", note: "Bord i restaurangen 20:00", tags: ["Kombibokning"] },
    ],
    units: [
      { id: "r1", label: "115", seats: 2, status: "ledigt", zone: "Plan 1" },
      { id: "r2", label: "118", seats: 2, status: "städas", zone: "Plan 1" },
      { id: "r3", label: "204", seats: 2, status: "upptaget", guest: "Sjöberg", until: "Fre", zone: "Plan 2" },
      { id: "r4", label: "208", seats: 1, status: "dukat", guest: "Thomas Brandt", until: "14:30", zone: "Plan 2" },
      { id: "r5", label: "212", seats: 2, status: "upptaget", guest: "Lund", until: "Lör", zone: "Plan 2" },
      { id: "r6", label: "306", seats: 4, status: "dukat", guest: "Norell", until: "15:30", zone: "Plan 3" },
      { id: "r7", label: "310", seats: 2, status: "ledigt", zone: "Plan 3" },
      { id: "r8", label: "410", seats: 2, status: "dukat", guest: "Maria Kallio", until: "18:00", zone: "Plan 4" },
      { id: "r9", label: "412", seats: 2, status: "upptaget", guest: "Ohlsson", until: "Sön", zone: "Plan 4" },
      { id: "r10", label: "418", seats: 2, status: "städas", zone: "Plan 4" },
      { id: "r11", label: "501", seats: 2, status: "dukat", guest: "Tanaka", until: "16:00", zone: "Plan 5" },
      { id: "r12", label: "505", seats: 4, status: "ledigt", zone: "Plan 5" },
    ],
    guests: [
      { id: "hg1", name: "Elisabet Ohlsson", email: "e.ohlsson@mail.se", phone: "+46 70 555 12 03", visits: 11, spend: 84300, last: "13 aug 2026", tags: ["VIP", "Högt våningsplan"] },
      { id: "hg2", name: "Vinge Advokatbyrå", email: "konferens@vinge.se", phone: "+46 8 614 30 00", visits: 7, spend: 412000, last: "2 aug 2026", tags: ["Konferens", "Avtalspris"] },
      { id: "hg3", name: "Yuki Tanaka", email: "yuki.tanaka@mail.jp", phone: "+81 90 1234 5678", visits: 2, spend: 19800, last: "13 aug 2026", tags: ["Engelska", "Sen ankomst"] },
      { id: "hg4", name: "Maria Kallio", email: "maria.kallio@mail.fi", phone: "+358 40 118 22 90", visits: 5, spend: 61200, last: "1 jul 2026", tags: ["Kombibokning"] },
      { id: "hg5", name: "Thomas Brandt", email: "t.brandt@consult.se", phone: "+46 73 900 44 21", visits: 28, spend: 152400, last: "11 aug 2026", tags: ["Affärsresenär", "Tidig frukost"] },
    ],
    messages: [
      { id: "hm1", channel: "Samtal", from: "+46 70 555 12 03", preview: "Önskar sen utcheckning till 15:00 på söndag.", time: "för 6 min", handled: true, intent: "Utcheckning" },
      { id: "hm2", channel: "E-post", from: "konferens@vinge.se", preview: "Behöver 22 rum och konferenslokal 14–15 oktober.", time: "för 35 min", handled: false, intent: "Grupp" },
      { id: "hm3", channel: "E-post", from: "yuki.tanaka@mail.jp", preview: "Arriving 23:40, is late check-in possible?", time: "för 1 tim", handled: true, intent: "Sen ankomst" },
      { id: "hm4", channel: "SMS", from: "+46 73 900 44 21", preview: "Kan jag få rum nära hissen igen?", time: "för 3 tim", handled: true, intent: "Rumsönskemål" },
      { id: "hm5", channel: "Samtal", from: "+358 40 118 22 90", preview: "Vill lägga till middag för två i restaurangen.", time: "idag 08:52", handled: false, intent: "Merförsäljning" },
    ],
    occupancy: [
      { label: "Mån", value: 78 },
      { label: "Tis", value: 84 },
      { label: "Ons", value: 91 },
      { label: "Tors", value: 93 },
      { label: "Fre", value: 88 },
      { label: "Lör", value: 97 },
      { label: "Sön", value: 71 },
    ],
    channels: [
      { label: "Direkt / webb", value: 38 },
      { label: "Röstagent", value: 20 },
      { label: "E-postconcierge", value: 17 },
      { label: "OTA", value: 25 },
    ],
  },
};

export const statusStyles: Record<BookingStatus, string> = {
  bekräftad: "bg-primary/10 text-primary",
  väntar: "bg-amber-500/15 text-amber-700",
  anlänt: "bg-emerald-500/15 text-emerald-700",
  avbokad: "bg-muted text-muted-foreground line-through",
};

export const unitStatusStyles: Record<TableUnit["status"], string> = {
  ledigt: "border-status-free-border bg-status-free text-status-free-fg",
  dukat: "border-status-set-border bg-status-set text-status-set-fg",
  upptaget: "border-status-busy-border bg-status-busy text-status-busy-fg",
  städas: "border-status-clean-border bg-status-clean text-status-clean-fg",
};

/** Funktionerna från Seytro för hotell, kopplade till dashboardens vyer. */
export const hotelFunctions: {
  title: string;
  body: string;
  metric: string;
  icon: "voice" | "mail" | "room" | "guest" | "analytics" | "campaign";
  to: string;
}[] = [
  {
    title: "Röstagent",
    body: "Svarar när receptionen är upptagen eller obemannad — incheckning, parkering, frukost och rumsönskemål.",
    metric: "43 samtal besvarade idag",
    icon: "voice",
    to: "/dashboard/inkorg",
  },
  {
    title: "E-postconcierge",
    body: "Grupp- och konferensförfrågningar, sena ankomster och specialönskemål besvaras direkt, dygnet runt.",
    metric: "2 förfrågningar väntar",
    icon: "mail",
    to: "/dashboard/inkorg",
  },
  {
    title: "Rumsplacering",
    body: "Automatisk rumstilldelning utifrån önskemål, vistelsens längd och beläggning — inga manuella pussel.",
    metric: "12 rum i drift idag",
    icon: "room",
    to: "/dashboard/salsplan",
  },
  {
    title: "Gästinsikt",
    body: "En gästprofil som följer med från bokning till incheckning: preferenser, allergier och tidigare vistelser.",
    metric: "5 profiler uppdaterade",
    icon: "guest",
    to: "/dashboard/gaster",
  },
  {
    title: "Analys",
    body: "Beläggning, RevPAR och kanalprestanda i klartext — utan att exportera rapporter.",
    metric: "91% beläggning",
    icon: "analytics",
    to: "/dashboard/analys",
  },
  {
    title: "Kampanjer",
    body: "Återaktivera tidigare gäster inför lågsäsong och fyll frukost- och middagspassen.",
    metric: "58% direktbokningar",
    icon: "campaign",
    to: "/dashboard/gaster",
  },
];

/** Löftena från hotellsidan, visade som resultatband i inloggat läge. */
export const hotelPromises: [string, string][] = [
  ["24/7", "gästservice på svenska och engelska"],
  ["100%", "besvarade samtal och mejl"],
  ["−41%", "tid i receptionens inkorg"],
  ["+18%", "bordsbokningar från rumsgäster"],
];
