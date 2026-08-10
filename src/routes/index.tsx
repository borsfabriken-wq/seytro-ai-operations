import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { LogoMarquee } from "@/components/LogoMarquee";
import { ProductShowcase } from "@/components/ProductShowcase";
import { FaqSection } from "@/components/FaqSection";

import heroImg from "@/assets/hero-main.jpg";
import visionImg from "@/assets/vision-new.jpg";
import cardRestaurant from "@/assets/card-restaurant.jpg";
import cardHotel from "@/assets/card-hotel.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Seytro — AI-plattform för servicebranschen" },
      {
        name: "description",
        content:
          "Seytro fångar upp missade bokningar, minskar det administrativa arbetet och samlar all gästdata — AI-integrationer ovanpå de system servicebranschen redan använder.",
      },
      { property: "og:title", content: "Seytro — AI för servicebranschen" },
      {
        property: "og:description",
        content:
          "Inga missade förfrågningar, mindre administration och en samlad datagrund. AI som lägger sig ovanpå era befintliga system.",
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
    title: "Missade bokningar blir bokade",
    body: "Varje obesvarat samtal och mejl är en intäkt som gick till någon annan. Seytro svarar direkt, dygnet runt, oavsett hur mycket som händer i verksamheten — och förfrågan blir en färdig bokning.",
  },
  {
    num: "02",
    title: "Rätt plats vid rätt tid",
    body: "Bordsläggning, rumsplacering och kapacitetsstyrning görs automatiskt utifrån sällskap, önskemål och belastning. Färre dubbelbokningar och mer välplanerade pass.",
  },
  {
    num: "03",
    title: "All data på ett ställe",
    body: "Gästdata ligger utspridd i telefon, mejl, bokningssystem och kassa. Seytro samlar den i en gemensam grund — samma bild av gästen, oavsett vem i teamet som möter den.",
  },
];

const pillars = [
  {
    num: "01",
    title: "Kommunikation",
    intro:
      "Funktionen: varje samtal, mejl och förfrågan besvaras direkt, på gästens språk. Används när kontaktflödet är större än vad bemanningen hinner med.",
    items: [
      ["Röstagent", "Tar emot samtal, bokar och besvarar frågor med naturlig röst.", "/voice-agent"],
      ["E-postconcierge", "Läser, prioriterar och svarar på förfrågningar i er ton.", "/epostagent"],
      ["Bokningsassistent", "Bekräftar, ombokar och påminner — färre no-shows.", "/bokningsassistent"],
    ] as [string, string, string][],
  },
  {
    num: "02",
    title: "Placering och kapacitet",
    intro:
      "Funktionen: varje gäst placeras på rätt plats i rätt tid, oavsett kanal. Används när pusslet mellan bokningar, bord, rum och bemanning tar för mycket tid.",
    items: [
      ["Bordsplacering", "Optimal placering utifrån sällskap, tid och belastning.", "/bordsplacering"],
      ["Salsplan", "Levande vy med statusar, turnering och zoner.", "/salsplan"],
      ["Tillgänglighet", "Dynamisk kapacitet utan dubbelbokningar.", "/tillganglighet"],
    ] as [string, string, string][],
  },
  {
    num: "03",
    title: "Data och tillväxt",
    intro:
      "Funktionen: gästdatan blir användbar och leder till fler återkommande besök. Används när underlaget finns men ingen hinner arbeta med det.",
    items: [
      ["Gästinsikt", "Profiler med preferenser, historik och noteringar.", "/gastinsikt"],
      ["Analys", "Intäkt, beläggning och kanalprestanda i klartext.", "/analys"],
      ["Kampanjer", "Segmenterade utskick som fyller de svaga passen.", "/kampanjer"],
    ] as [string, string, string][],
  },
];

const steps = [
  ["Koppla", "Seytro läggs ovanpå era befintliga system — bokning, telefoni, mejl och kassa. Ingen migrering, inget systembyte."],
  ["Lär", "Plattformen tränas på era regler, er ton och era öppettider. Ni godkänner innan den går live."],
  ["Kör", "AI:n hanterar rutinen, samlar datan och eskalerar till personal när något kräver en människa."],
];

