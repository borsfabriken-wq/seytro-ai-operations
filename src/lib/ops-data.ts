import type { Venue } from "@/lib/dashboard-data";

/* ============================================================
 * Kommunikation och drift — demodata för dashboardens nya vyer.
 * ============================================================ */

export type AiMode = "auto" | "utkast" | "av";

export type EmailMessage = {
  id: string;
  from: string;
  body: string;
  time: string;
  outgoing: boolean;
  ai?: boolean;
};

export type EmailThread = {
  id: string;
  subject: string;
  guest: string;
  address: string;
  time: string;
  unread: boolean;
  aiHandled: boolean;
  intent: string;
  messages: EmailMessage[];
};

export type CallRecord = {
  id: string;
  direction: "inkommande" | "utgående" | "missat";
  from: string;
  guest?: string;
  time: string;
  duration: string;
  intent: string;
  summary: string;
  outcome: string;
  transcript: { role: "AI" | "Gäst"; text: string }[];
};

export type Escalation = {
  id: string;
  title: string;
  guest: string;
  channel: "Samtal" | "E-post" | "SMS" | "Manuell";
  reason: string;
  detail: string;
  created: string;
  status: "kräver åtgärd" | "pågår" | "löst";
  priority: "hög" | "medel" | "låg";
};

export type WaitlistEntry = {
  id: string;
  name: string;
  phone: string;
  party: number;
  wanted: string;
  flexibility: string;
  created: string;
  status: "väntar" | "erbjuden" | "omvandlad" | "avbokad";
  note?: string;
  offer?: { time: string; table: string; expires: string };
};

export type OpsData = {
  emails: EmailThread[];
  calls: CallRecord[];
  escalations: Escalation[];
  waitlist: WaitlistEntry[];
};

