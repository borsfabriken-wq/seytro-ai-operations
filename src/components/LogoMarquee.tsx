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
  { type: "img", name: "Agaton", url: agaton.url, className: "h-5 sm:h-6" },
  { type: "text", name: "Ramblas" },
  { type: "img", name: "Brasserie Astrid", url: astrid.url, className: "h-5 sm:h-6" },
  { type: "text", name: "Ess Group" },
  { type: "img", name: "Blå Porten", url: blaPorten.url, className: "h-5 sm:h-6" },
  { type: "img", name: "Boqueria", url: boqueria.url, className: "h-5 sm:h-6" },
  { type: "text", name: "Melanders" },
  { type: "img", name: "il Tempo", url: ilTempo.url, className: "h-5 sm:h-6" },
  { type: "img", name: "NYT.6", url: nyt6.url, className: "h-5 sm:h-6" },
  { type: "img", name: "Restaurant Pelikan", url: pelikan.url, className: "h-5 sm:h-6" },
];

function Row({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <ul
      aria-hidden={ariaHidden}
      className="marquee-track flex shrink-0 items-center gap-6 pr-6 sm:gap-8 sm:pr-8"
    >
      {items.map((item) => (
        <li key={item.name} className="flex shrink-0 items-center">
          {item.type === "img" ? (
            <img
              src={item.url}
              alt={item.name}
              loading="lazy"
              className={`w-auto opacity-60 ${item.className}`}
            />
          ) : (
            <span className="font-display text-base leading-none text-primary-foreground opacity-60 sm:text-lg">
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
    <section className="border-y border-primary-foreground/10 bg-forest-deep py-4 text-primary-foreground sm:py-5">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 sm:px-10">
        <p className="shrink-0 text-[10px] uppercase leading-tight tracking-[0.2em] text-primary-foreground/50 sm:text-xs">
          Restauranger och<br className="hidden sm:block" /> hotell som växer<br className="hidden sm:block" /> med Seytro
        </p>
        <div className="marquee-mask relative flex flex-1 overflow-hidden">
          <Row />
          <Row ariaHidden />
        </div>
      </div>
    </section>
  );
}
