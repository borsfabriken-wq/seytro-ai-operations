import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { LogoMarquee } from "@/components/LogoMarquee";
import { ProductShowcase } from "@/components/ProductShowcase";
import { FaqSection } from "@/components/FaqSection";

import heroImg from "@/assets/hero-main.jpg";
import visionImg from "@/assets/vision-restaurant.png.asset.json";
import cardRestaurantAsset from "@/assets/card-restaurant.png.asset.json";
import cardHotelAsset from "@/assets/hero-hotel.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Seytro — AI-plattform för servicebranschen" },
      {
        name: "description",
        content:
          "Seytro ersätter era gamla system med en komplett AI-plattform för bokning, drift och gästkommunikation — allt i ett, från dag ett.",
      },
      { property: "og:title", content: "Seytro — AI för servicebranschen" },
      {
        property: "og:description",
        content:
          "Inga missade förfrågningar, mindre administration och all gästdata på ett ställe. Ett system som ersätter alla andra.",
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
  ["Flytta in", "Vi tar över bokningar, gästregister och historik från ert nuvarande system. Ni behöver inte föra över något för hand."],
  ["Bygg upp", "Salsplan, öppettider, bokningsregler och er ton sätts upp i Seytro. Ni godkänner allt innan ni går live."],
  ["Ta över", "Seytro blir ert enda system: bokning, telefoni, mejl, drift och gästdata i samma plattform, med AI som sköter rutinen och eskalerar till personalen."],
];

