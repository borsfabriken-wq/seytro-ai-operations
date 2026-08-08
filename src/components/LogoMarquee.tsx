import agaton from "@/assets/logos/agaton.png.asset.json";
import astrid from "@/assets/logos/astrid.png.asset.json";
import blaPorten from "@/assets/logos/bla-porten.png.asset.json";
import boqueria from "@/assets/logos/boqueria.png.asset.json";
import ilTempo from "@/assets/logos/il-tempo.png.asset.json";
import nyt6 from "@/assets/logos/nyt6.png.asset.json";
import pelikan from "@/assets/logos/pelikan.png.asset.json";

type Item =
  | { type: "img"; name: string; url: string; className: string }
  | { type: "text"; name: string };

const items: Item[] = [
  { type: "img", name: "Agaton", url: agaton.url, className: "h-6 sm:h-7" },
  { type: "text", name: "Ramblas" },
  { type: "img", name: "Brasserie Astrid", url: astrid.url, className: "h-7 sm:h-8" },
  { type: "text", name: "Ess Group" },
  { type: "img", name: "Blå Porten", url: blaPorten.url, className: "h-7 sm:h-8" },
  { type: "img", name: "Boqueria", url: boqueria.url, className: "h-7 sm:h-8" },
  { type: "text", name: "Melanders" },
  { type: "img", name: "il Tempo", url: ilTempo.url, className: "h-7 sm:h-8" },
  { type: "img", name: "NYT.6", url: nyt6.url, className: "h-7 sm:h-8" },
  { type: "img", name: "Restaurant Pelikan", url: pelikan.url, className: "h-7 sm:h-8" },
];

function Row({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <ul
      aria-hidden={ariaHidden}
      className="marquee-track flex shrink-0 items-center gap-14 pr-14 sm:gap-20 sm:pr-20"
    >
      {items.map((item) => (
        <li key={item.name} className="flex shrink-0 items-center">
          {item.type === "img" ? (
            <img
              src={item.url}
              alt={item.name}
              loading="lazy"
              className={`w-auto opacity-70 ${item.className}`}
            />
          ) : (
            <span className="font-display text-2xl leading-none text-primary-foreground opacity-70 sm:text-3xl">
              {item.name}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export function LogoMarquee() {
  return (
    <section className="border-y border-primary-foreground/10 bg-forest-deep py-12 text-primary-foreground">
      <p className="mx-auto mb-9 max-w-7xl px-6 text-sm uppercase tracking-[0.28em] text-primary-foreground/50 sm:px-10">
        Restauranger och hotell som växer med Seytro
      </p>
      <div className="marquee-mask relative flex overflow-hidden">
        <Row />
        <Row ariaHidden />
      </div>
    </section>
  );
}
