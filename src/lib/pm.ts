/**
 * PM = förbeställd bokning. Ett PM beskriver exakt vad köket och salen ska
 * leverera: menyfördelning, fördrink, snacks, rätter, dryck, dessert samt
 * kassa- och fakturaunderlag. Används främst för större sällskap och event.
 */

export type PmLine = {
  id: string;
  qty: number;
  name: string;
  /** Rättens beskrivning — visas för köket och i gästens kopia. */
  desc?: string;
  /** Pris per styck i kronor. Utelämnas för rader som ingår i menypriset. */
  price?: number;
};

export type PmSection = {
  id: string;
  title: string;
  note?: string;
  lines: PmLine[];
};

export type PmInvoice = {
  recipient: string;
  address: string[];
  gln?: string;
  van?: string;
  peppol?: string;
  email?: string;
  reference?: string;
};

export type PmStatus = "utkast" | "bekräftad" | "skickad till kök";

export type PmDoc = {
  id: string;
  bookingId?: string;
  title: string;
  date: string;
  time: string;
  party: number;
  contact?: string;
  phone?: string;
  email?: string;
  status: PmStatus;
  /** Menyfördelning, t.ex. 12 × Meny 2 – kött. */
  split: PmLine[];
  sections: PmSection[];
  invoice?: PmInvoice;
  allergies?: string;
};

export const lineTotal = (l: PmLine) => (l.price ? l.price * l.qty : 0);
export const sectionTotal = (s: PmSection) => s.lines.reduce((sum, l) => sum + lineTotal(l), 0);
export const splitTotal = (d: PmDoc) => d.split.reduce((sum, l) => sum + lineTotal(l), 0);
export const pmTotal = (d: PmDoc) =>
  splitTotal(d) + d.sections.reduce((sum, s) => sum + sectionTotal(s), 0);

export const kr = (n: number) =>
  `${n.toLocaleString("sv-SE", { maximumFractionDigits: 0 })} kr`;

export const pmStatusStyles: Record<PmStatus, string> = {
  utkast: "bg-muted text-muted-foreground",
  bekräftad: "bg-primary/10 text-primary",
  "skickad till kök": "bg-emerald-500/15 text-emerald-700",
};

let counter = 0;
export const uid = (prefix = "l") => `${prefix}${Date.now().toString(36)}${(counter += 1)}`;

/** Färdiga menyer som restaurangen väljer bland när ett PM byggs. */
export const menuTemplates: {
  id: string;
  label: string;
  price: number;
  desc: string;
  sections: Omit<PmSection, "id">[];
}[] = [
  {
    id: "meny2",
    label: "Meny 2 – tre rätter",
    price: 795,
    desc: "Steak tartare / hälleflundracarpaccio · Pepparstek / piggvar · Tarte au citron",
    sections: [
      {
        title: "Förrätt",
        lines: [
          {
            id: "seed-f1",
            qty: 0,
            name: "Steak tartare",
            desc: "Kapris, dijon, sherryvinäger, konfiterad lök och grillat surdegsbröd",
          },
          {
            id: "seed-f2",
            qty: 0,
            name: "Hälleflundracarpaccio",
            desc: "Röd grapefrukt, apelsin, grillad majonnäs och ostronört",
          },
        ],
      },
      {
        title: "Varmrätt",
        lines: [
          {
            id: "seed-v1",
            qty: 0,
            name: "Pepparstek",
            desc: "Oxfilé 200 g, talgfriterade pommes frites, grönpepparsås och grönsallad",
          },
          {
            id: "seed-v2",
            qty: 0,
            name: 'Piggvar "Côte d\'Azur"',
            desc: "Blåmusslor, hummerstjärt, sauce vin blanc och blekselleri",
          },
        ],
      },
      {
        title: "Dessert",
        lines: [{ id: "seed-d1", qty: 0, name: "Tarte au citron", desc: "Italiensk maräng" }],
      },
    ],
  },
  {
    id: "fordrink",
    label: "Fördrink och snacks",
    price: 185,
    desc: "Swedish Garden Collins samt snacks att dela på",
    sections: [
      {
        title: "Fördrink",
        note: "Alkoholfritt alternativ i form av cider eller alkoholfri öl kan önskas på plats.",
        lines: [
          {
            id: "seed-p1",
            qty: 0,
            name: "Swedish Garden Collins",
            desc: "Gin, fläder och krusbärssoda",
            price: 185,
          },
        ],
      },
      {
        title: "Snacks att dela på",
        lines: [
          { id: "seed-s1", qty: 0, name: "Marconamandlar", price: 75 },
          { id: "seed-s2", qty: 0, name: "Gordaloliver", price: 75 },
          { id: "seed-s3", qty: 0, name: "Tartlett med gulfenad tonfiskcrudo", price: 165 },
          { id: "seed-s4", qty: 0, name: "Pata Negra de Salamanca, 36 månader", price: 195 },
          { id: "seed-s5", qty: 0, name: "Wrångebäck hårdost", price: 115 },
        ],
      },
    ],
  },
  {
    id: "vinpaket",
    label: "Vinpaket till menyn",
    price: 195,
    desc: "Ett glas till varje rätt, matchat av sommelier",
    sections: [
      {
        title: "Vinpaket",
        lines: [
          { id: "seed-w1", qty: 0, name: "Domaine Trenel Bourgogne Rouge", price: 230 },
          { id: "seed-w2", qty: 0, name: "Chablis", price: 215 },
          { id: "seed-w3", qty: 0, name: "Moulin d'Issan Bordeaux", price: 195 },
          { id: "seed-w4", qty: 0, name: "Albariño", price: 165 },
        ],
      },
    ],
  },
];