function Index() {
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />

      <section id="top" className="relative min-h-[100svh] overflow-hidden">
        <img
          src={heroImg}
          alt="Gäster som möts av personal i en servicemiljö"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-forest-deep/95 via-forest-deep/25 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-forest-deep/45 via-transparent to-transparent" />


        <div className="site-container relative flex min-h-[100svh] flex-col justify-end pb-16 pt-32 sm:pb-24 sm:pt-40">
          <p className="fade-up mb-8 label-micro text-primary-foreground/60">
            Bokningssystem och gästkommunikation i ett
          </p>

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.75fr)] lg:items-end">
            <div>
              <h1 className="fade-up max-w-4xl text-display-xl text-primary-foreground">
                Bokningar och placering som sköter sig självt.
              </h1>
              <p className="fade-up mt-8 max-w-xl text-body-lg text-primary-foreground/75">
                Ett komplett system som ersätter ert gamla: varje samtal och mejl besvaras, varje
                gäst placeras rätt och rutinadministrationen försvinner.
              </p>

              <div className="fade-up mt-10 flex flex-wrap items-center gap-4">
                <Link
                  to="/demo"
                  className="rounded-full bg-primary-foreground px-8 py-4 text-sm font-semibold tracking-[-0.01em] text-forest-deep transition-opacity hover:opacity-90"
                >
                  Boka demo
                </Link>
                <a
                  href="#varfor"
                  className="rounded-full border border-primary-foreground/30 px-8 py-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
                >
                  Så fungerar plattformen
                </a>
              </div>
            </div>

            <div className="fade-up hidden rounded-2xl border border-primary-foreground/15 bg-forest-deep/50 p-6 backdrop-blur-md lg:block">
              <p className="label-micro text-primary-foreground/55">Igår, live i driften</p>
              <div className="mt-5 space-y-4">
                {[
                  ["Besvarade samtal", "142", "0 missade"],
                  ["Bokningar via AI", "68", "+14 mot snitt"],
                  ["Placeringar optimerade", "31", "+22 täckningar"],
                ].map(([label, value, note]) => (
                  <div
                    key={label}
                    className="flex items-baseline justify-between gap-4 border-b border-primary-foreground/10 pb-3 last:border-0 last:pb-0"
                  >
                    <span className="text-sm text-primary-foreground/70">{label}</span>
                    <span className="text-right">
                      <span className="font-display text-2xl tnum text-primary-foreground">{value}</span>
                      <span className="ml-3 text-xs text-primary-foreground/55">{note}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <LogoMarquee />

      <section id="varfor" className="site-container section-y">
        <p className="label-micro text-muted-foreground">Varför Seytro</p>
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-16">
          <h2 className="text-display">
            Tre problem varje serviceverksamhet känner igen.
          </h2>
          <p className="text-body-lg text-muted-foreground lg:pb-2">
            Samma flaskhalsar återkommer i varje restaurang och hotell — obesvarade
            förfrågningar, manuell placering och gästdata utspridd i olika system.
            Seytro ersätter dem med ett enda system.
          </p>
        </div>
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,1fr)]">
          {reasons.map((r, i) => (
            <div
              key={r.num}
              className={`bg-card p-8 lg:p-10 ${i === 0 ? "lg:p-12" : ""}`}
            >
              <span className="label-micro text-accent-strong">{r.num}</span>
              <h3 className="mt-5 text-subheading">{r.title}</h3>
              <p className="mt-4 text-body text-muted-foreground">{r.body}</p>
            </div>
          ))}
        </div>
      </section>

      <ProductShowcase />

      <section className="relative overflow-hidden bg-forest-deep text-primary-foreground">
        <div className="absolute inset-0 bg-linear-to-r from-muted/60 via-transparent to-muted/40" aria-hidden="true" />
        <div className="site-container relative grid grid-cols-2 gap-8 py-16 lg:grid-cols-4">
          {[
            ["−38%", "administrativ tid i driften"],
            ["100%", "besvarade samtal och mejl"],
            ["24/7", "gästservice på svenska och engelska"],
            ["+21%", "återkommande gäster"],
          ].map(([kpi, label]) => (
            <div key={label}>
              <p className="font-display text-5xl tnum tracking-[-0.04em] text-primary-foreground">{kpi}</p>
              <p className="mt-3 max-w-[16ch] text-sm text-primary-foreground/70">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pelare" className="bg-linear-to-b from-background to-secondary/50">
        <div className="site-container section-y">
        <p className="label-micro text-muted-foreground">Funktionerna</p>
        <h2 className="mt-6 max-w-2xl text-display">
          Vad plattformen gör — och när den används.
        </h2>
        <p className="mt-6 max-w-xl text-body text-muted-foreground">
          Tre områden, nio funktioner. Klicka vidare för djupdykning på varje funktion.
        </p>

        <div className="mt-20 space-y-20">
          {pillars.map((p) => (
            <div key={p.num} className="grid gap-10 border-t border-border pt-12 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="label-micro inline-block rounded-full bg-accent-tint px-3 py-1.5 text-accent-strong">
                  {p.num}
                </span>
                <h3 className="mt-4 text-heading">{p.title}</h3>
                <p className="mt-4 max-w-sm text-body text-muted-foreground">{p.intro}</p>
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
        <div className="site-container py-24">
          <p className="label-micro text-muted-foreground">
            Så fungerar det
          </p>
          <h2 className="mt-6 max-w-3xl text-display">
            En helhetslösning för bokning, drift och gästkommunikation — som ersätter era befintliga system.
          </h2>
          <div className="mt-14 grid gap-10 lg:grid-cols-3">
            {steps.map(([t, d], i) => (
              <div key={t} className="border-t border-border pt-8">
                <span className="label-micro text-accent-strong">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-subheading">{t}</h3>
                <p className="mt-3 text-body text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
          <p className="mt-12 max-w-2xl text-sm text-muted-foreground">
            Seytro integreras med bokningssystem, telefoni, mejl, kassa och gästregister — datan
            fortsätter att leva i era system, men blir användbar på ett ställe.
          </p>
        </div>
      </section>

      <section id="bransch" className="site-container section-y">
        <p className="label-micro text-muted-foreground">Djupdykning</p>
        <h2 className="mt-6 max-w-2xl text-display">Vad driver du?</h2>
        <p className="mt-6 max-w-xl text-body text-muted-foreground">
          Samma plattform, olika vardag. Välj din ingång så visar vi hur systemet maxas för just din
          verksamhet — med dina flöden, exempel och siffror.
        </p>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {[
            {
              to: "/restaurang" as const,
              label: "Restaurang",
              img: cardRestaurantAsset.url,
              alt: "Seytro salsplan på en surfplatta i restaurangmiljö",
              desc: "Telefonen under rushen, bordsläggningen och gästerna som ska tillbaka.",
              cta: "Se Seytro för restauranger",
              ring: "hover:border-foreground/30",
              tone: "text-foreground",
            },
            {
              to: "/hotell" as const,
              label: "Hotell",
              img: cardHotelAsset.url,
              alt: "Elegant hotel reception with warm wood paneling and a curved stone desk",
              desc: "Receptionens inkorg, automatisk rumsplacering och gästservice dygnet runt.",
              cta: "Se Seytro för hotell",
              ring: "hover:border-foreground/30",
              tone: "text-foreground",
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
                  <h3 className={`text-subheading ${c.tone}`}>{c.label}</h3>
                  <p className="mt-3 max-w-sm text-body text-muted-foreground">{c.desc}</p>
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
        <div className="site-container grid items-center gap-16 section-y lg:grid-cols-2">
          <div>
            <p className="label-micro text-primary-foreground/55">Vision</p>
            <h2 className="mt-6 text-display text-primary-foreground">
              Framtidens värdskap är tyst, snabbt och personligt.
            </h2>
            <p className="mt-8 text-body-lg text-primary-foreground/75">
              Vi tror att tekniken ska försvinna in i väggarna. Personalen ska möta gästen — inte
              skärmen. Seytro byggs som ett operativsystem för service där varje system talar med
              varandra: telefonen, inkorgen, bokningen och gästprofilen.
            </p>
            <p className="mt-6 text-body-lg text-primary-foreground/75">
              Nästa steg är en plattform som föreslår innan ni frågar: bemanning inför en regnig
              fredag, en omplacering när ett sällskap blir försenat, ett erbjudande till gästen som
              inte varit här på ett halvår.
            </p>
          </div>
          <img
            src={visionImg}
            alt="Välkomnande restauranginteriör med personal och gäster"
            width={1280}
            height={960}
            loading="lazy"
            className="h-[480px] w-full object-cover"
          />
        </div>
      </section>

      <section id="demo" className="site-container section-y-lg text-center">
        <h2 className="mx-auto max-w-3xl text-display-lg">
          Se Seytro i er egen verksamhet.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-body-lg text-muted-foreground">
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