const restaurang: OpsData = {
  emails: [
    {
      id: "e1",
      subject: "Bordsbokning fredag 21 augusti",
      guest: "Nordea Corporate",
      address: "events@nordea.se",
      time: "09:42",
      unread: true,
      aiHandled: true,
      intent: "Sällskap",
      messages: [
        {
          id: "e1m1",
          from: "events@nordea.se",
          time: "09:38",
          outgoing: false,
          body: "Hej! Kan ni ta 24 personer fredag den 21 augusti kl 19? Vi behöver meny och dryckespaket samt faktura.",
        },
        {
          id: "e1m2",
          from: "Seytro AI",
          time: "09:39",
          outgoing: true,
          ai: true,
          body: "Hej! Tack för er förfrågan. Vi har plats för 24 gäster fredag 21 augusti kl 19:00 i Sällskapsrummet. Jag bifogar Meny 2 (595 kr) och vinpaket (395 kr). Sällskap över 8 personer bekräftas av oss inom kort — vill ni att jag lägger en preliminär bokning?",
        },
        {
          id: "e1m3",
          from: "events@nordea.se",
          time: "09:41",
          outgoing: false,
          body: "Ja tack, lägg en preliminär bokning så återkommer vi med antal senast måndag.",
        },
      ],
    },
    {
      id: "e2",
      subject: "Påminnelse: er bokning ikväll 19:30",
      guest: "Anna Wiklund",
      address: "anna.w@mail.se",
      time: "08:15",
      unread: false,
      aiHandled: true,
      intent: "Påminnelse",
      messages: [
        {
          id: "e2m1",
          from: "Seytro AI",
          time: "08:15",
          outgoing: true,
          ai: true,
          body: "Hej Anna! Vi ser fram emot er ikväll kl 19:30, bord 15 för 6 personer. Svara JA för att bekräfta eller ring oss om något ändras.",
        },
        {
          id: "e2m2",
          from: "anna.w@mail.se",
          time: "08:22",
          outgoing: false,
          body: "JA — vi kommer! Kan vi få en barnstol?",
        },
        {
          id: "e2m3",
          from: "Seytro AI",
          time: "08:22",
          outgoing: true,
          ai: true,
          body: "Absolut, barnstol är noterad på bokningen. Vi ses ikväll!",
        },
      ],
    },
    {
      id: "e3",
      subject: "Intervju med köksmästaren",
      guest: "Matmagasinet",
      address: "press@matmagasinet.se",
      time: "igår 16:04",
      unread: true,
      aiHandled: false,
      intent: "Press",
      messages: [
        {
          id: "e3m1",
          from: "press@matmagasinet.se",
          time: "igår 16:04",
          outgoing: false,
          body: "Hej! Vi skriver ett reportage om nya höstmenyer och vill gärna intervjua er köksmästare. Har ni tid nästa vecka?",
        },
      ],
    },
    {
      id: "e4",
      subject: "Glutenfria alternativ",
      guest: "Sara Holmberg",
      address: "sara.holmberg@mail.se",
      time: "igår 11:30",
      unread: false,
      aiHandled: true,
      intent: "Allergi",
      messages: [
        {
          id: "e4m1",
          from: "sara.holmberg@mail.se",
          time: "igår 11:28",
          outgoing: false,
          body: "Hej, finns glutenfria förrätter?",
        },
        {
          id: "e4m2",
          from: "Seytro AI",
          time: "igår 11:30",
          outgoing: true,
          ai: true,
          body: "Hej Sara! Ja — tre av fyra förrätter går att göra glutenfria, och köket är informerat om din bokning 18:15. Allergin är noterad i systemet.",
        },
      ],
    },
  ],
  calls: [
    {
      id: "c1",
      direction: "inkommande",
      from: "+46 70 118 22 40",
      guest: "Marcus Ehn",
      time: "för 4 min",
      duration: "1:12",
      intent: "Ombokning",
      summary:
        "Gästen ville flytta sin bokning från 19:00 till 20:00 på fredag. AI bekräftade nytt bord och skickade SMS.",
      outcome: "Bokning flyttad till 20:00, bord 5",
      transcript: [
        { role: "AI", text: "Brasserie Astrid, du talar med Seytros bokningsassistent. Hur kan jag hjälpa till?" },
        { role: "Gäst", text: "Hej, jag har bokat på fredag klockan sju men skulle vilja flytta till åtta." },
        { role: "AI", text: "Absolut. Jag ser bokningen för två personer i Marcus Ehns namn. Klockan 20:00 fungerar bra — vill du att jag flyttar den?" },
        { role: "Gäst", text: "Ja tack." },
        { role: "AI", text: "Klart. Du får en bekräftelse via SMS inom en minut. Trevlig kväll!" },
      ],
    },
    {
      id: "c2",
      direction: "inkommande",
      from: "+46 76 300 55 12",
      guest: "Sara Holmberg",
      time: "för 1 tim",
      duration: "2:05",
      intent: "Allergi",
      summary: "Frågor om glutenfria förrätter. AI noterade allergin på bokningen och informerade köket.",
      outcome: "Allergi noterad på bokning b4",
      transcript: [
        { role: "AI", text: "Brasserie Astrid, hur kan jag hjälpa till?" },
        { role: "Gäst", text: "Jag har glutenallergi — går det att äta hos er?" },
        { role: "AI", text: "Ja, vi anpassar samtliga förrätter och tre varmrätter. Jag noterar allergin på din bokning klockan 18:15." },
      ],
    },
    {
      id: "c3",
      direction: "missat",
      from: "+46 73 909 44 12",
      time: "för 2 tim",
      duration: "—",
      intent: "Okänt",
      summary: "Samtal kom in under lunchruschen och besvarades inte av AI (linjen upptagen). Återuppringning föreslagen.",
      outcome: "Väntar på återuppringning",
      transcript: [],
    },
    {
      id: "c4",
      direction: "utgående",
      from: "+46 70 331 20 15",
      guest: "Familjen Lindqvist",
      time: "idag 10:02",
      duration: "0:48",
      intent: "Bekräftelse",
      summary: "AI ringde upp för att bekräfta kvällens bokning efter uteblivet SMS-svar. Gästen bekräftade.",
      outcome: "Bokning bekräftad",
      transcript: [
        { role: "AI", text: "Hej, det här är Brasserie Astrid. Jag ville bara bekräfta ert bord för fyra ikväll klockan 17." },
        { role: "Gäst", text: "Ja, vi kommer!" },
      ],
    },
  ],
  escalations: [
    {
      id: "x1",
      title: "Missnöjd med väntetid i lördags",
      guest: "Peter Ahlberg",
      channel: "E-post",
      reason: "Klagomål",
      detail:
        "Gästen fick vänta 25 minuter på sitt bord trots bokning. AI har bekräftat mottagandet men kompensation kräver beslut av restaurangchef.",
      created: "idag 08:44",
      status: "kräver åtgärd",
      priority: "hög",
    },
    {
      id: "x2",
      title: "Återuppringning — missat samtal under lunch",
      guest: "+46 73 909 44 12",
      channel: "Samtal",
      reason: "Återuppringning",
      detail: "Samtalet kom in när linjen var upptagen. Inget meddelande lämnat.",
      created: "för 2 tim",
      status: "kräver åtgärd",
      priority: "medel",
    },
    {
      id: "x3",
      title: "Specialönskemål: hundvänligt bord",
      guest: "Lina Fors",
      channel: "SMS",
      reason: "Specialönskemål",
      detail: "Gästen vill ta med ledarhund. AI har svarat att det går bra men vill att personalen väljer bord vid entrén.",
      created: "igår 19:12",
      status: "pågår",
      priority: "låg",
    },
  ],
  waitlist: [
    {
      id: "w1",
      name: "Johanna Ek",
      phone: "+46 70 221 44 90",
      party: 2,
      wanted: "19:00",
      flexibility: "18:30–20:30",
      created: "idag 09:10",
      status: "väntar",
      note: "Vill gärna sitta i baren om bord saknas.",
    },
    {
      id: "w2",
      name: "Rickard Palm",
      phone: "+46 73 118 09 55",
      party: 4,
      wanted: "19:30",
      flexibility: "19:00–21:00",
      created: "idag 09:48",
      status: "erbjuden",
      offer: { time: "20:30", table: "11", expires: "om 12 min" },
    },
    {
      id: "w3",
      name: "Nadia Sultani",
      phone: "+46 76 887 21 03",
      party: 6,
      wanted: "18:00",
      flexibility: "Endast 18:00",
      created: "igår 20:31",
      status: "omvandlad",
      note: "Bokad på bord 15 efter avbokning.",
    },
    {
      id: "w4",
      name: "Tomas Grip",
      phone: "+46 70 554 33 21",
      party: 3,
      wanted: "20:00",
      flexibility: "19:30–21:30",
      created: "idag 11:02",
      status: "väntar",
    },
    {
      id: "w5",
      name: "Ida Bergqvist",
      phone: "+46 72 400 77 18",
      party: 2,
      wanted: "18:30",
      flexibility: "18:00–19:00",
      created: "igår 17:44",
      status: "avbokad",
      note: "Hittade bord någon annanstans.",
    },
  ],
};

