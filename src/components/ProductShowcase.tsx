import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronRight, Phone, Mail, Users, BarChart3 } from "lucide-react";

const products = [
  {
    name: "Röstagent",
    icon: Phone,
    text: "Någon svarar mitt i servicen. Ett samtal i taget, detaljer bekräftade muntligt — och bokningen hamnar i samma bok som allt annat.",
  },
  {
    name: "E-postagent",
    icon: Mail,
    text: "Inkorgen svarar för sig själv. Gruppförfrågningar, allergier och ändringar besvaras i husets egen ton, medan ni står i köket.",
  },
  {
    name: "Gästintelligens",
    icon: Users,
    text: "Gästen känns igen redan vid dörren. Favoritbordet, vinet från förra gången, tio år av besök — samlat i en profil som växer av sig själv.",
  },
  {
    name: "Analys",
    icon: BarChart3,
    text: "Måndagens siffror förklarar sig själva. Ni ser vilka pass som bär, var intäkten läcker och vad nästa vecka behöver — innan den börjar.",
  },
];

const INTERVAL = 4500;

export function ProductShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setActive((i) => (i + 1) % products.length);
        setVisible(true);
      }, 250);
    }, INTERVAL);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, active]);

  const select = (i: number) => {
    if (i === active) return;
    setVisible(false);
    setTimeout(() => {
      setActive(i);
      setVisible(true);
    }, 200);
  };

  const current = products[active] ?? products[0]!;
  const Icon = current.icon;

  return (
    <section
      className="mx-auto max-w-7xl px-6 py-24 sm:px-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Våra produkter"
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-20">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Våra produkter</p>
          <p className="mt-4 font-mono text-sm text-muted-foreground">
            {String(active + 1).padStart(2, "0")} — {String(products.length).padStart(2, "0")}
          </p>

          <ul className="mt-8 space-y-3">
            {products.map((p, i) => {
              const isActive = i === active;
              return (
                <li key={p.name}>
                  <button
                    type="button"
                    onClick={() => select(i)}
                    className={`group flex items-center gap-3 text-left transition-all duration-500 ${
                      isActive
                        ? "text-3xl font-semibold text-forest sm:text-4xl"
                        : "text-2xl font-normal text-muted-foreground/50 hover:text-muted-foreground sm:text-3xl"
                    }`}
                  >
                    <span>{p.name}</span>
                    <ChevronRight
                      className={`transition-all duration-500 ${
                        isActive ? "h-6 w-6 opacity-100" : "h-5 w-5 opacity-0"
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-3xl bg-muted/60 p-8 sm:p-12">
          <div
            className={`flex h-full flex-col transition-opacity duration-300 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex flex-1 items-center justify-center rounded-2xl bg-background/70 py-14">
              <Icon className="h-16 w-16 text-forest" strokeWidth={1.25} />
            </div>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-foreground/80">{current.text}</p>
            <div className="mt-8">
              <a
                href="#demo"
                className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-forest-deep"
              >
                Utforska {current.name}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
