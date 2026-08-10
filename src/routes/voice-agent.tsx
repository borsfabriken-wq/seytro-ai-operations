import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  Clock,
  Route as RouteIcon,
  RefreshCw,
  PhoneCall,
  Globe,
  FileText,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/voice-agent")({
  head: () => ({
    meta: [
      { title: "Röstagent — Seytro" },
      {
        name: "description",
        content:
          "Seytros Röstagent besvarar samtal dygnet runt med naturlig AI-konversation. Boka bord, hantera avbokningar och eskalera smidigt till ert team.",
      },
      { property: "og:title", content: "Röstagent — Seytro" },
      {
        property: "og:description",
        content:
          "Aldrig missa ett samtal igen. AI-driven telefonagent för restauranger och hotell.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VoiceAgentPage,
});

const benefits = [
  {
    icon: Clock,
    title: "24/7 tillgänglighet",
    text: "Aldrig missa en bokning, även utanför öppettiderna.",
  },
  {
    icon: RouteIcon,
    title: "Smart eskalering",
    text: "Komplexa situationer kopplas till rätt person med full kontext.",
  },
  {
    icon: RefreshCw,
    title: "Sömlös fallback",
    text: "Om ingen svarar går samtalet tillbaka till AI:n direkt.",
  },
  {
    icon: PhoneCall,
    title: "Återuppringning",
    text: "Agenten bokar en callback och meddelar ert team vad som hänt.",
  },
  {
    icon: Globe,
    title: "Flera språk",
    text: "Gästen får hjälp på sitt eget språk automatiskt.",
  },
  {
    icon: FileText,
    title: "Samtalshistorik",
    text: "Varje konversation loggas så ni alltid kan gå tillbaka.",
  },
];

function VoiceAgentPage() {
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />

      <section className="relative min-h-[70svh] sm:min-h-[80svh] overflow-hidden bg-forest-deep text-primary-foreground">
        <div className="site-container relative flex min-h-[70svh] sm:min-h-[80svh] flex-col justify-end pb-16 pt-32 sm:pb-24 sm:pt-40">
          <p className="mb-8 max-w-xl text-sm uppercase tracking-[0.28em] text-primary-foreground/60">
            Produkt
          </p>
          <h1 className="max-w-4xl text-5xl leading-[1.02] sm:text-7xl lg:text-8xl">
            Röstagent
          </h1>
          <p className="fade-up mt-8 max-w-2xl text-2xl leading-snug text-primary-foreground/90 sm:text-3xl">
            Aldrig missa ett samtal igen.
          </p>
          <p className="fade-up mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
            AI besvarar varje samtal dygnet runt med naturlig konversation — hanterar
            bokningar, avbokningar och gästfrågor utan att lägga någon på vänteläge.
          </p>
          <div className="fade-up mt-10 flex flex-wrap items-center gap-4">
            <a
              href="mailto:hej@seytro.com?subject=Boka%20demo%20av%20R%C3%B6stagent"
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
        <h2 className="mt-6 max-w-3xl text-3xl sm:text-[2.6rem]">
          Telefonen ringer klockan 23 en fredag. Ett sällskap på åtta vill boka till morgondagen.
        </h2>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Med Seytros Röstagent besvaras samtalet direkt — inget röstmeddelande, ingen missad chans.
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Men att svara är bara början. Det som betyder något är vad som händer sedan. De flesta
          restauranger förlorar gäster i övergångarna: samtalet som går till röstbrevlådan,
          kopplingen som ingen tar, frågan som får svaret "ring tillbaka senare". Med Seytro finns
          inga återvändsgränder. Varje gäst blir omhändertagen, varje gång.
        </p>
      </section>

      <section className="bg-muted/50">
        <div className="site-container section-y">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Ingen gäst lämnas utanför</p>
          <h2 className="mt-6 max-w-3xl text-3xl sm:text-[2.6rem]">
            Varje möjlig väg leder till att gästen får hjälp.
          </h2>

          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Smart överlämning</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                När en situation kräver ert team kopplar Röstagenten samtalet vidare. Om ingen svarar
                kommer samtalet tillbaka till AI:n. Gästen lämnas aldrig kvar i en död linje. Agenten
                fortsätter konversationen, erbjuder sig att ordna ett återuppringning, eller löser
                frågan direkt.
              </p>
            </div>
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Callback med kontext</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Om AI:n inte kan lösa frågan helt och hållet skickar den ett meddelande till ert team
                med full kontext och begär ett återuppringning å gästens vägnar. Gästen lägger på
                luren med vetskapen att någon hör av sig. Ert team får detaljerna utan att ha
                missat något.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container section-y">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Nyckelfördelar</p>
        <h2 className="mt-6 max-w-2xl text-3xl sm:text-[2.6rem]">
          Så hjälper Röstagenten er att växa.
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
                Koppla telefonlinjen — så börjar agenten svara.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
                Koppla restaurangens telefonlinje och Röstagenten börjar svara direkt. Konfigurera
                era bokningsregler, ställ in eskaleringspreferenser och låt Seytro sköta resten.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="mailto:hej@seytro.com?subject=Boka%20demo%20av%20R%C3%B6stagent"
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
                  "Koppla er telefonlinje till Seytro.",
                  "Konfigurera bokningsregler och eskalering.",
                  "Låt agenten börja svara — dygnet runt.",
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
