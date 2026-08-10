import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { FaqSection } from "@/components/FaqSection";
import heroImg from "@/assets/hero-hotel.jpg";

export const Route = createFileRoute("/hotell")({
  head: () => ({
    meta: [
      { title: "Seytro för hotell — AI för rumsplacering, reception och gästservice" },
      {
        name: "description",
        content:
          "Röstagent, e-postconcierge och automatisk rumsplacering för hotell. Avlasta receptionen dygnet runt och låt varje gäst hamna på rätt rum.",
      },
      { property: "og:title", content: "Seytro för hotell" },
      {
        property: "og:description",
        content:
          "Gästservice dygnet runt: samtal, mejl, rumsplacering och gästprofil i en plattform för hotell.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HotellPage,
});

const products = [
  ["Röstagent", "Svarar när receptionen är upptagen eller obemannad — frågor om incheckning, parkering, frukost och rumsönskemål."],
  ["E-postconcierge", "Grupp- och konferensförfrågningar, sena ankomster och specialönskemål besvaras direkt, dygnet runt."],
  ["Rumsplacering", "Automatisk rumstilldeling baserad på gästens önskemål, vistelse och beläggning — receptionen slipper manuella pussel."],
  ["Gästinsikt", "En gästprofil som följer med från bokning till incheckning: preferenser, allergier och tidigare vistelser."],
  ["Analys", "Beläggning, intäkt per gäst och kanalprestanda i klartext."],
  ["Kampanjer", "Återaktivera tidigare gäster inför lågsäsong och fyll frukost- och middagspassen."],
];

const kpis: [string, string][] = [
  ["24/7", "gästservice på svenska och engelska"],
  ["100%", "besvarade samtal och mejl"],
  ["−41%", "tid i receptionens inkorg"],
  ["+18%", "bordsbokningar från rumsgäster"],
];

function HotellPage() {
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />

      <section className="relative min-h-[75svh] sm:min-h-[85svh] overflow-hidden">
        <img
          src={heroImg}
          alt="Hotellreception i grön marmor och mässing med gäster som checkar in"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-forest-deep/45" aria-hidden="true" />
        <div className="site-container relative flex min-h-[75svh] sm:min-h-[85svh] flex-col justify-end pb-16 pt-32 sm:pb-24 sm:pt-40">
          <p className="mb-8 text-sm uppercase tracking-[0.28em] text-primary-foreground/70">
            För hotell
          </p>
          <h1 className="max-w-4xl text-5xl leading-[1.05] text-primary-foreground sm:text-7xl">
            Rätt gäst på rätt rum, dygnet runt.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-primary-foreground/80">
            Seytro besvarar gästen dygnet runt, avlastar receptionen och placerar varje bokning på
            rätt rum — samma gästprofil från förfrågan till incheckning.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/demo"
              className="rounded-full bg-primary-foreground px-8 py-4 text-sm font-medium text-forest-deep transition-opacity hover:opacity-90"
            >
              Boka demo
            </Link>
            <Link
              to="/restaurang"
              className="rounded-full border border-primary-foreground/40 px-8 py-4 text-sm text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Driver du restaurang?
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
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Så används Seytro på hotellet</p>
        <h2 className="mt-6 max-w-2xl text-4xl leading-tight sm:text-5xl">
          Från bokning till rumsplacering.
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
            <h2 className="text-2xl">Hotell med egen restaurang?</h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Hybriduppsättningen kör reception och sal i samma plattform, med gemensam gästprofil
              och separata regler för varje flöde.
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
