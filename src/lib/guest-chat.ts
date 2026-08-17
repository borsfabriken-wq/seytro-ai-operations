/**
 * Gästchatt — direktmeddelanden mellan gäst och restaurang, kopplade till bokningen.
 * AI:n läser inkommande meddelanden, föreslår/skickar svar och noterar saker i bokningen.
 */

export type ChatAuthor = "gäst" | "personal" | "ai" | "system";

export type ChatEntry = {
  id: string;
  author: ChatAuthor;
  text: string;
  time: string;
  /** Systemhändelse i bokningen, t.ex. "Bokning inlagd" */
  event?: string;
};

export type ChatThread = {
  id: string;
  guest: string;
  ref: string;
  bookingId?: string;
  party: number;
  date: string;
  time: string;
  channel: "Chatt" | "SMS" | "Webb";
  status: "aktiv" | "obesvarad" | "stängd";
  updated: string;
  aiAuto: boolean;
  /** Noteringar AI:n lagt i bokningen från chatten */
  notes: string[];
  entries: ChatEntry[];
};

const STORE_KEY = "seytro-guest-chat";

export const seedThreads: ChatThread[] = [
  {
    id: "c1",
    guest: "Malin Arvidsson",
    ref: "68475176",
    bookingId: "b3",
    party: 4,
    date: "17 aug 2026",
    time: "18:30",
    channel: "Chatt",
    status: "aktiv",
    updated: "3 tim",
    aiAuto: true,
    notes: ["2 gäster med celiaki — glutenfritt", "Längd ändrad 2h 30m"],
    entries: [
      { id: "e1", author: "system", text: "Bokning inlagd", time: "06:58", event: "Bokning" },
      { id: "e2", author: "gäst", text: "Hej! Vi är 2 personer i sällskapet med celiaki, går det bra?", time: "10:39" },
      {
        id: "e3",
        author: "ai",
        text: "Hej Malin! Absolut — vi har glutenfria alternativ på hela menyn. Jag har noterat celiaki på er bokning så köket är förberett.",
        time: "10:40",
      },
      { id: "e4", author: "system", text: "AI noterade allergi i bokningen", time: "10:40", event: "Notering" },
      { id: "e5", author: "gäst", text: "Perfekt, tack! Kan vi sitta lite avskilt?", time: "11:01" },
    ],
  },
  {
    id: "c2",
    guest: "Felix Kågelius",
    ref: "68417225",
    party: 3,
    date: "18 aug 2026",
    time: "12:00",
    channel: "Chatt",
    status: "obesvarad",
    updated: "2 dagar",
    aiAuto: false,
    notes: ["Rullstol i sällskapet"],
    entries: [
      { id: "e1", author: "system", text: "Bokning inlagd", time: "09:12", event: "Bokning" },
      { id: "e2", author: "gäst", text: "En i sällskapet har rullstol, finns det plats vid entrén?", time: "09:20" },
    ],
  },
  {
    id: "c3",
    guest: "Semra Baykal",
    ref: "68436761",
    party: 2,
    date: "15 aug 2026",
    time: "20:15",
    channel: "SMS",
    status: "aktiv",
    updated: "1 dag",
    aiAuto: true,
    notes: [],
    entries: [
      { id: "e1", author: "gäst", text: "Hej, kan vi flytta till 20:45 istället?", time: "17:02" },
      {
        id: "e2",
        author: "ai",
        text: "Hej Semra! 20:45 fungerar fint — jag har flyttat er bokning och skickat ny bekräftelse.",
        time: "17:02",
      },
      { id: "e3", author: "system", text: "Tid ändrad 20:15 → 20:45", time: "17:02", event: "Ändring" },
      { id: "e4", author: "gäst", text: "Hej, yes fixar det!", time: "17:05" },
    ],
  },
  {
    id: "c4",
    guest: "Nordea Corporate",
    ref: "67544225",
    party: 24,
    date: "3 sep 2026",
    time: "18:00",
    channel: "Webb",
    status: "obesvarad",
    updated: "5 dagar",
    aiAuto: false,
    notes: ["Stort sällskap — kräver PM"],
    entries: [
      { id: "e1", author: "gäst", text: "Kan ni ta 24 personer den 3 september? Vi vill ha fast meny och dryckespaket.", time: "14:22" },
      {
        id: "e2",
        author: "ai",
        text: "Hej! 24 personer går bra den 3 september. Jag har skapat ett PM-utkast med förslag på 3-rätters meny och dryckespaket — vill ni att jag skickar det?",
        time: "14:23",
      },
    ],
  },
];

