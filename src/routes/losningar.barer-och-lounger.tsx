import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  Martini,
  Zap,
  MessageSquareText,
  CalendarClock,
  Users,
  PartyPopper,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/losningar/barer-och-lounger")({
  head: () => ({
    meta: [
      { title: "Barer och lounger — Seytro" },
      {
        name: "description",
        content:
          "Seytro hjälper barer och lounger att hantera snabb kommunikation, sällskapsbokningar och gästfrågor utan att störa stämningen.",
      },
      { property: "og:title", content: "Barer och lounger — Seytro" },
      {
        property: "og:description",
        content:
          "Snabb och smidig kommunikation. AI-driven bokning och gästservice för barer och lounger.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BarerOchLoungerPage,
});

const benefits = [
  {
    icon: Zap,
    title: "Snabba svar i rusning",
    text: "När det är fullt fokus på gästerna i baren sköter Seytro telefon och mejl i bakgrunden.",
  },
  {
    icon: MessageSquareText,
    title: "Konversationell bokning",
    text: "Gäster bokar bord eller ställer frågor som om de chattade med en vän — på kvällen eller dagen innan.",
  },
  {
    icon: CalendarClock,
    title: "Flexibel kapacitet",
    text: "Seytro känner till bord, ståplatser och gästflöden så att ni kan optimera varje kväll.",
  },
  {
    icon: Users,
    title: "Sällskapsbokningar utan krångel",
    text: "Stora sällskap, speciella önskemål och gruppbokningar hanteras smidigt utan att belasta personalen.",
  },
  {
    icon: PartyPopper,
    title: "Event och VIP-listor",
    text: "Hantera gästlistor, bokningar och förfrågningar för kvällens event — allt samlat på ett ställe.",
  },
  {
    icon: Martini,
    title: "Stämningen först",
    text: "Låt personalen vara där gästerna är. Administrationen sköter Seytro.",
  },
];

function BarerOchLoungerPage() {
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />

      <section className="relative min-h-[70svh] sm:min-h-[80svh] overflow-hidden bg-forest-deep text-primary-foreground">
        <div className="site-container relative flex min-h-[70svh] sm:min-h-[80svh] flex-col justify-end pb-16 pt-32 sm:pb-24 sm:pt-40">
          <p className="mb-8 max-w-xl text-sm uppercase tracking-[0.28em] text-primary-foreground/60">
            Lösningar
          </p>
          <h1 className="max-w-4xl text-5xl leading-[1.02] sm:text-7xl lg:text-8xl">
            Barer och lounger
          </h1>
          <p className="fade-up mt-8 max-w-2xl text-2xl leading-snug text-primary-foreground/90 sm:text-3xl">
            Snabb och smidig kommunikation — utan att störa stämningen.
          </p>
          <p className="fade-up mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
            I baren är tempot allt. Seytro ser till att bokningar, frågor och förfrågningar hanteras
            snabbt och enkelt — så att personalen kan fokusera på gästerna framför sig.
          </p>
          <div className="fade-up mt-10 flex flex-wrap items-center gap-4">
            <a
              href="mailto:hej@seytro.com?subject=Boka%20demo%20f%C3%B6r%20bar%20eller%20lounge"
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
          Det ringer hela tiden. Gästerna framför dig ska inte märka det.
        </h2>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Baren är en plats för närvaro. Varje titt på telefonen eller mejlen tar fokus från den
          gäst som just nu står vid disken och väntar på uppmärksamhet.
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Seytro tar emot samtal och mejl, bokar bord, svarar på frågor och eskalerar det som behöver
          en mänsklig hand — allt utan att störa stämningen.
        </p>
      </section>

      <section className="bg-muted/50">
        <div className="site-container section-y">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Så fungerar det</p>
          <h2 className="mt-6 max-w-3xl text-3xl sm:text-[2.6rem]">
            Ett smidigt flöde i ett högt tempo.
          </h2>

          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Automatiska bokningar</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Gäster bokar bord via telefon eller mejl utan att personalen behöver lyfta ett finger.
                Seytro känner till kapacitet, ståplatser och kvällens schema.
              </p>
            </div>
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Event och sällskap</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Större sällskap och eventförfrågningar hanteras med samma enkelhet. Seytro samlar
                informationen och skickar vidare till rätt person om det behövs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container section-y">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Nyckelfördelar</p>
        <h2 className="mt-6 max-w-2xl text-3xl sm:text-[2.6rem]">
          Så hjälper Seytro er att hålla takten uppe.
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
                Koppla barflödet — så slipper ni avbryta gästerna.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
                Seytro kopplas till telefoni, mejl och bokningssystem. På nolltid har ni en assistent
                som hanterar det administrativa så att ni kan fokusera på stämningen.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="mailto:hej@seytro.com?subject=Boka%20demo%20f%C3%B6r%20bar%20eller%20lounge"
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
                  "Koppla telefoni och mejl till Seytro.",
                  "Ställ in bokningsregler och kapacitet.",
                  "Låt agenten ta emot förfrågningar dygnet runt.",
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
