import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  LayoutGrid,
  MapPin,
  Users,
  Zap,
  Star,
  CalendarClock,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/bordsplacering")({
  head: () => ({
    meta: [
      { title: "Bordsplacering — Seytro" },
      {
        name: "description",
        content:
          "Seytros Bordsplacering optimerar salslayouten i realtid — rätt gäst på rätt bord, oavsen om planerna ändras.",
      },
      { property: "og:title", content: "Bordsplacering — Seytro" },
      {
        property: "og:description",
        content:
          "Rätt gäst på rätt bord, varje gång. AI-driven bordsplacering som anpassar sig när servicen förändras.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TablePlacementPage,
});

const benefits = [
  {
    icon: MapPin,
    title: "Rätt plats, rätt tillfälle",
    text: "Gästernas önskemål, sällskapsstorlek och tidigare besök vägs in för att välja det bästa bordet.",
  },
  {
    icon: Zap,
    title: "Anpassar sig i realtid",
    text: "Förseningar, avbokningar och extra gäster hanteras automatiskt — salen lägger om sig utan stress.",
  },
  {
    icon: Users,
    title: "Balanserad belastning",
    text: "Fördela gäster jämnt mellan stationer och servitörer så att ingen sektion blir överbelastad.",
  },
  {
    icon: Star,
    title: "VIP-känsla",
    text: "Återkommande gäster placeras vid favoritbordet eller med den servitör de trivs bäst med.",
  },
  {
    icon: CalendarClock,
    title: "Tidsoptimering",
    text: "Bordsplaceringen tar hänsyn till sittningstider och omsättning så att ni maximerar antal gäster.",
  },
  {
    icon: LayoutGrid,
    title: "Visuell salsplan",
    text: "Få en tydlig översikt över hela salen — bord, zoner och tillgänglighet på en och samma vy.",
  },
];

function TablePlacementPage() {
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />

      <section className="relative min-h-[80vh] overflow-hidden bg-forest-deep text-primary-foreground">
        <div className="relative mx-auto flex min-h-[80vh] max-w-7xl flex-col justify-end px-6 pb-24 pt-40 sm:px-10">
          <p className="mb-8 max-w-xl text-sm uppercase tracking-[0.28em] text-primary-foreground/60">
            Produkt
          </p>
          <h1 className="max-w-4xl text-5xl leading-[1.02] sm:text-7xl lg:text-8xl">
            Bordsplacering
          </h1>
          <p className="fade-up mt-8 max-w-2xl text-2xl leading-snug text-primary-foreground/90 sm:text-3xl">
            Rätt gäst på rätt bord, varje gång.
          </p>
          <p className="fade-up mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
            Seytros Bordsplacering anpassar salslayouten i realtid — oavsett om ett
            sällskap blir försenat, en avbokning dyker upp eller gästerna vill sitta
            tillsammans. Slipp manuellt pusslande och låt salen lägga sig själv.
          </p>
          <div className="fade-up mt-10 flex flex-wrap items-center gap-4">
            <a
              href="mailto:hej@seytro.com?subject=Boka%20demo%20av%20Bordsplacering"
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
          Salen är en levande pusselbit — låt den lägga sig själv.
        </h2>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          En fredagskväll i full fart: ett sällskap på sex kommer tidigt, ett bord på
          fyra blir försenat och en sista-minuten-bokning ringer på dörren. Istället för
          att springa mellan borden med en suddig plan i huvudet ser ni direkt hur salen
          kan optimeras.
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Bordsplaceringen väger samman gästernas önskemål, sällskapsstorlek, tidigare
          besök, sittningstider och personalens belastning — och föreslår den bästa
          placeringen. När något ändras justeras förslaget automatiskt.
        </p>
      </section>

      <section className="bg-muted/50">
        <div className="mx-auto max-w-7xl px-6 py-28 sm:px-10">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Så fungerar det</p>
          <h2 className="mt-6 max-w-3xl text-3xl leading-tight sm:text-4xl">
            Varje bokning blir en optimal plats.
          </h2>

          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Smart vägning</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Varje gäst och varje bord har en profil. Assistenten tar hänsyn till
                önskemål om fönsterplats, avstånd till köket, tillgänglighet för rullstol
                och mycket mer — och väljer det bästa alternativet.
              </p>
            </div>
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Omläggning på sekunder</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                När en avbokning eller försening inträffar räknar systemet om i realtid.
                De bord som frigörs fylls med nästa lämpliga sällskap, och personalen får
                en tydlig vy över vad som har ändrats.
              </p>
            </div>
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Balanserad service</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Ingen servitör eller sektion ska drunkna. Bordsplaceringen fördelar
                gäster jämnt över salen så att teamet kan ge samma uppmärksamhet åt alla.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-28 sm:px-10">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Nyckelfördelar</p>
        <h2 className="mt-6 max-w-2xl text-3xl leading-tight sm:text-4xl">
          Så hjälper Bordsplaceringen er att växa.
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
                Mata in salsplanen — så börjar placeringarna optimera sig.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
                Ladda upp eller rita er salsplan, lägg in bordsstorlekar, zoner och
                servitörsstationer. Sedan kopplar ni bokningsflödet till Seytro och låter
                Bordsplaceringen göra resten.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="mailto:hej@seytro.com?subject=Boka%20demo%20av%20Bordsplacering"
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
                  "Rita eller importera er salsplan.",
                  "Lägg in bord, zoner och servitörsstationer.",
                  "Låt Bordsplaceringen optimera varje sittning.",
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
