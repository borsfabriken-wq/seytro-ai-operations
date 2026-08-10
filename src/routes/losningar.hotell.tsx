import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  ConciergeBell,
  Clock,
  Languages,
  CalendarCheck,
  Headset,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/losningar/hotell")({
  head: () => ({
    meta: [
      { title: "Hotell — Seytro" },
      {
        name: "description",
        content:
          "Seytro ger hotell dygnet-runt-gästservice via röst och mejl, automatiska bokningshanteringar och flerspråkig kommunikation.",
      },
      { property: "og:title", content: "Hotell — Seytro" },
      {
        property: "og:description",
        content:
          "Gästservice dygnet runt. AI-driven kommunikation och bokning för hotellrestauranger och receptioner.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HotellPage,
});

const benefits = [
  {
    icon: Clock,
    title: "24/7 tillgänglighet",
    text: "Gäster ringer och mejlar när det passar dem — Seytro svarar även när receptionen har stängt.",
  },
  {
    icon: Languages,
    title: "Flerspråkig service",
    text: "Gästen får hjälp på sitt språk, oavsett om det är svenska, engelska, tyska eller något annat.",
  },
  {
    icon: CalendarCheck,
    title: "Restaurangbokningar på autopilot",
    text: "Bordsbokningar, frågor om meny och specialönskemål hanteras utan att belasta receptionen.",
  },
  {
    icon: ConciergeBell,
    title: "Hotellkänsla i varje möte",
    text: "Gästen känner sig sedd och omhändertagen — även när frågan hanteras av AI.",
  },
  {
    icon: Headset,
    title: "Smidig eskalering",
    text: "När en fråga kräver mänsklig handläggning kopplas den till rätt avdelning med full kontext.",
  },
  {
    icon: ShieldCheck,
    title: "Konsekvent kvalitet",
    text: "Samma servicegrad oavsett skift, säsong eller personalomsättning.",
  },
];

function HotellPage() {
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />

      <section className="relative min-h-[80vh] overflow-hidden bg-forest-deep text-primary-foreground">
        <div className="site-container relative flex min-h-[80vh] flex-col justify-end pb-24 pt-40">
          <p className="mb-8 max-w-xl text-sm uppercase tracking-[0.28em] text-primary-foreground/60">
            Lösningar
          </p>
          <h1 className="max-w-4xl text-5xl leading-[1.02] sm:text-7xl lg:text-8xl">Hotell</h1>
          <p className="fade-up mt-8 max-w-2xl text-2xl leading-snug text-primary-foreground/90 sm:text-3xl">
            Gästservice dygnet runt — utan att springa i korridorerna.
          </p>
          <p className="fade-up mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
            Hotellgäster ställer frågor dygnet runt. Seytro ser till att varje samtal och mejl blir
            ett snabbt, välkomnande svar — oavsett om klockan är nio på morgonen eller midnatt.
          </p>
          <div className="fade-up mt-10 flex flex-wrap items-center gap-4">
            <a
              href="mailto:hej@seytro.com?subject=Boka%20demo%20f%C3%B6r%20hotell"
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
          Receptionen har inte alltid öppet. Gästens behov har det.
        </h2>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          På ett hotell är gästupplevelsen en summa av många små möten. En fråga om restaurangbokning,
          en förfrågan om allergier, ett samtal sent på kvällen om öppettider.
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Seytro hanterar dessa möten så att personalen kan fokusera på det som kräver närvaro —
          gästen som står framför disken, rummet som behöver lösas, den speciella förfrågan som
          behöver en mänsklig touch.
        </p>
      </section>

      <section className="bg-muted/50">
        <div className="site-container py-28">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Så fungerar det</p>
          <h2 className="mt-6 max-w-3xl text-3xl leading-tight sm:text-4xl">
            En concierge som aldrig går hem.
          </h2>

          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Alla kanaler, ett svar</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Telefon, mejl och bokningsförfrågningar samlas i Seytro. Gästen får svar på sitt
                språk, och hotellet får en tydlig logg över varje ärende.
              </p>
            </div>
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Integrerat med hotellets flöden</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Bokningar synkas med restaurangens tillgänglighet, specialönskemål följer gästen
                och eskalering går till rätt avdelning — reception, F&B eller concierge.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container py-28">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Nyckelfördelar</p>
        <h2 className="mt-6 max-w-2xl text-3xl leading-tight sm:text-4xl">
          Så hjälper Seytro hotell att sova gott.
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
                Börja med receptionen och restaurangen.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
                De flesta hotell börjar med att koppla telefoni och mejl för restaurangbokningar.
                Därefter kan ni utöka till concierge-frågor, gästinsikt och kampanjer.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="mailto:hej@seytro.com?subject=Boka%20demo%20f%C3%B6r%20hotell"
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
                  "Kartlägg gästens vanligaste frågor och kontaktvägar.",
                  "Koppla telefoni, mejl och bokningssystem.",
                  "Aktivera flerspråkig service och eskalering.",
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
