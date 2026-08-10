import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  Building2,
  Layers,
  SlidersHorizontal,
  BarChart3,
  Users,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/losningar/restauranggrupper")({
  head: () => ({
    meta: [
      { title: "Restauranggrupper — Seytro" },
      {
        name: "description",
        content:
          "Seytro ger restauranggrupper enhetlig gästservice, centraliserad insikt och skalbar drift över alla enheter.",
      },
      { property: "og:title", content: "Restauranggrupper — Seytro" },
      {
        property: "og:description",
        content:
          "Skalbarhet över alla enheter. AI-driven drift och gästkommunikation för restauranggrupper.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RestauranggrupperPage,
});

const benefits = [
  {
    icon: Building2,
    title: "Enhetlig gästupplevelse",
    text: "Samma servicegrad oavsett vilken enhet gästen kontaktar — telefon, mejl eller bokning.",
  },
  {
    icon: Layers,
    title: "Delad kunskap",
    text: "En gäst som besöker flera av era restauranger behöver inte börja om varje gång.",
  },
  {
    icon: SlidersHorizontal,
    title: "Lokala regler, central styrning",
    text: "Varje enhet behåller sina öppettider, bordsplaner och regler — men drift och rapportering samlas på ett ställe.",
  },
  {
    icon: BarChart3,
    title: "Jämförbarhet över enheter",
    text: "Se beläggning, svarstider, gästnöjdhet och intäkter sida vid sida.",
  },
  {
    icon: Users,
    title: "Centraliserad gästdata",
    text: "Bygg gruppövergripande lojalitetsprogram och kampanjer baserat på samlade gästprofiler.",
  },
  {
    icon: ShieldCheck,
    title: "Kontroll utan flaskhalsar",
    text: "Bestäm riktlinjer centralt och låt varje enhet fokusera på att välkomna gäster.",
  },
];

function RestauranggrupperPage() {
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />

      <section className="relative min-h-[70svh] sm:min-h-[80svh] overflow-hidden bg-forest-deep text-primary-foreground">
        <div className="site-container relative flex min-h-[70svh] sm:min-h-[80svh] flex-col justify-end pb-16 pt-32 sm:pb-24 sm:pt-40">
          <p className="mb-8 max-w-xl text-sm uppercase tracking-[0.28em] text-primary-foreground/60">
            Lösningar
          </p>
          <h1 className="max-w-4xl text-5xl leading-[1.02] sm:text-7xl lg:text-8xl">
            Restauranggrupper
          </h1>
          <p className="fade-up mt-8 max-w-2xl text-2xl leading-snug text-primary-foreground/90 sm:text-3xl">
            Skalbarhet över alla enheter — utan att tappa känslan.
          </p>
          <p className="fade-up mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
            När verksamheten växer från en till flera restauranger blir det svårare att hålla
            kvaliteten jämn. Seytro ger er en gemensam plattform för gästkommunikation, drift och
            insikt.
          </p>
          <div className="fade-up mt-10 flex flex-wrap items-center gap-4">
            <a
              href="mailto:hej@seytro.com?subject=Boka%20demo%20f%C3%B6r%20restauranggrupp"
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

      <section className="site-container py-20 sm:py-28">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Översikt</p>
        <h2 className="mt-6 max-w-3xl text-3xl leading-tight sm:text-4xl">
          Varje restaurang är unik. Gruppen ska ändå vara ett lag.
        </h2>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Restauranggrupper kämpar ofta med samma problem: olika system på olika enheter,
          svårfångad gästdata och en känsla av att varje ny öppning kräver dubbelt så mycket
          administration.
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Seytro samlar kommunikation, bokning och gästinsikt i en plattform. Ni får både lokal
          flexibilitet och central överblick — så att ni kan växa utan att fragmenteras.
        </p>
      </section>

      <section className="bg-muted/50">
        <div className="site-container py-20 sm:py-28">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Så fungerar det</p>
          <h2 className="mt-6 max-w-3xl text-3xl leading-tight sm:text-4xl">
            En plattform. Flera enheter. Samma standard.
          </h2>

          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Gemensamma gästprofiler</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                En gäst som besöker flera av era restauranger får samma välkomnande upplevelse
                överallt. Preferenser, allergier och besökshistorik följer med — inte fastnar i en
                enskild enhet.
              </p>
            </div>
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Central rapportering</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Jämför beläggning, svarstider och gästnöjdhet mellan enheter. Identifiera vad som
                fungerar och sprid det till hela gruppen.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container py-20 sm:py-28">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Nyckelfördelar</p>
        <h2 className="mt-6 max-w-2xl text-3xl leading-tight sm:text-4xl">
          Så hjälper Seytro er att skala med kontroll.
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
                Koppla en enhet i taget — eller alla på en gång.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
                Seytro anpassar sig efter er struktur. Oavsett om ni har två eller tjugo restauranger
                får ni en plattform som växer med gruppen.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="mailto:hej@seytro.com?subject=Boka%20demo%20f%C3%B6r%20restauranggrupp"
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
                  "Kartlägg era enheter och centrala behov.",
                  "Koppla bokningssystem och kommunikationskanaler.",
                  "Rulla ut plattformen enhet för enhet.",
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
