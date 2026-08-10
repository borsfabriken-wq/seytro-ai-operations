import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  Gauge,
  PhoneIncoming,
  MailOpen,
  CalendarDays,
  BarChart2,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/losningar/hogvolymsverksamheter")({
  head: () => ({
    meta: [
      { title: "Högvolymsverksamheter — Seytro" },
      {
        name: "description",
        content:
          "Seytro hjälper högvolymsverksamheter att hantera rusning, automatisera bokningar och behålla kvaliteten när trycket är som högst.",
      },
      { property: "og:title", content: "Högvolymsverksamheter — Seytro" },
      {
        property: "og:description",
        content:
          "Hantera rusning utan stress. AI-driven kommunikation och drift för högvolymsrestauranger.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HogvolymsverksamheterPage,
});

const benefits = [
  {
    icon: PhoneIncoming,
    title: "Inga upptagetton",
    text: "Seytro besvarar tusentals samtal samtidigt utan att någon gäst hamnar i kö eller röstbrevlåda.",
  },
  {
    icon: MailOpen,
    title: "Mejl som inte hinner staplas",
    text: "Förfrågningar hanteras direkt — även under lunchrusningen när köket och personalen har fullt upp.",
  },
  {
    icon: CalendarDays,
    title: "Automatisk kapacitetsstyrning",
    text: "Bokningar anpassas efter tillgänglighet, salsplan och rusningsschema så att ni maxar varje sittning.",
  },
  {
    icon: Gauge,
    title: "Håll takten uppe",
    text: "Seytro skalar upp och ner automatiskt efter trycket — ingen extra bemanning behövs.",
  },
  {
    icon: BarChart2,
    title: "Insikt i realtid",
    text: "Se beläggning, svarstider och gästflöden live — så att ni kan justera innan det blir trångt.",
  },
  {
    icon: ShieldAlert,
    title: "Eskalering när det behövs",
    text: "Komplexa ärenden lyfts till rätt person med full kontext, så inget viktigt försvinner i mängden.",
  },
];

function HogvolymsverksamheterPage() {
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />

      <section className="relative min-h-[70svh] sm:min-h-[80svh] overflow-hidden bg-forest-deep text-primary-foreground">
        <div className="site-container relative flex min-h-[70svh] sm:min-h-[80svh] flex-col justify-end pb-16 pt-32 sm:pb-24 sm:pt-40">
          <p className="mb-8 max-w-xl text-sm uppercase tracking-[0.28em] text-primary-foreground/60">
            Lösningar
          </p>
          <h1 className="max-w-4xl text-5xl leading-[1.02] sm:text-7xl lg:text-8xl">
            Högvolymsverksamheter
          </h1>
          <p className="fade-up mt-8 max-w-2xl text-2xl leading-snug text-primary-foreground/90 sm:text-3xl">
            Hantera rusning utan stress.
          </p>
          <p className="fade-up mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
            När trycket är som högst räcker inte personalen till. Seytro tar emot samtal, mejl och
            bokningar i skala — så att ni kan fokusera på att servera.
          </p>
          <div className="fade-up mt-10 flex flex-wrap items-center gap-4">
            <a
              href="mailto:hej@seytro.com?subject=Boka%20demo%20f%C3%B6r%20h%C3%B6gvolymsverksamhet"
              className="rounded-full bg-primary-foreground px-8 py-4 text-sm font-medium text-forest-deep transition-opacity hover:opacity-90"
            >
              Boka demo
            </a>
            <Link
              to="/"
              hash="losningar"
              className="rounded-full border border-primary-foreground/40 px-8 py-4 text-sm text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Se alla lösningar
            </Link>
          </div>
        </div>
      </section>

      <section className="site-container section-y">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Översikt</p>
        <h2 className="mt-6 max-w-3xl text-3xl sm:text-[2.6rem]">
          Rusning ska inte betyda sämre service.
        </h2>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Högvolymsverksamheter lever och dör efter flödet. En lång kö vid telefonen, en inkorg full
          av mejl och en salsplan som aldrig riktigt hinner synkas — små problem som blir stora när
          det är som mest press.
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Seytro automatiserar gästkommunikationen och bokningsflödet så att ni kan hantera mer utan
          att anställa mer. Gästen får snabbare svar, personalen får färre avbrott, och verksamheten
          får bättre kontroll.
        </p>
      </section>

      <section className="bg-muted/50">
        <div className="site-container section-y">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Så fungerar det</p>
          <h2 className="mt-6 max-w-3xl text-3xl sm:text-[2.6rem]">
            Skalbar service som växer med trycket.
          </h2>

          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Obegränsad kapacitet</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Seytro hanterar många samtal och mejl samtidigt. Ingen gäst behöver vänta i telefonkö
                eller undra om deras förfrågan kommit fram.
              </p>
            </div>
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Smart bordsoptimering</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Bordsplacering och salsplan synkas med bokningarna i realtid. Ni maxar antalet gäster
                utan att överbelasta köket eller servisen.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container section-y">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Nyckelfördelar</p>
        <h2 className="mt-6 max-w-2xl text-3xl sm:text-[2.6rem]">
          Så hjälper Seytro er att klara rusningen.
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
        <div className="site-container section-y">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-primary-foreground/60">
                Kom igång
              </p>
              <h2 className="mt-6 text-3xl sm:text-[2.6rem]">
                Rusta verksamheten för högtryck.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
                Seytro kopplas till era kanaler och bokningssystem. På kort tid har ni en assistent
                som klarar rusningen — utan att tumma på gästupplevelsen.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="mailto:hej@seytro.com?subject=Boka%20demo%20f%C3%B6r%20h%C3%B6gvolymsverksamhet"
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
                  "Analysera era rusningstoppar och kontaktvägar.",
                  "Koppla telefoni, mejl och bokningssystem.",
                  "Aktivera automatisk hantering och realtidsrapportering.",
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
