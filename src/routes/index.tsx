import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { LogoMarquee } from "@/components/LogoMarquee";
import { ProductShowcase } from "@/components/ProductShowcase";
import { FaqSection } from "@/components/FaqSection";

import heroImg from "@/assets/hero-restaurant.png.asset.json";
import visionImg from "@/assets/vision.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Seytro — AI-driven operationsplattform för gästfrihet" },
      {
        name: "description",
        content:
          "Seytro samlar gästkommunikation, drift och gästtillväxt i en AI-driven plattform. Se vad varje funktion gör, varför den behövs och hur den fungerar hos er.",
      },
      { property: "og:title", content: "Seytro — AI-plattform för gästfrihet" },
      {
        property: "og:description",
        content:
          "Röstagent, e-postconcierge, bordsplacering och gästinsikt — en plattform, tydliga funktioner, mätbar nytta.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const reasons = [
  {
    num: "01",
    title: "Ingen förfrågan faller mellan stolarna",
    body: "Missade samtal och obesvarade mejl är förlorade intäkter. Seytro svarar direkt, dygnet runt, oavsett hur mycket som händer i verksamheten.",
  },
  {
    num: "02",
    title: "Administrationen slutar växa med er",
    body: "Fler gäster ska inte betyda fler timmar i inkorgen. Rutinarbetet — bekräftelser, ändringar, påminnelser, placeringar — sköts automatiskt.",
  },
  {
    num: "03",
    title: "Gästdatan blir faktiskt använd",
    body: "Preferenser, allergier och historik ligger sällan där de behövs. Seytro samlar dem i en profil som följer gästen genom varje kontakt.",
  },
];

const pillars = [
  {
    num: "01",
    title: "Gästkommunikation",
    intro:
      "Funktionen: varje samtal, mejl och bokningsförfrågan besvaras direkt, på gästens språk. Används när telefonen ringer mer än ni hinner svara.",
    items: [
      ["Röstagent", "Tar emot samtal, bokar och besvarar frågor med naturlig röst.", "/voice-agent"],
      ["E-postconcierge", "Läser, prioriterar och svarar på gästmejl i er ton.", "/epostagent"],
      ["Bokningsassistent", "Bekräftar, ombokar och påminner — färre no-shows.", "/bokningsassistent"],
    ] as [string, string, string][],
  },
  {
    num: "02",
    title: "Drift och kapacitet",
    intro:
      "Funktionen: kapaciteten planeras i realtid över alla kanaler. Används när pusslet mellan bokningar, bord och bemanning tar för mycket tid.",
    items: [
      ["Bordsplacering", "Optimal placering utifrån sällskap, tid och belastning.", "/bordsplacering"],
      ["Salsplan", "Levande vy med statusar, turnering och zoner.", "/salsplan"],
      ["Tillgänglighet", "Dynamisk kapacitet utan dubbelbokningar.", "/tillganglighet"],
    ] as [string, string, string][],
  },
  {
    num: "03",
    title: "Gästtillväxt",
    intro:
      "Funktionen: gästdata blir till återkommande besök. Används när ni vill fylla svaga pass utan att bygga rapporter manuellt.",
    items: [
      ["Gästinsikt", "Profiler med preferenser, allergier och historik.", "/gastinsikt"],
      ["Analys", "Intäkt, turnering och kanalprestanda i klartext.", "/analys"],
      ["Kampanjer", "Segmenterade utskick som fyller de svaga passen.", "/kampanjer"],
    ] as [string, string, string][],
  },
];

const steps = [
  ["Koppla", "Seytro läggs ovanpå ert befintliga boknings- och telefonisystem. Ingen migrering."],
  ["Lär", "Plattformen tränas på era regler, er ton och era öppettider — ni godkänner innan den går live."],
  ["Kör", "AI:n hanterar rutinen och eskalerar till personal när något kräver en människa."],
];

