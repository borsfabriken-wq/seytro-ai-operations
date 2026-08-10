import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  ClipboardList,
  ShieldCheck,
  Clock,
  Users,
  CalendarX,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/bokningsregler")({
  head: () => ({
    meta: [
      { title: "Bokningsregler — Seytro" },
      {
        name: "description",
        content:
          "Seytros Bokningsregler låter er automatisera servicepolicyn — sittningstider, minsta förbrukning, grupptak och avbokningsvillkor sköts av sig självt.",
      },
      { property: "og:title", content: "Bokningsregler — Seytro" },
      {
        property: "og:description",
        content:
          "Er servicepolicy, automatiserad. Styr sittningar, grupptak och avbokningsvillkor utan att behöva påminna någon.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BookingRulesPage,
});

const benefits = [
  {
    icon: ShieldCheck,
    title: "Konsekvent service",
    text: "Samma regler gäller oavsett om gästen ringer, mejlar eller bokar online — ingen mer tolkningsfråga.",
  },
  {
    icon: Clock,
    title: "Sittningstider som håller",
    text: "Ställ in hur länge varje bord får sitta vid olika tillfällen så att ni kan vända fler gäster utan att stressa.",
  },
  {
    icon: Users,
    title: "Grupptak och minsta förbrukning",
    text: "Stora sällskap hanteras efter era villkor — automatiskt och med tydlig kommunikation till gästen.",
  },
  {
    icon: CalendarX,
    title: "Smarta avbokningsregler",
    text: "Sätt tidsgränser och villkor så att ni slipper tomma bord i sista stund.",
  },
  {
    icon: Sparkles,
    title: "Flexibla undantag",
    text: "Låt reglerna vara intelligenta — vissa dagar, tider eller gästtyper kan få sina egna villkor.",
  },
  {
    icon: ClipboardList,
    title: "Full spårbarhet",
    text: "Varje regel och varje undantag loggas så att ni alltid kan gå tillbaka och se vad som gällde.",
  },
];

function BookingRulesPage() {
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />

      <section className="relative min-h-[70svh] sm:min-h-[80svh] overflow-hidden bg-forest-deep text-primary-foreground">
        <div className="site-container relative flex min-h-[70svh] sm:min-h-[80svh] flex-col justify-end pb-16 pt-32 sm:pb-24 sm:pt-40">
          <p className="mb-8 max-w-xl text-sm uppercase tracking-[0.28em] text-primary-foreground/60">
            Produkt
          </p>
          <h1 className="max-w-4xl text-5xl leading-[1.02] sm:text-7xl lg:text-8xl">
            Bokningsregler
          </h1>
          <p className="fade-up mt-8 max-w-2xl text-2xl leading-snug text-primary-foreground/90 sm:text-3xl">
            Er servicepolicy, automatiserad.
          </p>
          <p className="fade-up mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
            Seytros Bokningsregler ser till att varje bokning följer era villkor —
            sittningstider, minsta förbrukning, grupptak och avbokningsvillkor
            hanteras automatiskt utan att personalen behöver påminna någon.
          </p>
          <div className="fade-up mt-10 flex flex-wrap items-center gap-4">
            <a
              href="mailto:hej@seytro.com?subject=Boka%20demo%20av%20Bokningsregler"
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

      <section className="site-container py-20 sm:py-28">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Översikt</p>
        <h2 className="mt-6 max-w-3xl text-3xl leading-tight sm:text-4xl">
          Låt reglerna göra jobbet åt er.
        </h2>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Varje restaurang har sin egen policy: hur länge ett bord får sitta, hur
          stora sällskap ni tar emot, vilka avbokningsvillkor som gäller. Problemet
          är att dessa regler ofta ligger i huvudet på några få personer — och glöms
          bort i stressen.
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Med Seytros Bokningsregler kodar ni in policyn en gång. Därefter tillämpas
          den automatiskt på varje bokningsförfrågan, oavsett om den kommer via
          telefon, mejl eller webb. Gästen får tydlig information, och ert team slipper
          stå i fronten och förklara.
        </p>
      </section>

      <section className="bg-muted/50">
        <div className="site-container py-20 sm:py-28">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Så fungerar det</p>
          <h2 className="mt-6 max-w-3xl text-3xl leading-tight sm:text-4xl">
            Regler som är tydliga för alla — utan att behöva förklaras.
          </h2>

          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Konfigurera er policy</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Ställ in sittningstider, grupptak, minsta förbrukning,
                avbokningsvillkor och särskilda regler för helger och evenemang.
                Allt sköts via ett enkelt gränssnitt.
              </p>
            </div>
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Automatisk tillämpning</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                När en bokningsförfrågan kommer in kontrollerar Seytro direkt om den
                uppfyller era regler. Om något avviker får gästen ett tydligt svar
                med förklaring och alternativ.
              </p>
            </div>
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Smarta undantag</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Vissa gäster eller tillfällen kräver flexibilitet. Skapa regler som
                gäller specifika dagar, tider eller gästsegment — utan att tumma på
                policyn i stort.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container py-20 sm:py-28">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Nyckelfördelar</p>
        <h2 className="mt-6 max-w-2xl text-3xl leading-tight sm:text-4xl">
          Så hjälper Bokningsregler er att växa.
        </h2>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-lg"
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
        <div className="site-container py-20 sm:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-primary-foreground/60">
                Kom igång
              </p>
              <h2 className="mt-6 text-3xl leading-tight sm:text-4xl">
                Ställ in reglerna — så sköter Seytro resten.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
                Sätt upp er servicepolicy i Seytro en gång. Därefter tillämpas den
                automatiskt på alla bokningsförfrågningar, så att ert team kan fokusera
                på gästen istället för på policyn.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="mailto:hej@seytro.com?subject=Boka%20demo%20av%20Bokningsregler"
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
                  "Definiera er servicepolicy i Seytro.",
                  "Koppla reglerna till bokningskanalerna.",
                  "Låt systemet tillämpa dem automatiskt.",
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