/** Exempel-PM: sällskap 13 personer med fasta menyer och fakturaunderlag. */
export const samplePm: PmDoc = {
  id: "pm1",
  bookingId: "b13",
  title: "Stockholms Handelskammare — sällskap 13 personer",
  date: "torsdag 20 augusti",
  time: "18:30",
  party: 13,
  contact: "Stockholms Handelskammare Service AB",
  email: "invoice@stockholmshandelskammare.se",
  status: "bekräftad",
  allergies: "Inga anmälda. 1 gäst äter fisk, övriga kött.",
  split: [
    { id: "sp1", qty: 12, name: "Meny 2 – kött", price: 795 },
    { id: "sp2", qty: 1, name: "Meny 2 – fisk", price: 795 },
  ],
  sections: [
    {
      id: "s-fordrink",
      title: "Fördrink",
      note: "Alkoholfritt alternativ i form av cider eller alkoholfri öl kan önskas på plats.",
      lines: [
        {
          id: "f1",
          qty: 13,
          name: "Swedish Garden Collins",
          desc: "Gin, fläder och krusbärssoda",
          price: 185,
        },
      ],
    },
    {
      id: "s-snacks",
      title: "Snacks att dela på",
      lines: [
        { id: "sn1", qty: 4, name: "Marconamandlar", price: 75 },
        { id: "sn2", qty: 4, name: "Gordaloliver", price: 75 },
        { id: "sn3", qty: 4, name: "Tartlett med gulfenad tonfiskcrudo", price: 165 },
        { id: "sn4", qty: 4, name: "Pata Negra de Salamanca, 36 månader", price: 195 },
        { id: "sn5", qty: 4, name: "Wrångebäck hårdost", price: 115 },
      ],
    },
    {
      id: "s-forratt",
      title: "Förrätt",
      lines: [
        {
          id: "fr1",
          qty: 12,
          name: "Steak tartare",
          desc: "Kapris, dijon, sherryvinäger, konfiterad lök och grillat surdegsbröd",
        },
        {
          id: "fr2",
          qty: 1,
          name: "Hälleflundracarpaccio",
          desc: "Röd grapefrukt, apelsin, grillad majonnäs och ostronört",
        },
      ],
    },
    {
      id: "s-varmratt",
      title: "Varmrätt",
      lines: [
        {
          id: "vr1",
          qty: 12,
          name: "Pepparstek",
          desc: "Oxfilé 200 g, talgfriterade pommes frites, grönpepparsås och grönsallad",
        },
        {
          id: "vr2",
          qty: 1,
          name: 'Piggvar "Côte d\'Azur"',
          desc: "Blåmusslor, hummerstjärt, sauce vin blanc och blekselleri",
        },
      ],
    },
    {
      id: "s-dessert",
      title: "Dessert",
      lines: [{ id: "de1", qty: 13, name: "Tarte au citron", desc: "Italiensk maräng" }],
    },
    {
      id: "s-vin",
      title: "Vinpaket",
      lines: [
        { id: "w1", qty: 12, name: "Domaine Trenel Bourgogne Rouge", desc: "Till förrätt, kött", price: 230 },
        { id: "w2", qty: 1, name: "Chablis", desc: "Till förrätt, fisk", price: 215 },
        { id: "w3", qty: 12, name: "Moulin d'Issan Bordeaux", desc: "Till varmrätt, kött", price: 195 },
        { id: "w4", qty: 1, name: "Albariño", desc: "Till varmrätt, fisk", price: 165 },
      ],
    },
  ],
  invoice: {
    recipient: "Stockholms Handelskammare Service AB",
    address: ["Box 16050", "103 21 Stockholm"],
    gln: "7365560957953",
    van: "Crediflow",
    peppol: "0007:5560957952",
    email: "invoice@stockholmshandelskammare.se",
    reference: "Sällskap 13 pers, Meny 2",
  },
};

export const pmDocs: PmDoc[] = [
  samplePm,
  {
    id: "pm2",
    bookingId: "b3",
    title: "Nordea Corporate — affärsmiddag 10 personer",
    date: "idag",
    time: "18:00",
    party: 10,
    contact: "Nordea Corporate",
    email: "events@nordea.se",
    status: "skickad till kök",
    allergies: "1 gäst glutenfri, 1 gäst vegetarian.",
    split: [
      { id: "n1", qty: 8, name: "Meny 3 – kött", price: 895 },
      { id: "n2", qty: 1, name: "Meny 3 – glutenfri", price: 895 },
      { id: "n3", qty: 1, name: "Meny 3 – vegetarisk", price: 895 },
    ],
    sections: [
      {
        id: "n-s1",
        title: "Fördrink",
        lines: [{ id: "n-l1", qty: 10, name: "Champagne Bollinger", price: 245 }],
      },
      {
        id: "n-s2",
        title: "Vinpaket",
        lines: [{ id: "n-l2", qty: 10, name: "Vinpaket 3 glas", price: 595 }],
      },
    ],
    invoice: {
      recipient: "Nordea Bank Abp, filial i Sverige",
      address: ["Smålandsgatan 17", "105 71 Stockholm"],
      email: "faktura@nordea.se",
      reference: "Kostnadsställe 4471",
    },
  },
];
