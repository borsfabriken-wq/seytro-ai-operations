import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  CalendarCheck,
  Clock,
  Zap,
  ShieldCheck,
  TrendingUp,
  Globe,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/tillganglighet")({
  head: () => ({
    meta: [
      { title: "Tillgänglighet — Seytro" },
      {
        name: "description",
        content:
          "Seytros Tillgänglighet visar kapacitet i realtid — se lediga tider, fyll svaga pass och undervänd aldrig en gäst igen.",
      },
      { property: "og:title", content: "Tillgänglighet — Seytro" },
      {
        property: "og:description",
        content:
          "Kapacitet i realtid. Se lediga tider, fyll svaga pass och maximera varje sittning.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AvailabilityPage,
});

const benefits = [
  {
    icon: Clock,
    title: "Realtidskapacitet",
    text: "Se exakt vilka tider och bord som är lediga just nu — ingen mer gissning eller dubbelkoll i flera system.",
  },
  {
    icon: TrendingUp,
    title: "Fyll svaga pass",
    text: "Identifiera lågsäsonger och svaga sittningar tidigt så ni kan agera med kampanjer eller riktade erbjudanden.",
  },
  {
    icon: ShieldCheck,
    title: "Undervänd aldrig en gäst",
    text: "Tillgänglighet visas korrekt över alla kanaler så att gäster inte bokar tider som inte finns.",
  },
  {
    icon: Zap,
    title: "Automatiska uppdateringar",
    text: "När en bokning görs, ändras eller avbokas uppdateras tillgängligheten direkt överallt.",
  },
  {
    icon: Globe,
    title: "Samma bild överallt",
    text: "Telefon, mejl, webb och interna skärmar visar samma tillgänglighet — inga avvikelser.",
  },
  {
    icon: CalendarCheck,
    title: "Långsiktig planering",
    text: "Få överblick över kommande veckor och månader för att planera personal, inköp och evenemang.",
  },
];

function AvailabilityPage() {
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />

      <section className="relative min-h-[80vh] overflow-hidden bg-forest-deep text-primary-foreground">
        <div className="relative mx-auto flex min-h-[80vh] max-w-7xl flex-col justify-end px-6 pb-24 pt-40 sm:px-10">
          <p className="mb-8 max-w-xl text-sm uppercase tracking-[0.28em] text-primary-foreground/60">
            Produkt
          </p>
          <h1 className="max-w-4xl text-5xl leading-[1.02] sm:text-7xl lg:text-8xl">
            Tillgänglighet
          </h1>
          <p className="fade-up mt-8 max-w-2xl text-2xl leading-snug text-primary-foreground/90 sm:text-3xl">
            Kapacitet i realtid.
          </p>
          <p className="fade-up mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
            Seytro visar exakt vilka tider och bord som är lediga — över alla kanaler
            och hela tiden. Slipp dubbelbokningar, svaga pass och gäster som får nej
            trots att det finns plats.
          </p>
          <div className="fade-up mt-10 flex flex-wrap items-center gap-4">
            <a
              href="mailto:hej@seytro.com?subject=Boka%20demo%20av%20Tillg%C3%A4nglighet"
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

      <section className="mx-auto max-w-7xl px-6 py-28 sm:px-10">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Översikt</p>
        <h2 className="mt-6 max-w-3xl text-3xl leading-tight sm:text-4xl">
          Se vad som är ledigt — innan gästen ens frågar.
        </h2>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Att veta vad som är ledigt låter enkelt, men för de flesta restauranger är
          det en ständig utmaning. Bokningar kommer in via telefon, mejl, webb och
          ibland direkt vid dörren — och sällan hamnar de i samma system samtidigt.
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Seytros Tillgänglighet samlar allt i en gemensam vy. Varje kanal ser samma
          bild, varje förändring uppdateras i realtid, och ni kan äntligen lita på att
          det som visas som ledigt faktiskt är ledigt.
        </p>
      </section>

      <section className="bg-muted/50">
        <div className="mx-auto max-w-7xl px-6 py-28 sm:px-10">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Så fungerar det</p>
          <h2 className="mt-6 max-w-3xl text-3xl leading-tight sm:text-4xl">
            En enda sanning om vad som finns kvar.
          </h2>

          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Alla kanaler, samma data</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Oavsett om gästen ringer, mejlar eller bokar online ser de samma
                tillgänglighet. Systemet synkar automatiskt så att inget bord säljs
                två gånger.
              </p>
            </div>
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Smart kapacitetskontroll</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Tillgänglighet vägs inte bara mot bord, utan även mot köksbelastning,
                personalens sektioner och sittningstider. Ni undervänds aldrig en gäst
                och överbelastar aldrig köket.
              </p>
            </div>
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Insikter för kommande pass</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Se trender över dagar, veckor och månader. Identifiera svaga pass i
                tid och fyll dem med riktade erbjudanden eller kampanjer.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-28 sm:px-10">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Nyckelfördelar</p>
        <h2 className="mt-6 max-w-2xl text-3xl leading-tight sm:text-4xl">
          Så hjälper Tillgänglighet er att växa.
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
        <div className="mx-auto max-w-7xl px-6 py-28 sm:px-10">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-primary-foreground/60">
                Kom igång
              </p>
              <h2 className="mt-6 text-3xl leading-tight sm:text-4xl">
                Koppla kanalerna — så får ni en gemensam tillgänglighetsvy.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
                Anslut telefon, mejl, webb och bordsplacering till Seytro. Ställ in
                kapacitetsregler och låt systemet hålla koll på vad som är ledigt —
                dygnet runt.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="mailto:hej@seytro.com?subject=Boka%20demo%20av%20Tillg%C3%A4nglighet"
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
                  "Koppla alla bokningskanaler till Seytro.",
                  "Ställ in kapacitet, sittningstider och regler.",
                  "Låt Tillgänglighet visa en gemensam bild i realtid.",
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