type Intent = {
  match: RegExp;
  reply: (guest: string) => string;
  note?: string;
  event?: string;
};

const intents: Intent[] = [
  {
    match: /allerg|gluten|celiak|laktos|nöt|vegan|vegetar/i,
    reply: (g) =>
      `Hej ${g}! Det ordnar vi — köket får informationen direkt och vi anpassar rätterna. Jag har noterat kostönskemålet på er bokning.`,
    note: "Kostönskemål/allergi noterad av AI",
    event: "AI noterade allergi i bokningen",
  },
  {
    match: /flytta|ändra tid|senare|tidigare|kl\s?\d{2}/i,
    reply: (g) =>
      `Hej ${g}! Jag kollar tillgängligheten — vi har plats i det nya tidsfönstret och jag skickar en uppdaterad bekräftelse så snart det är justerat.`,
    note: "Önskar ändra tid",
    event: "AI flaggade tidsändring",
  },
  {
    match: /(\d+)\s*(personer|pers|gäster)|blir fler|blir färre/i,
    reply: (g) =>
      `Hej ${g}! Tack för uppdateringen — jag har justerat antalet gäster i bokningen och sett över bordsplaceringen.`,
    note: "Ändrat antal gäster",
    event: "AI uppdaterade antal gäster",
  },
  {
    match: /parker|hitta|adress|vägbeskriv/i,
    reply: (g) =>
      `Hej ${g}! Vi ligger centralt och närmaste parkeringshus är cirka två minuters promenad bort. Säg till om ni vill ha en karta skickad.`,
  },
  {
    match: /avboka|ställa in|kan inte komma/i,
    reply: (g) =>
      `Hej ${g}! Inga problem, jag har markerat bokningen för avbokning. Hör gärna av er när ni vill boka om — vi håller kvar era preferenser.`,
    note: "Vill avboka",
    event: "AI flaggade avbokning",
  },
  {
    match: /barn|barnstol|hög stol|rullstol|tillgänglig/i,
    reply: (g) =>
      `Hej ${g}! Det fixar vi — jag har lagt till önskemålet på bokningen så att bordet förbereds innan ni kommer.`,
    note: "Särskilt behov vid bordet",
    event: "AI noterade särskilt behov",
  },
  {
    match: /meny|vin|dryck|paket|pris/i,
    reply: (g) =>
      `Hej ${g}! Vi har både à la carte och fasta menyer med matchande dryckespaket. Jag skickar gärna aktuella alternativ direkt här i chatten.`,
    note: "Frågar om meny/dryck",
  },
  {
    match: /fönster|avskilt|bord vid|uteserver/i,
    reply: (g) =>
      `Hej ${g}! Jag har lagt in bordsönskemålet på bokningen — vi gör vårt bästa att lösa det utifrån salsplanen den kvällen.`,
    note: "Bordsönskemål",
    event: "AI noterade bordsönskemål",
  },
];

export type AiSuggestion = { reply: string; note?: string; event?: string; intent: string };

/** AI:ns förslag på svar utifrån gästens senaste meddelande. */
export function suggestReply(thread: ChatThread): AiSuggestion {
  const lastGuest = [...thread.entries].reverse().find((e) => e.author === "gäst");
  const text = lastGuest?.text ?? "";
  const hit = intents.find((i) => i.match.test(text));
  const first = thread.guest.split(" ")[0] ?? thread.guest;
  if (!hit) {
    return {
      reply: `Hej ${first}! Tack för ditt meddelande — vi har tagit emot det och återkommer inom kort. Vill du lägga till något inför besöket svarar du bara här.`,
      intent: "Allmän fråga",
    };
  }
  return {
    reply: hit.reply(first),
    ...(hit.note ? { note: hit.note } : {}),
    ...(hit.event ? { event: hit.event } : {}),
    intent: hit.note ?? "Fråga",
  };
}

export function nowTime() {
  return new Date().toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });
}

export function readThreads(): ChatThread[] {
  if (typeof window === "undefined") return seedThreads;
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as ChatThread[]) : seedThreads;
  } catch {
    return seedThreads;
  }
}

export function writeThreads(threads: ChatThread[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(threads));
  } catch {
    /* ignore */
  }
}

export function unreadCount(threads: ChatThread[]) {
  return threads.filter((t) => t.status === "obesvarad").length;
}
