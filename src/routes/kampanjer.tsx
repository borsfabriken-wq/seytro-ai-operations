import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  Megaphone,
  Users,
  Mail,
  MessageCircle,
  Target,
  Repeat,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/kampanjer")({
  head: () => ({
    meta: [
      { title: "Kampanjer — Seytro" },
      {
        name: "description",
        content:
          "Seytros Kampanjer hjälper restauranger och hotell att nå rätt gäster vid rätt tillfälle — med automatiserad, personlig kommunikation.",
      },
      { property: "og:title", content: "Kampanjer — Seytro" },
      {
        property: "og:description",
        content:
          "Fyll svaga pass med rätt gäster. AI-driven kampanjhantering för restauranger och hotell.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: KampanjerPage,
});

const benefits = [
  {
    icon: Users,
    title: "Smart segmentering",
    text: "Nå gäster utifrån beteende, tidigare besök och preferenser — inte bara e-postadress.",
  },
  {
    icon: Target,
    title: "Rätt timing",
    text: "Skicka erbjudanden när gästen är mest benägen att boka, inte när det passar er kalender.",
  },
  {
    icon: Mail,
    title: "Flera kanaler",
    text: "Mejl, SMS och röstmeddelanden — använd den kanal som passar gästen och tillfället bäst.",
  },
  {
    icon: MessageCircle,
    title: "Personlig ton",
    text: "Varje utskick låter som ert hus och anpassas efter mottagaren, inte efter en mall.",
  },
  {
    icon: Repeat,
    title: "Automatiserade flöden",
    text: "Sätt upp regler som skickar välkomstmejl, återbesöksinbjudningar och födelsedagserbjudanden automatiskt.",
  },
  {
    icon: Megaphone,
    title: "Mätbar effekt",
    text: "Se öppningsgrader, bokningar och intäkt — så ni vet vilka kampanjer som faktiskt fungerar.",
  },
];

function KampanjerPage() {
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />

      <section className="relative min-h-[80vh] overflow-hidden bg-forest-deep text-primary-foreground">
        <div className="site-container relative flex min-h-[80vh] flex-col justify-end pb-24 pt-40">
          <p className="mb-8 max-w-xl text-sm uppercase tracking-[0.28em] text-primary-foreground/60">
            Produkt
          </p>
          <h1 className="max-w-4xl text-5xl leading-[1.02] sm:text-7xl lg:text-8xl">
            Kampanjer
          </h1>
          <p className="fade-up mt-8 max-w-2xl text-2xl leading-snug text-primary-foreground/90 sm:text-3xl">
            Fyll svaga pass med rätt gäster.
          </p>
          <p className="fade-up mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
            Seytro hjälper er att nå ut till rätt gäster vid rätt tillfälle — med automatiserade,
            personliga kampanjer som känns som service, inte reklam.
          </p>
          <div className="fade-up mt-10 flex flex-wrap items-center gap-4">
            <a
              href="mailto:hej@seytro.com?subject=Boka%20demo%20av%20Kampanjer"
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

      <section className="site-container py-28">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Översikt</p>
        <h2 className="mt-6 max-w-3xl text-3xl leading-tight sm:text-4xl">
          Lågsäsongen är inte ett problem — bara ett kommunikationsproblem.
        </h2>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Varje restaurang har svaga pass. Måndag kväll. Första veckan i januari. En regnig
          torsdag. Istället för att hoppas att någon ringer kan ni själva bjuda in de gäster som
          faktiskt vill komma.
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Seytros Kampanjer använder gästinsikt för att skapa erbjudanden som känns relevanta. En
          vinintresserad gäst får ett provningserbjudande. En företagskund får en lunchinbjudan.
          Stamgästen får en personlig välkomst tillbaka.
        </p>
      </section>

      <section className="bg-muted/50">
        <div className="site-container py-28">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Så fungerar det</p>
          <h2 className="mt-6 max-w-3xl text-3xl leading-tight sm:text-4xl">
            Ett segment, ett erbjudande, ett utskick — sedan fyller borden sig själva.
          </h2>

          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Bygg kampanjer på riktig data</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Välj målgrupp utifrån besökshistorik, preferenser och beteende. Seytro vet vilka
                gäster som brukar boka sent, vilka som älskar set menus och vilka som inte varit
                på länge.
              </p>
            </div>
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Automatiska flöden</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Sätt upp regler en gång och låt systemet skicka välkomstmejl, återbesöksinbjudningar
                och födelsedagserbjudanden åt er. Ni behöver inte komma ihåg vem som ska ha vad.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container py-28">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Nyckelfördelar</p>
        <h2 className="mt-6 max-w-2xl text-3xl leading-tight sm:text-4xl">
          Så hjälper Kampanjer er att växa.
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
        <div className="site-container py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-primary-foreground/60">
                Kom igång
              </p>
              <h2 className="mt-6 text-3xl leading-tight sm:text-4xl">
                Bygg er första kampanj — så börjar svaga pass fyllas.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
                Välj ett segment, skriv ett erbjudande i husets ton och skicka. Seytro mäter
                resultatet så ni kan göra nästa kampanj ännu bättre.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="mailto:hej@seytro.com?subject=Boka%20demo%20av%20Kampanjer"
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
                  "Välj målgrupp utifrån gästdata och beteende.",
                  "Skapa ett erbjudande i er egen ton och stil.",
                  "Skicka, mät resultatet och förbättra nästa gång.",
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
