import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  Star,
  Sparkles,
  UserRound,
  Wine,
  CalendarDays,
  MessageCircleHeart,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/losningar/fine-dining")({
  head: () => ({
    meta: [
      { title: "Fine dining — Seytro" },
      {
        name: "description",
        content:
          "Seytro hjälper fine dining-restauranger att förstärka det personliga mötet med exakt gästdata, smidig kommunikation och sömlös bokningshantering.",
      },
      { property: "og:title", content: "Fine dining — Seytro" },
      {
        property: "og:description",
        content:
          "Detaljrikedom utan kompromiss. AI-driven gästservice för fine dining-restauranger.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FineDiningPage,
});

const benefits = [
  {
    icon: UserRound,
    title: "Känn varje gäst",
    text: "VIP-varning, preferenser och besökshistorik visas för personalen innan gästen ens har tagit av sig jackan.",
  },
  {
    icon: Wine,
    title: "Kom ihåg detaljerna",
    text: "Favoritvin, allergier, födelsedagar och sällskapsstorlek — allt synkat med bokningen.",
  },
  {
    icon: CalendarDays,
    title: "Perfekt bordsplanering",
    text: "Bordsplacering och salsplan anpassas efter gästens profil och kvällens flöde.",
  },
  {
    icon: MessageCircleHeart,
    title: "Diskret kommunikation",
    text: "Mejl och samtal hanteras snabbt och elegant, utan att störa den personliga servicen i lokalen.",
  },
  {
    icon: Sparkles,
    title: "Magiska ögonblick",
    text: "Överraska återkommande gäster med det lilla extra — baserat på data som ni redan har.",
  },
  {
    icon: Star,
    title: "Värna om varje stjärna",
    text: "Varje gäst ska känna sig som den viktigaste. Seytro ser till att inget detalj glöms bort.",
  },
];

function FineDiningPage() {
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />

      <section className="relative min-h-[80vh] overflow-hidden bg-forest-deep text-primary-foreground">
        <div className="site-container relative flex min-h-[80vh] flex-col justify-end pb-24 pt-40">
          <p className="mb-8 max-w-xl text-sm uppercase tracking-[0.28em] text-primary-foreground/60">
            Lösningar
          </p>
          <h1 className="max-w-4xl text-5xl leading-[1.02] sm:text-7xl lg:text-8xl">
            Fine dining
          </h1>
          <p className="fade-up mt-8 max-w-2xl text-2xl leading-snug text-primary-foreground/90 sm:text-3xl">
            Detaljrikedom utan kompromiss.
          </p>
          <p className="fade-up mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
            I fine dining handlar allt om förberedelse och precision. Seytro ser till att er
            personal har rätt information vid rätt tillfälle — utan att behöva jaga den.
          </p>
          <div className="fade-up mt-10 flex flex-wrap items-center gap-4">
            <a
              href="mailto:hej@seytro.com?subject=Boka%20demo%20f%C3%B6r%20fine%20dining"
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

      <section className="site-container py-28">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Översikt</p>
        <h2 className="mt-6 max-w-3xl text-3xl leading-tight sm:text-4xl">
          Det personliga mötet börjar långt innan gästen kommer.
        </h2>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Fine dining handlar om förväntan. Gästen ska känna sig sedd, förstådd och välkommen — från
          första mejlet till sista koppen kaffe.
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Seytro samlar varje detalj från bokning, samtal och tidigare besök så att personalen kan
          förbereda sig. Resultatet är en upplevelse som känns intuitiv, inte påtvingad.
        </p>
      </section>

      <section className="bg-muted/50">
        <div className="site-container py-28">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Så fungerar det</p>
          <h2 className="mt-6 max-w-3xl text-3xl leading-tight sm:text-4xl">
            Teknik som förstärker det mänskliga, inte ersätter det.
          </h2>

          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Gästprofiler i förväg</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                När en bokning kommer in visas gästens historia, preferenser och särskilda önskemål.
                Servisen kan förbereda bord, vin och välkomnande innan gästen anländer.
              </p>
            </div>
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Diskret administration</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Telefon och mejl hanteras snabbt och korrekt, så att personalen kan ägna sig åt det
                som händer i matsalen — inte skärmen.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container py-28">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Nyckelfördelar</p>
        <h2 className="mt-6 max-w-2xl text-3xl leading-tight sm:text-4xl">
          Så hjälper Seytro er att skapa oförglömliga upplevelser.
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
                Lyft gästupplevelsen med data ni redan har.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
                Seytro kopplas till ert bokningssystem och kommunikationskanaler. På kort tid får
                ni en tydligare bild av varje gäst — och fler tillfällen att överraska.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="mailto:hej@seytro.com?subject=Boka%20demo%20f%C3%B6r%20fine%20dining"
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
                  "Boka en konsultation om era gästflöden.",
                  "Koppla bokningssystem, mejl och telefoni.",
                  "Börja bygga rikare gästprofiler från dag ett.",
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
