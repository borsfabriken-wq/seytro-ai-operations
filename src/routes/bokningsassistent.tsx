import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  CalendarCheck,
  Link2,
  Mail,
  Phone,
  RefreshCw,
  Clock,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/bokningsassistent")({
  head: () => ({
    meta: [
      { title: "Bokningsassistent — Seytro" },
      {
        name: "description",
        content:
          "Seytros Bokningsassistent kopplar samtal, mejl och andra kanaler så att förfrågningar automatiskt blir bekräftade bokningar i ert system — utan manuell inmatning.",
      },
      { property: "og:title", content: "Bokningsassistent — Seytro" },
      {
        property: "og:description",
        content:
          "Förfrågan blir bokning — automatiskt. AI kopplar kanalerna och skapar bokningen åt er.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BookingAssistantPage,
});

const benefits = [
  {
    icon: Link2,
    title: "Kopplar alla kanaler",
    text: "Samtal, mejl, webb och SMS samlas i ett enda flöde — inga dubbelbokningar eller bortglömda förfrågningar.",
  },
  {
    icon: CalendarCheck,
    title: "Färdiga bokningar",
    text: "Förfrågningar omvandlas direkt till bekräftade bokningar med rätt tid, antal gäster och önskemål.",
  },
  {
    icon: Clock,
    title: "Dygnet runt",
    text: "Gäster kan boka när det passar dem — även efter stängningsdags — utan att någon i personalen behöver vara inne.",
  },
  {
    icon: RefreshCw,
    title: "Synkad i realtid",
    text: "Bokningar uppdaterar salsplan, tillgänglighet och gästprofiler automatiskt, så alla ser samma bild.",
  },
  {
    icon: ShieldCheck,
    title: "Färre fel",
    text: "Ingen handpåläggning betyder färre felinmatningar, missade detaljer och frustrerade gäster.",
  },
  {
    icon: Mail,
    title: "Bekräftelse på köpet",
    text: "Gästen får en tydlig bekräftelse direkt — med all information på plats och i er ton.",
  },
];

function BookingAssistantPage() {
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />

      <section className="relative min-h-[70svh] sm:min-h-[80svh] overflow-hidden bg-forest-deep text-primary-foreground">
        <div className="site-container relative flex min-h-[70svh] sm:min-h-[80svh] flex-col justify-end pb-16 pt-32 sm:pb-24 sm:pt-40">
          <p className="mb-8 max-w-xl text-sm uppercase tracking-[0.28em] text-primary-foreground/60">
            Produkt
          </p>
          <h1 className="max-w-4xl text-5xl leading-[1.02] sm:text-7xl lg:text-8xl">
            Bokningsassistent
          </h1>
          <p className="fade-up mt-8 max-w-2xl text-2xl leading-snug text-primary-foreground/90 sm:text-3xl">
            Förfrågan blir bokning — automatiskt.
          </p>
          <p className="fade-up mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
            Seytro kopplar samtal, mejl och andra kanaler så att varje förfrågan
            landar som en färdig bokning i ert system. Utan att någon behöver
            sitta och knappa in den för hand.
          </p>
          <div className="fade-up mt-10 flex flex-wrap items-center gap-4">
            <a
              href="mailto:hej@seytro.com?subject=Boka%20demo%20av%20Bokningsassistent"
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
          En förfrågan kommer in. En bokning går ut. Allt däremellan sköts av sig självt.
        </h2>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Det spelar ingen roll om gästen ringer, mejlar eller fyller i ett formulär —
          Bokningsassistenten läser avsikten, kontrollerar tillgänglighet mot salsplan
          och bokningsregler, och skapar bokningen direkt.
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Restaurangens team slipper hoppa mellan kanaler och manuellt mata in samma
          uppgifter om och om igen. Istället får ni ett rent, pålitligt flöde där
          varje gäst blir omhändertagen — och varje bokning hamnar rätt från start.
        </p>
      </section>

      <section className="bg-muted/50">
        <div className="site-container section-y">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Så fungerar det</p>
          <h2 className="mt-6 max-w-3xl text-3xl sm:text-[2.6rem]">
            Tre steg från förfrågan till bekräftelse.
          </h2>

          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">1. Förfrågan samlas in</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Samtal från Röstagenten, mejl från E-postconciergen, webbförfrågningar
                och andra kanaler strömmar in i Seytro. Assistenten förstår vem gästen
                är, när de vill komma och vad de behöver.
              </p>
            </div>
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">2. Bokningen skapas automatiskt</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Assistenten kontrollerar tillgänglighet, tillämpar era bokningsregler
                och väljer rätt bord eller zon. Bokningen skrivs direkt in i systemet —
                komplett med antal gäster, tillval och särskilda önskemål.
              </p>
            </div>
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">3. Bekräftelse skickas</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Gästen får en tydlig bekräftelse via samma kanal som förfrågan kom in på,
                med all information på plats. Om något behöver eskaleras hamnar det hos
                rätt person med full kontext.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container section-y">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Nyckelfördelar</p>
        <h2 className="mt-6 max-w-2xl text-3xl sm:text-[2.6rem]">
          Så hjälper Bokningsassistenten er att växa.
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
                Koppla kanalerna — så börjar bokningarna skapa sig själva.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
                Anslut telefon, mejl och webb till Seytro. Ställ in era bokningsregler,
                salsplan och eskalering — sedan sköter Bokningsassistenten resten, dygnet
                runt.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="mailto:hej@seytro.com?subject=Boka%20demo%20av%20Bokningsassistent"
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
                  "Koppla telefon, mejl och webb till Seytro.",
                  "Konfigurera regler, salsplan och eskalering.",
                  "Låt Bokningsassistenten skapa bokningarna — automatiskt.",
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
