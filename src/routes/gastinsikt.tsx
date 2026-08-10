import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  Users,
  Heart,
  AlertCircle,
  UserCheck,
  History,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/gastinsikt")({
  head: () => ({
    meta: [
      { title: "Gästinsikt — Seytro" },
      {
        name: "description",
        content:
          "Seytro bygger levande gästprofiler automatiskt. Favoriter, allergier, besökshistorik och preferenser samlas i ett enda system.",
      },
      { property: "og:title", content: "Gästinsikt — Seytro" },
      {
        property: "og:description",
        content:
          "Varje gäst, känd vid dörren. AI-driven gästinsikt för restauranger och hotell.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GastinsiktPage,
});

const benefits = [
  {
    icon: Heart,
    title: "Favoriter sparade",
    text: "Gästens vanliga bord, föredragna vin och specialönskemål finns alltid till hands.",
  },
  {
    icon: AlertCircle,
    title: "Allergier och behov",
    text: "Kostrestriktioner och preferenser följer gästen automatiskt, bokning efter bokning.",
  },
  {
    icon: History,
    title: "Besökshistorik",
    text: "Se tidigare besök, spendering och feedback — samlat på ett ställe.",
  },
  {
    icon: Users,
    title: "Smart segmentering",
    text: "Gruppera gäster efter beteende, värde och intresse för riktad kommunikation.",
  },
  {
    icon: UserCheck,
    title: "VIP-varning",
    text: "Personalen får en tydlig markör när en viktig gäst är på ingång.",
  },
  {
    icon: Sparkles,
    title: "Profiler som växer",
    text: "Varje interaktion — samtal, mejl, besök — gör profilen rikare utan manuellt arbete.",
  },
];

function GastinsiktPage() {
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />

      <section className="relative min-h-[80vh] overflow-hidden bg-forest-deep text-primary-foreground">
        <div className="site-container relative flex min-h-[80vh] flex-col justify-end pb-24 pt-40">
          <p className="mb-8 max-w-xl text-sm uppercase tracking-[0.28em] text-primary-foreground/60">
            Produkt
          </p>
          <h1 className="max-w-4xl text-5xl leading-[1.02] sm:text-7xl lg:text-8xl">
            Gästinsikt
          </h1>
          <p className="fade-up mt-8 max-w-2xl text-2xl leading-snug text-primary-foreground/90 sm:text-3xl">
            Varje gäst, känd vid dörren.
          </p>
          <p className="fade-up mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
            Seytro bygger levande gästprofiler från varje samtal, mejl och besök. När gästen
            kommer tillbaka vet ni redan vad de tycker om, vad de undviker och vad som gör dem
            återkommande.
          </p>
          <div className="fade-up mt-10 flex flex-wrap items-center gap-4">
            <a
              href="mailto:hej@seytro.com?subject=Boka%20demo%20av%20G%C3%A4stinsikt"
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
          Det är inte bara en bokning. Det är en relation.
        </h2>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          De flesta restauranger har gäster som kommer tillbaka år efter år — men personalen
          hinner sällan komma ihåg allt. Vilket bord de föredrar. Vilken årgång de drack. Att
          de är allergiska mot nötter.
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Seytros Gästinsikt samlar det som annars försvinner i huvuden och anteckningar. Varje
          interaktion bygger på den förra, så att varje välkomnande känns personligt — även om
          det är första gången en ny server tar emot gästen.
        </p>
      </section>

      <section className="bg-muted/50">
        <div className="site-container py-28">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Så fungerar det</p>
          <h2 className="mt-6 max-w-3xl text-3xl leading-tight sm:text-4xl">
            Profiler som växer automatiskt, överallt där ni möter gästen.
          </h2>

          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Samlad från varje kanal</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                När gästen ringer, mejlar eller besöker er sparas det som betyder något. Bord,
                tillfälle, allergier, feedback och spendering läggs till profilen utan att någon
                behöver skriva ner det.
              </p>
            </div>
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Synkad med bokningen</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                När samma gäst bokar igen ser personalen direkt vem som kommer. Ingen överraskning,
                inga glömda detaljer — bara en förberedd värd som kan ge precis rätt uppmärksamhet.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container py-28">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Nyckelfördelar</p>
        <h2 className="mt-6 max-w-2xl text-3xl leading-tight sm:text-4xl">
          Så hjälper Gästinsikt er att växa.
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
                Koppla bokningssystemet — så börjar profilerna växa.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
                Seytro läser in gästdata från ert bokningssystem, telefoni och mejl. Redan från
                dag ett börjar ni se tydligare vem era gäster är — och vad de vill ha mer av.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="mailto:hej@seytro.com?subject=Boka%20demo%20av%20G%C3%A4stinsikt"
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
                  "Koppla ert bokningssystem och kommunikationskanaler.",
                  "Låt Seytro sammanställa gästprofiler automatiskt.",
                  "Ge personalen full kontext vid varje ny bokning.",
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
