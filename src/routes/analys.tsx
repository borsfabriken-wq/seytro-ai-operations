import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  BarChart3,
  TrendingUp,
  CalendarClock,
  AlertTriangle,
  Eye,
  Download,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/analys")({
  head: () => ({
    meta: [
      { title: "Analys — Seytro" },
      {
        name: "description",
        content:
          "Seytros Analys ger restauranger och hotell tydliga insikter om intäkter, pass och gästbeteende — så ni kan fatta beslut innan veckan börjar.",
      },
      { property: "og:title", content: "Analys — Seytro" },
      {
        property: "og:description",
        content:
          "Se mönstren innan veckan börjar. AI-driven analys för restaurang- och hotellverksamheter.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnalysPage,
});

const benefits = [
  {
    icon: TrendingUp,
    title: "Intäktsanalys",
    text: "Förstå vilka pass, bord och menyval som driver mest värde — och vilka som lämnar pengar på bordet.",
  },
  {
    icon: CalendarClock,
    title: "Passanalys",
    text: "Se vilka dagar och tider som behöver extra kärlek, så ni kan planera personal och kampanjer i rätt tid.",
  },
  {
    icon: AlertTriangle,
    title: "Avbokningsmönster",
    text: "Upptäck varför gäster avbokar och vad ni kan göra för att fylla platserna innan de blir tomma.",
  },
  {
    icon: Eye,
    title: "Tydliga dashboards",
    text: "Slipp att gräva i kalkylark. Allt viktigt visas på ett ställe, redo att delas med teamet.",
  },
  {
    icon: Download,
    title: "Exportera och dela",
    text: "Dra rapporter för ledning, ägare eller banken — med siffror ni litar på.",
  },
  {
    icon: BarChart3,
    title: "Integration med bokningar",
    text: "Analysen baseras på riktiga bokningar, samtal och mejl — inte gissningar.",
  },
];

function AnalysPage() {
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />

      <section className="relative min-h-[70svh] sm:min-h-[80svh] overflow-hidden bg-forest-deep text-primary-foreground">
        <div className="site-container relative flex min-h-[70svh] sm:min-h-[80svh] flex-col justify-end pb-16 pt-32 sm:pb-24 sm:pt-40">
          <p className="mb-8 max-w-xl text-sm uppercase tracking-[0.28em] text-primary-foreground/60">
            Produkt
          </p>
          <h1 className="max-w-4xl text-5xl leading-[1.02] sm:text-7xl lg:text-8xl">
            Analys
          </h1>
          <p className="fade-up mt-8 max-w-2xl text-2xl leading-snug text-primary-foreground/90 sm:text-3xl">
            Se mönstren innan veckan börjar.
          </p>
          <p className="fade-up mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
            Seytro omvandlar bokningar, samtal och gästdata till tydliga insikter. Ni ser vilka
            pass som bär, var intäkten läcker och vad nästa vecka behöver — innan den börjar.
          </p>
          <div className="fade-up mt-10 flex flex-wrap items-center gap-4">
            <a
              href="mailto:hej@seytro.com?subject=Boka%20demo%20av%20Analys"
              className="rounded-full bg-primary-foreground px-8 py-4 text-sm font-medium text-forest-deep transition-opacity hover:opacity-90"
            >
              Boka demo
            </a>
            <Link
              to="/"
              hash="pelare"
              className="rounded-full border border-primary-foreground/40 px-8 py-4 text-sm text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Se hela plattformen
            </Link>
          </div>
        </div>
      </section>

      <section className="site-container section-y">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Översikt</p>
        <h2 className="mt-6 max-w-3xl text-3xl sm:text-[2.6rem]">
          Magkänsla är bra. Data är bättre.
        </h2>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          De flesta restaurangägare kan känna på sig när en vecka är svag. Men få vet exakt varför,
          och färre hinner göra något åt det innan det är för sent.
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Seytros Analys samlar allt i en tydlig vy. Bokningsläge, avbokningar, genomsnittlig
          spendering, kanalernas effektivitet och gästernas beteende — allt synliggörs så att ni kan
          agera istället för att reagera.
        </p>
      </section>

      <section className="bg-muted/50">
        <div className="site-container section-y">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Så fungerar det</p>
          <h2 className="mt-6 max-w-3xl text-3xl sm:text-[2.6rem]">
            Från rådata till beslut — utan att bli statistiker.
          </h2>

          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Realtidsdata från alla kanaler</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Analysen hämtar data från telefoni, mejl, bokningar och gästprofiler. Ni ser inte
                bara hur det gick — ni ser hur det går just nu.
              </p>
            </div>
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Tydliga trender och varningar</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Seytro lyfter fram det som avviker: ett pass som brukar vara fullt men plötsligt
                gapar tomt, en kanal som slutat konvertera, en meny som inte säljer som den brukar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container section-y">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Nyckelfördelar</p>
        <h2 className="mt-6 max-w-2xl text-3xl sm:text-[2.6rem]">
          Så hjälper Analys er att växa.
        </h2>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-raised"
            >
              <div className="grid h-12 w-12 place-items-center rounded-full bg-forest/10">
                <Icon className="h-5 w-5 text-forest" strokeWidth={1.5} />
              </div>
              <h3 className="mt-6 text-lg font-medium">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-forest-deep text-primary-foreground">
        <div className="site-container section-y">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-primary-foreground/60">
                Kom igång
              </p>
              <h2 className="mt-6 text-3xl sm:text-[2.6rem]">
                Koppla datakällorna — så får ni överblick direkt.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
                Seytro kopplas till ert bokningssystem, telefoni och mejl. Inom kort har ni en
                levande vy över verksamheten — och kan börja fatta beslut baserade på fakta.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="mailto:hej@seytro.com?subject=Boka%20demo%20av%20Analys"
                  className="inline-flex items-center gap-2 rounded-full bg-primary-foreground px-8 py-4 text-sm font-medium text-forest-deep transition-opacity hover:opacity-90"
                >
                  Boka demo
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  to="/"
                  className="rounded-full border border-primary-foreground/40 px-8 py-4 text-sm text-primary-foreground transition-colors hover:bg-primary-foreground/10"
                >
                  Tillbaka till startsidan
                </Link>
              </div>
            </div>
            <div className="rounded-2xl bg-primary-foreground/5 p-8 sm:p-12">
              <ol className="space-y-8">
                {[
                  "Koppla bokningssystem, telefoni och mejl.",
                  "Låt Seytro sammanställa nyckeltal och trender.",
                  "Gå från insikt till handling — varje vecka.",
                ].map((step, i) => (
                  <li key={step} className="flex items-start gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary-foreground/30 text-sm font-medium">
                      {i + 1}
                    </span>
                    <span className="pt-1 text-lg leading-relaxed text-primary-foreground/90">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