const hotell: OpsData = {
  emails: [
    {
      id: "he1",
      subject: "22 rum och konferenslokal 14–15 oktober",
      guest: "Vinge Advokatbyrå",
      address: "konferens@vinge.se",
      time: "08:55",
      unread: true,
      aiHandled: true,
      intent: "Grupp",
      messages: [
        {
          id: "he1m1",
          from: "konferens@vinge.se",
          time: "08:52",
          outgoing: false,
          body: "Hej! Vi behöver 22 rum och konferenslokal 14–15 oktober, helpension.",
        },
        {
          id: "he1m2",
          from: "Seytro AI",
          time: "08:55",
          outgoing: true,
          ai: true,
          body: "Hej! Vi har 22 rum lediga 14–15 oktober samt konferenslokal Norrsken. Helpension 2 480 kr per person och dygn enligt ert avtalspris. Jag håller rummen i 48 timmar — vill ni att jag bekräftar?",
        },
      ],
    },
    {
      id: "he2",
      subject: "Late check-in",
      guest: "Yuki Tanaka",
      address: "yuki.tanaka@mail.jp",
      time: "igår 22:14",
      unread: false,
      aiHandled: true,
      intent: "Sen ankomst",
      messages: [
        {
          id: "he2m1",
          from: "yuki.tanaka@mail.jp",
          time: "igår 22:10",
          outgoing: false,
          body: "Arriving 23:40, is late check-in possible?",
        },
        {
          id: "he2m2",
          from: "Seytro AI",
          time: "igår 22:14",
          outgoing: true,
          ai: true,
          body: "Yes — reception is staffed until 01:00 and your key will be ready. Room 501, junior suite. Safe travels!",
        },
      ],
    },
  ],
  calls: [
    {
      id: "hc1",
      direction: "inkommande",
      from: "+46 70 555 12 03",
      guest: "Elisabet Ohlsson",
      time: "för 6 min",
      duration: "0:55",
      intent: "Utcheckning",
      summary: "Önskar sen utcheckning till 15:00 på söndag. AI bekräftade mot beläggningen.",
      outcome: "Sen utcheckning beviljad",
      transcript: [
        { role: "AI", text: "Hotell Astrid, hur kan jag hjälpa till?" },
        { role: "Gäst", text: "Kan vi checka ut klockan tre på söndag?" },
        { role: "AI", text: "Det går bra, rummet är inte bokat direkt efter. Jag noterar sen utcheckning 15:00." },
      ],
    },
    {
      id: "hc2",
      direction: "inkommande",
      from: "+358 40 118 22 90",
      guest: "Maria Kallio",
      time: "idag 08:52",
      duration: "1:32",
      intent: "Merförsäljning",
      summary: "Ville lägga till middag för två i restaurangen. AI bokade bord 20:00.",
      outcome: "Bord bokat 20:00",
      transcript: [
        { role: "Gäst", text: "Kan ni boka middag för två i kväll?" },
        { role: "AI", text: "Självklart — jag har bokat bord för två klockan 20:00 och lagt det på rumsnotan." },
      ],
    },
  ],
  escalations: [
    {
      id: "hx1",
      title: "Rumsbyte önskas — ljudnivå",
      guest: "Thomas Brandt",
      channel: "Samtal",
      reason: "Klagomål",
      detail: "Gästen upplever buller från ventilationen i rum 208. Kräver beslut om uppgradering.",
      created: "idag 07:20",
      status: "kräver åtgärd",
      priority: "hög",
    },
  ],
  waitlist: [
    {
      id: "hw1",
      name: "Erik Sandell",
      phone: "+46 70 900 12 34",
      party: 2,
      wanted: "Svit 15–17 aug",
      flexibility: "Deluxe accepteras",
      created: "idag 09:30",
      status: "väntar",
    },
  ],
};

export const opsData: Record<Venue, OpsData> = { restaurang, hotell };