function Index() {
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />

      <section id="top" className="relative min-h-screen overflow-hidden">
        <img
          src={heroImg.url}
          alt="Livfull matsal med gäster vid dukade bord"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-6 pb-24 pt-40 sm:px-10">
          <p className="fade-up mb-8 max-w-xl text-sm uppercase tracking-[0.28em] text-primary-foreground/70">
            AI-driven operationsplattform för gästfrihet
          </p>
          <h1 className="fade-up max-w-4xl text-5xl leading-[1.02] text-primary-foreground sm:text-7xl lg:text-8xl">
            Gästfrihet som sköter sig själv.
          </h1>
          <p className="fade-up mt-8 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
            Seytro besvarar gästen, planerar kapaciteten och får gästen att komma tillbaka. Här är
            vad varje funktion gör och varför den behövs — djupdykningen finns på respektive sida.
          </p>
          <div className="fade-up mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/demo"
              className="rounded-full bg-primary-foreground px-8 py-4 text-sm font-medium text-forest-deep transition-opacity hover:opacity-90"
            >
              Boka demo
            </Link>
            <a
              href="#varfor"
              className="rounded-full border border-primary-foreground/40 px-8 py-4 text-sm text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Så fungerar plattformen
            </a>
          </div>
        </div>
      </section>

      <LogoMarquee />

      <section id="varfor" className="mx-auto max-w-7xl px-6 py-28 sm:px-10">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Varför Seytro</p>
        <h2 className="mt-6 max-w-2xl text-4xl leading-tight sm:text-5xl">
          Tre skäl att lägga AI ovanpå driften.
        </h2>
        <div className="mt-16 grid gap-10 lg:grid-cols-3">
          {reasons.map((r) => (
            <div key={r.num} className="border-t border-border pt-8">
              <span className="text-sm tracking-[0.28em] text-accent-foreground/50">{r.num}</span>
              <h3 className="mt-4 text-2xl leading-snug">{r.title}</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">{r.body}</p>
            </div>
          ))}
        </div>
      </section>

      <ProductShowcase />

      <section className="border-t-2 border-forest-deep bg-forest-deep text-primary-foreground">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-6 py-16 sm:px-10 lg:grid-cols-4">
          {[
            ["−38%", "administrativ tid i driften"],
            ["100%", "besvarade samtal och mejl"],
            ["24/7", "gästservice på svenska och engelska"],
            ["+21%", "återkommande gäster"],
          ].map(([kpi, label]) => (
            <div key={label}>
              <p className="font-display text-4xl text-primary-foreground">{kpi}</p>
              <p className="mt-2 text-sm text-primary-foreground/80">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pelare" className="mx-auto max-w-7xl px-6 py-28 sm:px-10">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Funktionerna</p>
        <h2 className="mt-6 max-w-2xl text-4xl leading-tight sm:text-5xl">
          Vad plattformen gör — och när den används.
        </h2>
        <p className="mt-6 max-w-xl text-muted-foreground">
          Tre områden, nio funktioner. Klicka vidare för djupdykning på varje funktion.
        </p>

        <div className="mt-20 space-y-20">
          {pillars.map((p) => (
            <div key={p.num} className="grid gap-10 border-t border-border pt-12 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="text-sm tracking-[0.28em] text-accent-foreground/50">{p.num}</span>
                <h3 className="mt-4 text-3xl">{p.title}</h3>
                <p className="mt-4 max-w-sm text-muted-foreground">{p.intro}</p>
              </div>
              <div className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
                {p.items.map(([t, d, href]) => (
                  <Link
                    key={t}
                    to={href}
                    className="group border-l border-border pl-5 transition-colors hover:border-forest"
                  >
                    <h4 className="text-base font-medium text-forest">{t}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
                    <span className="mt-3 inline-block text-xs text-forest opacity-0 transition-opacity group-hover:opacity-100">
                      Läs mer →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-10">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Så kommer ni igång</p>
          <h2 className="mt-6 max-w-2xl text-4xl leading-tight sm:text-5xl">Tre steg, inga systembyten.</h2>
          <div className="mt-14 grid gap-10 lg:grid-cols-3">
            {steps.map(([t, d], i) => (
              <div key={t} className="border-t border-border pt-8">
                <span className="text-sm tracking-[0.28em] text-accent-foreground/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-2xl">{t}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="bransch" className="mx-auto max-w-7xl px-6 py-28 sm:px-10">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Djupdykning</p>
        <h2 className="mt-6 max-w-2xl text-4xl leading-tight sm:text-5xl">Vad driver du?</h2>
        <p className="mt-6 max-w-xl text-muted-foreground">
          Samma plattform, olika vardag. Välj din ingång så visar vi Seytro med dina flöden, exempel
          och siffror.
        </p>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {[
            {
              to: "/restaurang" as const,
              label: "Restaurang",
              desc: "Telefonen under rushen, bordsläggningen och gästerna som ska tillbaka.",
              cta: "Se Seytro för restauranger",
            },
            {
              to: "/hotell" as const,
              label: "Hotell",
              desc: "Receptionens inkorg, gästservice dygnet runt och bordsbokning för rumsgäster.",
              cta: "Se Seytro för hotell",
            },
          ].map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-8 transition-colors hover:border-forest"
            >
              <div>
                <h3 className="text-2xl text-forest">{c.label}</h3>
                <p className="mt-3 max-w-sm text-muted-foreground">{c.desc}</p>
              </div>
              <span className="mt-10 text-sm font-medium text-forest transition-transform group-hover:translate-x-1">
                {c.cta} →
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Hotell med egen restaurang? Hybriduppsättningen kör båda flödena i samma plattform, med en
          gemensam gästprofil.
        </p>
      </section>

      <section id="vision" className="bg-forest-deep text-primary-foreground">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-28 sm:px-10 lg:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-primary-foreground/60">Vision</p>
            <h2 className="mt-6 text-4xl leading-tight sm:text-5xl">
              Framtidens värdskap är tyst, snabbt och personligt.
            </h2>
            <p className="mt-8 text-lg leading-relaxed text-primary-foreground/75">
              Vi tror att tekniken ska försvinna in i väggarna. Personalen ska möta gästen — inte
              skärmen. Seytro byggs som ett operativsystem för gästfrihet där varje system talar med
              varandra: telefonen, bokningen, planen och gästprofilen.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-primary-foreground/75">
              Nästa steg är en plattform som föreslår innan ni frågar: bemanning inför en regnig
              fredag, en omplacering när ett sällskap blir försenat, ett erbjudande till gästen som
              inte varit här på ett halvår.
            </p>
          </div>
          <img
            src={visionImg}
            alt="Detalj av en hotellreception i grön marmor och mässing"
            width={1280}
            height={960}
            loading="lazy"
            className="h-[480px] w-full object-cover"
          />
        </div>
      </section>

      <section id="demo" className="mx-auto max-w-7xl px-6 py-32 text-center sm:px-10">
        <h2 className="mx-auto max-w-3xl text-4xl leading-tight sm:text-6xl">
          Se Seytro i er egen verksamhet.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          30 minuter, live med ert eget bokningsflöde. Vi visar hur röstagenten svarar och hur
          kapaciteten planeras automatiskt.
        </p>
        <Link
          to="/demo"
          className="mt-10 inline-block rounded-full bg-forest px-10 py-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Boka demo
        </Link>
      </section>

      <div className="my-8 h-6 w-full bg-forest" aria-hidden="true" />

      <FaqSection />

      <SiteFooter />
    </div>
  );
}
