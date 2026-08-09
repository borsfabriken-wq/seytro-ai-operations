import { createFileRoute } from "@tanstack/react-router";
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
      { title: "Seytro — AI-driven operationsplattform för restaurang & hotell" },
      {
        name: "description",
        content:
          "Seytro samlar gästkommunikation, restaurangdrift och gästtillväxt i en AI-driven plattform för restauranger och hotell. Boka en demo.",
      },
      { property: "og:title", content: "Seytro — AI för restaurang och hotell" },
      {
        property: "og:description",
        content:
          "Röstagent, e-postconcierge, bordsplacering och gästinsikt i en och samma plattform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const pillars = [
  {
    num: "01",
    title: "Gästkommunikation",
    intro:
      "Varje samtal, mejl och bokningsförfrågan besvaras direkt — dygnet runt, på gästens språk.",
    items: [
      ["Röstagent", "Tar emot telefonsamtal, bokar bord och besvarar frågor med naturlig röst."],
      ["E-postconcierge", "Läser, prioriterar och svarar på gästmejl med er ton och era policyer."],
      ["Bokningsassistent", "Bekräftar, ombokar och påminner automatiskt — färre no-shows."],
    ],
  },
  {
    num: "02",
    title: "Restaurangdrift",
    intro:
      "Salen planerar sig själv. Seytro ser kapaciteten i realtid och lägger pusslet åt er.",
    items: [
      ["Bordsplacering", "Optimal placering utifrån sällskap, tid och servicebelastning."],
      ["Salsplan", "Levande golvvy med statusar, turnering och personalzoner."],
      ["Tillgänglighet", "Dynamisk kapacitet över kanaler, utan dubbelbokningar."],
    ],
  },
  {
    num: "03",
    title: "Gästtillväxt",
    intro:
      "Gästdata blir till återkommande besök — utan att någon behöver bygga rapporter.",
    items: [
      ["Gästinsikt", "Profiler med preferenser, allergier och besökshistorik."],
      ["Analys", "Intäkt per plats, turnering och kanalprestanda i klartext."],
      ["Kampanjer", "Segmenterade utskick som fyller de svaga passen."],
    ],
  },
];

function Index() {
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />



      <section id="top" className="relative min-h-screen overflow-hidden">
        <img
          src={heroImg.url}
          alt="Livfull restaurangmatsal med gäster vid dukade bord"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
        
        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-6 pb-24 pt-40 sm:px-10">
          <p className="fade-up mb-8 max-w-xl text-sm uppercase tracking-[0.28em] text-primary-foreground/70">
            AI-driven operationsplattform
          </p>
          <h1 className="fade-up max-w-4xl text-5xl leading-[1.02] text-primary-foreground sm:text-7xl lg:text-8xl">
            Gästfrihet som sköter sig själv.
          </h1>
          <p className="fade-up mt-8 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
            Seytro besvarar gästen, planerar salen och får dem att komma tillbaka — en plattform för
            restauranger och hotell som vill växa utan att växa i administration.
          </p>
          <div className="fade-up mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#demo"
              className="rounded-full bg-primary-foreground px-8 py-4 text-sm font-medium text-forest-deep transition-opacity hover:opacity-90"
            >
              Boka demo
            </a>
            <a
              href="#pelare"
              className="rounded-full border border-primary-foreground/40 px-8 py-4 text-sm text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Se plattformen
            </a>
          </div>
        </div>
      </section>

      <LogoMarquee />

      <ProductShowcase />

      <section className="border-t-2 border-forest-deep bg-forest-deep text-primary-foreground">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-6 py-16 sm:px-10 lg:grid-cols-4">
          {[
            ["−38%", "administrativ tid i salen"],
            ["100%", "besvarade samtal och mejl"],
            ["24/7", "gästservice på 20 språk"],
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
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Tre pelare</p>
        <h2 className="mt-6 max-w-2xl text-4xl leading-tight sm:text-5xl">
          En plattform för hela gästresan.
        </h2>

        <div className="mt-20 space-y-20">
          {pillars.map((p) => (
            <div key={p.num} className="grid gap-10 border-t border-border pt-12 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="text-sm tracking-[0.28em] text-accent-foreground/50">{p.num}</span>
                <h3 className="mt-4 text-3xl">{p.title}</h3>
                <p className="mt-4 max-w-sm text-muted-foreground">{p.intro}</p>
              </div>
              <div className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
                {p.items.map(([t, d]) => (
                  <div key={t} className="border-l border-border pl-5">
                    <h4 className="text-base font-medium text-forest">{t}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
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
              varandra: telefonen, bokningen, salsplanen och gästprofilen.
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
          Se Seytro på er egen sal.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          30 minuter, live med ert eget bokningsflöde. Vi visar hur röstagenten svarar och hur salen
          planeras automatiskt.
        </p>
        <a
          href="mailto:hej@seytro.com?subject=Boka%20demo"
          className="mt-10 inline-block rounded-full bg-forest px-10 py-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Boka demo
        </a>
      </section>

      <div className="h-2 w-full bg-forest" aria-hidden="true" />

      <FaqSection />

      <SiteFooter />
    </div>
  );
}