function Index() {
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />

      <section id="top" className="relative min-h-screen overflow-hidden">
        <img
          src={heroImg}
          alt="Gäster som möts av personal i en servicemiljö"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-forest-deep via-forest-deep/60 to-forest-deep/10" />
        <div className="absolute inset-0 bg-linear-to-r from-forest-deep/60 via-transparent to-tide/10" />


        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-6 pb-24 pt-40 sm:px-10">
          <p className="fade-up mb-8 max-w-xl text-sm uppercase tracking-[0.28em] text-primary-foreground/70">
            AI-integrationer för servicebranschen
          </p>
          <h1 className="fade-up max-w-4xl text-5xl leading-[1.02] text-primary-foreground sm:text-7xl lg:text-8xl">
            Bokningar och placering som sköter sig självt.
          </h1>
          <p className="fade-up mt-8 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
            Seytro fångar upp förfrågningar ni annars hade missat, placerar varje gäst på rätt plats
            och tar bort det administrativa rutinarbetet — som ett AI-lager ovanpå de system ni
            redan använder.
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
          Tre problem varje serviceverksamhet känner igen.
        </h2>
        <div className="mt-16 grid gap-10 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <div
              key={r.num}
              className={`border-t-2 pt-8 ${["border-tide", "border-ember", "border-moss"][i % 3]}`}
            >
              <span
                className={`text-sm tracking-[0.28em] ${["text-tide", "text-ember", "text-moss"][i % 3]}`}
              >
                {r.num}
              </span>
              <h3 className="mt-4 text-2xl leading-snug">{r.title}</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">{r.body}</p>
            </div>
          ))}
        </div>
      </section>

      <ProductShowcase />

      <section className="relative overflow-hidden bg-forest-deep text-primary-foreground">
        <div className="absolute inset-0 bg-linear-to-r from-tide/20 via-transparent to-ember/20" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-16 sm:px-10 lg:grid-cols-4">
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

      <section id="pelare" className="bg-linear-to-b from-background to-secondary/50">
        <div className="mx-auto max-w-7xl px-6 py-28 sm:px-10">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Funktionerna</p>
        <h2 className="mt-6 max-w-2xl text-4xl leading-tight sm:text-5xl">
          Vad plattformen gör — och när den används.
        </h2>
        <p className="mt-6 max-w-xl text-muted-foreground">
          Tre områden, nio funktioner. Klicka vidare för djupdykning på varje funktion.
        </p>

        <div className="mt-20 space-y-20">
          {pillars.map((p, i) => (
            <div key={p.num} className="grid gap-10 border-t border-border pt-12 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs tracking-[0.28em] ${
                    ["bg-tide-soft text-tide", "bg-ember-soft text-ember", "bg-moss-soft text-moss"][i % 3]
                  }`}
                >
                  {p.num}
                </span>
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
        </div>
      </section>

      <section className="bg-secondary">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-10">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">
            Så kommer ni igång
          </p>
          <h2 className="mt-6 max-w-2xl text-4xl leading-tight sm:text-5xl">
            Tre steg, inga systembyten.
          </h2>
          <div className="mt-14 grid gap-10 lg:grid-cols-3">
            {steps.map(([t, d], i) => (
              <div key={t} className="border-t border-border pt-8">
                <span className="text-sm tracking-[0.28em] text-brass">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-2xl">{t}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
          <p className="mt-12 max-w-2xl text-sm text-muted-foreground">
            Seytro integreras med bokningssystem, telefoni, mejl, kassa och gästregister — datan
            fortsätter att leva i era system, men blir användbar på ett ställe.
          </p>
        </div>
      </section>

      <section id="bransch" className="mx-auto max-w-7xl px-6 py-28 sm:px-10">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Djupdykning</p>
        <h2 className="mt-6 max-w-2xl text-4xl leading-tight sm:text-5xl">Vad driver du?</h2>
        <p className="mt-6 max-w-xl text-muted-foreground">
          Samma plattform, olika vardag. Välj din ingång så visar vi hur systemet maxas för just din
          verksamhet — med dina flöden, exempel och siffror.
        </p>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {[
            {
              to: "/restaurang" as const,
              label: "Restaurang",
              img: cardRestaurant,
              alt: "Värd vid en bordsöversikt i en restaurang under service",
              desc: "Telefonen under rushen, bordsläggningen och gästerna som ska tillbaka.",
              cta: "Se Seytro för restauranger",
              ring: "hover:border-ember",
              tone: "text-ember",
            },
            {
              to: "/hotell" as const,
              label: "Hotell",
              img: cardHotel,
              alt: "Korridor och rumsentré på ett boutiquehotell",
              desc: "Receptionens inkorg, automatisk rumsplacering och gästservice dygnet runt.",
              cta: "Se Seytro för hotell",
              ring: "hover:border-tide",
              tone: "text-tide",
            },
          ].map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className={`group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors ${c.ring}`}
            >
              <div className="relative h-56 overflow-hidden sm:h-64">
                <img
                  src={c.img}
                  alt={c.alt}
                  width={1200}
                  height={912}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-8">
                <div>
                  <h3 className={`text-2xl ${c.tone}`}>{c.label}</h3>
                  <p className="mt-3 max-w-sm text-muted-foreground">{c.desc}</p>
                </div>
                <span className="mt-10 text-sm font-medium text-foreground transition-transform group-hover:translate-x-1">
                  {c.cta} →
                </span>
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Verksamhet med både boende och servering? Hybriduppsättningen kör båda flödena i samma
          plattform, med en gemensam gästprofil.
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
              skärmen. Seytro byggs som ett operativsystem för service där varje system talar med
              varandra: telefonen, inkorgen, bokningen och gästprofilen.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-primary-foreground/75">
              Nästa steg är en plattform som föreslår innan ni frågar: bemanning inför en regnig
              fredag, en omplacering när ett sällskap blir försenat, ett erbjudande till gästen som
              inte varit här på ett halvår.
            </p>
          </div>
          <img
            src={visionImg}
            alt="Detalj av en reception i grön marmor och mässing"
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
          30 minuter, live med era egna flöden. Vi visar hur röstagenten svarar, hur bokningarna
          landar och hur administrationen försvinner.
        </p>
        <Link
          to="/demo"
          className="mt-10 inline-block rounded-full bg-forest px-10 py-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Boka demo
        </Link>
      </section>

      <div className="mx-auto my-4 h-px w-full max-w-7xl bg-linear-to-r from-transparent via-border to-transparent" aria-hidden="true" />

      <FaqSection />

      <SiteFooter />
    </div>
  );
}
