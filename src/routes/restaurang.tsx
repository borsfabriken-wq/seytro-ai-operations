import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { FaqSection } from "@/components/FaqSection";
import heroImg from "@/assets/hero-restaurant.png.asset.json";

export const Route = createFileRoute("/restaurang")({
  head: () => ({
    meta: [
      { title: "Seytro för restauranger — AI som svarar, placerar och fyller salen" },
      {
        name: "description",
        content:
          "Röstagent, e-postconcierge och automatisk bordsplacering för restauranger. Färre missade samtal, jämnare turnering och fler återkommande gäster.",
      },
      { property: "og:title", content: "Seytro för restauranger" },
      {
        property: "og:description",
        content:
          "AI som besvarar varje samtal, planerar salen och fyller de svaga passen — byggt för restaurangdrift.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RestaurangPage,
});

const products = [
  ["Röstagent", "Svarar i telefon under lunchrushen, bokar bord och läser upp dagens meny — utan att någon lämnar salen."],
  ["E-postconcierge", "Sällskapsförfrågningar, allergier och avbokningar besvaras i er ton, med era regler för minimiantal och deposition."],
  ["Bordsplacering", "Rätt sällskap på rätt bord vid rätt tid — jämn belastning per station och fler sittningar per kväll."],
  ["Salsplan", "Levande golvvy med statusar och turnering, så hovmästaren ser läget på en sekund."],
  ["Gästinsikt", "Preferenser, allergier och besökshistorik följer med till bordet."],
  ["Kampanjer", "Segmenterade utskick som fyller tisdagar och tidiga sittningar."],
];

const kpis: [string, string][] = [
  ["−38%", "administrativ tid i salen"],
  ["100%", "besvarade samtal och mejl"],
  ["+21%", "återkommande gäster"],
  ["3 min", "genomsnittlig svarstid på förfrågningar"],
];

function RestaurangPage() {
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />

      <section className="relative min-h-[75svh] sm:min-h-[85svh] overflow-hidden">
        <img
          src={heroImg.url}
          alt="Restaurangmatsal med gäster vid dukade bord"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-forest-deep/55" aria-hidden="true" />
        <div className="site-container relative flex min-h-[75svh] sm:min-h-[85svh] flex-col justify-end pb-16 pt-32 sm:pb-24 sm:pt-40">
          <p className="mb-8 text-sm uppercase tracking-[0.28em] text-primary-foreground/70">
            För restauranger
          </p>
          <h1 className="max-w-4xl text-5xl leading-[1.05] text-primary-foreground sm:text-7xl">
            Full sal. Tyst telefon.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-primary-foreground/80">
            Seytro tar samtalen, planerar bordsläggningen och får gästen att komma tillbaka — så att
            personalen kan ägna kvällen åt gästfrihet istället för administration.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/demo"
              className="rounded-full bg-primary-foreground px-8 py-4 text-sm font-medium text-forest-deep transition-opacity hover:opacity-90"
            >
              Boka demo
            </Link>
            <Link
              to="/hotell"
              className="rounded-full border border-primary-foreground/40 px-8 py-4 text-sm text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Driver du hotell?
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t-2 border-forest-deep bg-forest-deep text-primary-foreground">
        <div className="site-container grid grid-cols-2 gap-px py-16 lg:grid-cols-4">
          {kpis.map(([kpi, label]) => (
            <div key={label}>
              <p className="font-display text-4xl">{kpi}</p>
              <p className="mt-2 text-sm text-primary-foreground/80">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="site-container py-20 sm:py-28">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Så används Seytro i restaurangen</p>
        <h2 className="mt-6 max-w-2xl text-4xl leading-tight sm:text-5xl">
          Byggt för bordsläggning, turnering och gästfrihet.
        </h2>
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {products.map(([t, d]) => (
            <div key={t} className="border-l border-border pl-5">
              <h3 className="text-base font-medium text-forest">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary">
        <div className="site-container flex flex-col gap-6 py-16 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl">Både restaurang och hotell?</h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Kör en hybriduppsättning: samma plattform, en gästprofil, men separata flöden för
              reception och sal.
            </p>
          </div>
          <Link
            to="/demo"
            className="shrink-0 rounded-full bg-forest px-8 py-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Visa hybridlösningen
          </Link>
        </div>
      </section>

      <div className="my-8 h-6 w-full bg-forest" aria-hidden="true" />

      <FaqSection />
      <SiteFooter />
    </div>
  );
}
