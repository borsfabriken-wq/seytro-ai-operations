import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/seytro-logo.png.asset.json";

const linkMap: Record<string, string> = {
  Röstagent: "/voice-agent",
  E-postconcierge: "/epostagent",
  Bordsplacering: "/bordsplacering",
  Gästinsikt: "/gastinsikt",
  Analys: "/analys",
  Kampanjer: "/kampanjer",
  "Fristående restauranger": "/losningar/fristaende-restauranger",
  Restauranggrupper: "/losningar/restauranggrupper",
  "Fine dining": "/losningar/fine-dining",
  Hotell: "/losningar/hotell",
  "Barer och lounger": "/losningar/barer-och-lounger",
  Högvolymsverksamheter: "/losningar/hogvolymsverksamheter",
  Hjälpcenter: "/resurser/hjalpcenter",
  Guider: "/resurser/guider",
  Kundberättelser: "/resurser/kundberattelser",
  Restauranginsikter: "/resurser/insikter",
  Produktnyheter: "/resurser/produktnyheter",
  "API-dokumentation": "/resurser/api",
  "Om Seytro": "/foretag/om-oss",
  Karriär: "/foretag/karriar",
  Kontakt: "/foretag/kontakt",
  Partners: "/foretag/partners",
  Säkerhet: "/foretag/sakerhet",
};

const columns = [
  {
    title: "Plattform",
    links: ["Röstagent", "E-postconcierge", "Bordsplacering", "Gästinsikt", "Analys", "Kampanjer"],
  },
  {
    title: "Lösningar",
    links: [
      "Fristående restauranger",
      "Restauranggrupper",
      "Fine dining",
      "Hotell",
      "Barer och lounger",
      "Högvolymsverksamheter",
    ],
  },
  {
    title: "Resurser",
    links: [
      "Hjälpcenter",
      "Guider",
      "Kundberättelser",
      "Restauranginsikter",
      "Produktnyheter",
      "API-dokumentation",
    ],
  },
  {
    title: "Företag",
    links: ["Om Seytro", "Karriär", "Kontakt", "Partners", "Säkerhet"],
  },
];

export function SiteFooter() {
  return (
    <footer className="rounded-t-3xl bg-forest-deep text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Link to="/" className="inline-block">
              <img src={logoAsset.url} alt="Seytro" className="h-7 w-auto" />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-primary-foreground/70">
              AI-driven operationsplattform för restauranger och hotell.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground/50">
                  {col.title}
                </h3>
                <ul className="mt-5 space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link
                        to={linkMap[link] ?? "/"}
                        className="text-sm text-primary-foreground/75 transition-colors hover:text-primary-foreground"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-primary-foreground/10 pt-8">
          <div className="flex flex-col items-start justify-between gap-4 text-sm text-primary-foreground/60 sm:flex-row sm:items-center">
            <p>© 2026 Seytro. Alla rättigheter förbehållna.</p>
            <div className="flex flex-wrap items-center gap-6">
              <Link to="/" className="transition-colors hover:text-primary-foreground">
                Integritetspolicy
              </Link>
              <Link to="/" className="transition-colors hover:text-primary-foreground">
                Användarvillkor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
