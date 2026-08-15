import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  Phone,
  Mail,
  CalendarCheck,
  Users,
  Heart,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/losningar/fristaende-restauranger")({
  head: () => ({
    meta: [
      { title: "Fristående restauranger — Seytro" },
      {
        name: "description",
        content:
          "Seytro ger fristående restauranger verktygen att konkurrera med stora kedjor — utan att förlora den personliga känslan.",
      },
      { property: "og:title", content: "Fristående restauranger — Seytro" },
      {
        property: "og:description",
        content:
          "Personlig service i världsklass. AI-driven gästkommunikation och drift för enskilda restauranger.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FristaendeRestaurangerPage,
});

const benefits = [
  {
    icon: Phone,
    title: "Svara på varje samtal",
    text: "Aldrig missa en bokning för att telefonen inte hanns med. Röstagenten tar emot gäster dygnet runt.",
  },
  {
    icon: Mail,
    title: "Mejl som blir handling",
    text: "Förfrågningar om bord, allergier och sällskap hanteras automatiskt — utan att något fastnar i inkorgen.",
  },
  {
    icon: CalendarCheck,
    title: "Färre dubbelbokningar",
    text: "Bokningsassistenten synkar tillgänglighet och regler så att bordet alltid går rätt.",
  },
  {
    icon: Users,
    title: "Känn gästen vid dörren",
    text: "Gästinsikten samlar preferenser och besökshistorik så att varje välkomnande känns personligt.",
  },
  {
    icon: Heart,
    title: "Bygg lojalitet",
    text: "Kom ihåg födelsedagar, favoriter och speciella önskemål — utan att personalen behöver memorera allt.",
  },
  {
    icon: TrendingUp,
    title: "Växt utan att växa ifrån dig själv",
    text: "Fler gäster ska inte betyda sämre service. Seytro skalar upp det administrativa så ni kan fokusera på maten.",
  },
];

function FristaendeRestaurangerPage() {
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />

      <section className="relative min-h-[70svh] sm:min-h-[80svh] overflow-hidden bg-forest-deep text-primary-foreground">
        <div className="site-container relative flex min-h-[70svh] sm:min-h-[80svh] flex-col justify-end pb-16 pt-32 sm:pb-24 sm:pt-40">
          <p className="mb-8 max-w-xl text-sm uppercase tracking-[0.28em] text-primary-foreground/60">
            Lösningar
          </p>
          <h1 className="max-w-4xl text-5xl leading-[1.02] sm:text-7xl lg:text-8xl">
            Fristående restauranger
          </h1>
          <p className="fade-up mt-8 max-w-2xl text-2xl leading-snug text-primary-foreground/90 sm:text-3xl">
            Personlig service i världsklass — utan världskedjans resurser.
          </p>
          <p className="fade-up mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
            Ni har byggt restaurangen på kärlek till detaljer, smak och relationer. Seytro ser till
            att inget av det går förlorat när telefonen ringer samtidigt som köksluckan går ut.
          </p>
          <div className="fade-up mt-10 flex flex-wrap items-center gap-4">
            <a
              href="mailto:hej@seytro.com?subject=Boka%20demo%20f%C3%B6r%20frist%C3%A5ende%20restaurang"
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
          Det lilla köket har sällan ett helt kontor bakom sig.
        </h2>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          På en fristående restaurang är varje person oumbärlig. Kocken lagar, servitrisen svarar,
          ägaren gör bokslutet — och någonstans däremellan ska gäster också få svar på mejl och
          telefon.
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Seytro tar över de uppgifter som äter tid utan att ge gästen en känsla av att prata med en
          maskin. Bokningar, frågor och uppföljningar sköts automatiskt, så att ni kan lägga tiden
          där den märks: i maten, i rummet och i mötet med gästen.
        </p>
      </section>

      <section className="bg-muted/50">
        <div className="site-container section-y">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Så fungerar det</p>
          <h2 className="mt-6 max-w-3xl text-3xl sm:text-[2.6rem]">
            En plattform som förstår att ni är mer än en bokningskurva.
          </h2>

          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Gästen möts dygnet runt</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Oavsett om någon ringer efter stängning eller mejlar från en annan tidszon svarar
                Seytro. Förfrågningar blir bokningar, och bokningar blir förberedda värdar.
              </p>
            </div>
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Relationerna blir djupare</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                När gästen kommer tillbaka vet ni redan vem de är. Favoritbordet, allergierna,
                förra gångens rosé — allt finns där utan att någon behöver fråga igen.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container section-y">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Nyckelfördelar</p>
        <h2 className="mt-6 max-w-2xl text-3xl sm:text-[2.6rem]">
          Så hjälper Seytro er att hålla det personligt — även när det går snabbt.
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
                Börja med en kanal — expandera i takt med verksamheten.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
                Många fristående restauranger börjar med Röstagenten eller E-postconciergen. När ni
                växer lägger ni till bordsplacering, gästinsikt och analys — allt i samma system.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="mailto:hej@seytro.com?subject=Boka%20demo%20f%C3%B6r%20frist%C3%A5ende%20restaurang"
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
                  "Boka en demo anpassad efter er verksamhet.",
                  "Koppla telefoni, mejl och bokningssystem.",
                  "Aktivera de funktioner ni behöver först.",
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
