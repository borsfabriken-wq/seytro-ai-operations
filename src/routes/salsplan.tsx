import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import floorPlanAsset from "@/assets/salsplan-floor.png.asset.json";
import {
  LayoutTemplate,
  Eye,
  Users,
  Zap,
  Clock,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/salsplan")({
  head: () => ({
    meta: [
      { title: "Salsplan — Seytro" },
      {
        name: "description",
        content:
          "Seytros Salsplan ger er en live-vy över hela servicen — bord, zoner, personal och gästflöden i realtid.",
      },
      { property: "og:title", content: "Salsplan — Seytro" },
      {
        property: "og:description",
        content:
          "Full koll på salen i realtid. Se bord, zoner och gästflöden — allt på en och samma vy.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FloorPlanPage,
});

const benefits = [
  {
    icon: Eye,
    title: "Live-vy över salen",
    text: "Se exakt vilka bord som är lediga, vilka som snart vänder och var det behöver hända saker just nu.",
  },
  {
    icon: Users,
    title: "Teamet i samma bild",
    text: "Servitörer, värdar och köket ser samma uppdaterade vy — ingen mer information som går förlorad i överlämningar.",
  },
  {
    icon: Zap,
    title: "Omedelbara uppdateringar",
    text: "När en bokning ändras, en gäst kommer eller ett bord vänder uppdateras vyn direkt.",
  },
  {
    icon: Clock,
    title: "Tidslinje för sittningen",
    text: "Följ sittningen från start till mål och se vilka pass som behöver extra uppmärksamhet.",
  },
  {
    icon: ShieldCheck,
    title: "Färre missförstånd",
    text: "Med en gemensam vy minskar risken för dubbelbokningar, glömda gäster och felplacerade sällskap.",
  },
  {
    icon: LayoutTemplate,
    title: "Anpassningsbar layout",
    text: "Rita in bord, zoner, barer och uteservering — anpassa vyn efter hur er restaurang faktiskt ser ut.",
  },
];

function FloorPlanPage() {
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />

      <section className="relative min-h-[70svh] sm:min-h-[80svh] overflow-hidden bg-forest-deep text-primary-foreground">
        <div className="site-container relative flex min-h-[70svh] sm:min-h-[80svh] flex-col justify-end pb-16 pt-32 sm:pb-24 sm:pt-40">
          <p className="mb-8 max-w-xl text-sm uppercase tracking-[0.28em] text-primary-foreground/60">
            Produkt
          </p>
          <h1 className="max-w-4xl text-5xl leading-[1.02] sm:text-7xl lg:text-8xl">
            Salsplan
          </h1>
          <p className="fade-up mt-8 max-w-2xl text-2xl leading-snug text-primary-foreground/90 sm:text-3xl">
            Live-vy över hela servicen.
          </p>
          <p className="fade-up mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
            Seytros Salsplan ger er full kontroll över restaurangen i realtid. Se vilka
            bord som är upptagna, vilka som snart vänder och var teamet behöver sätta
            in en extra växel — allt på en och samma skärm.
          </p>
          <div className="fade-up mt-10 flex flex-wrap items-center gap-4">
            <a
              href="mailto:hej@seytro.com?subject=Boka%20demo%20av%20Salsplan"
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
        <h2 className="mt-6 max-w-3xl text-3xl leading-tight sm:text-4xl">
          Sluta gissa. Börja se.
        </h2>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          En hektisk lördagskväll kräver mer än ett gäng papperslappar och ett
          plötsligt minne. Med Salsplan ser ni hela salen på en interaktiv vy:
          bokningar, gäster på plats, bord som snart blir lediga och zoner som
          behöver extra fokus.
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Alla i teamet — från värdar och servitörer till köket — tittar på samma
          bild. När något ändras uppdateras vyn omedelbart, så ni slipper springa
          runt och fråga "har de betalt än?" eller "är bord tolv ledigt?".
        </p>
      </section>

      <section className="bg-muted/50">
        <div className="site-container section-y">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Så fungerar det</p>
          <h2 className="mt-6 max-w-3xl text-3xl leading-tight sm:text-4xl">
            En vy som hela teamet kan lita på.
          </h2>

          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Interaktiv salsvy</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Varje bord, zon och station visas tydligt. Klicka på ett bord för att
                se aktuell bokning, gästinformation, särskilda önskemål och hur länge
                sällskapet har kvar på sittningen.
              </p>
            </div>
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Realtidsuppdateringar</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                När en gäst checkar in, en bokning avbokas eller ett bord vänder
                uppdateras vyn direkt. Ingen behöver ladda om sidan eller ropa ut
                förändringar över axeln.
              </p>
            </div>
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Tydlig överblick för alla roller</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Värdarna ser beläggning och väntetider, servitörerna ser sina sektioner
                och köket ser kommande pass. Samma vy, anpassad efter vad varje roll
                behöver veta.
              </p>
            </div>
          </div>

          <div className="mt-20">
            <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Exempel</p>
            <h3 className="mt-4 text-2xl font-medium leading-tight sm:text-3xl">
              En levande vy över borden.
            </h3>
            <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
              <img
                src={floorPlanAsset.url}
                alt="Exempel på interaktiv salsplan med bordsnummer"
                className="mx-auto block max-h-[28rem] w-auto object-contain p-4 sm:p-6"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="site-container section-y">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Nyckelfördelar</p>
        <h2 className="mt-6 max-w-2xl text-3xl leading-tight sm:text-4xl">
          Så hjälper Salsplan er att växa.
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
              <h2 className="mt-6 text-3xl leading-tight sm:text-4xl">
                Bygg er salsplan — så får ni full överblick.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
                Rita in er restaurang, lägg till bord och zoner, och koppla på
                bokningsflödet. Inom kort har hela teamet samma live-vy över servicen.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="mailto:hej@seytro.com?subject=Boka%20demo%20av%20Salsplan"
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
                  "Rita in er salsplan och lägg till bord.",
                  "Koppla bokningar och gästflöden till vyn.",
                  "Låt teamet följa servicen i realtid.",
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
