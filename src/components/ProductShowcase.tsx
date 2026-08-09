import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Phone, Mail, LayoutGrid, Users, BarChart3, Megaphone } from "lucide-react";

const products = [
  {
    name: "Röstagent",
    icon: Phone,
    text: "Någon svarar mitt i servicen. Ett samtal i taget, detaljer bekräftade muntligt — och bokningen hamnar i samma bok som allt annat.",
  },
  {
    name: "E-postconcierge",
    icon: Mail,
    text: "Inkorgen svarar för sig själv. Gruppförfrågningar, allergier och ändringar besvaras i husets egen ton, medan ni står i köket.",
  },
  {
    name: "Bordsplacering",
    icon: LayoutGrid,
    text: "Sällskapet kommer tidigt, ett annat blir försenat. Salen lägger om sig själv — borden, zonerna och personalen hamnar där de behövs som mest.",
  },
  {
    name: "Gästinsikt",
    icon: Users,
    text: "Gästen känns igen redan vid dörren. Favoritbordet, vinet från förra gången, tio år av besök — samlat i en profil som växer av sig själv.",
  },
  {
    name: "Analys",
    icon: BarChart3,
    text: "Måndagens siffror förklarar sig själva. Ni ser vilka pass som bär, var intäkten läcker och vad nästa vecka behöver — innan den börjar.",
  },
  {
    name: "Kampanjer",
    icon: Megaphone,
    text: "Lågsäsongen knackar på dörren. Ett segment, ett erbjudande, ett utskick — och de svaga passen fylls av gäster som inte hade kommit annars.",
  },
];

const INTERVAL = 4500;
const R = 9;
const CIRCUMFERENCE = 2 * Math.PI * R;

function ProgressRing({ progress }: { progress: number }) {
  const offset = CIRCUMFERENCE * (1 - progress / 100);
  return (
    <svg className="h-5 w-5 shrink-0 -rotate-90" viewBox="0 0 24 24">
      <circle
        cx="12"
        cy="12"
        r={R}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-forest/20"
      />
      <circle
        cx="12"
        cy="12"
        r={R}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        className="text-forest transition-all duration-75 ease-linear"
      />
    </svg>
  );
}

export function ProductShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const raf = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const progressRef = useRef<number>(0);

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

  useEffect(() => {
    setProgress(0);
    progressRef.current = 0;
    startRef.current = performance.now();

    const animate = (now: number) => {
      if (paused) {
        startRef.current = now - progressRef.current * INTERVAL;
        raf.current = requestAnimationFrame(animate);
        return;
      }
      const elapsed = now - startRef.current;
      const next = Math.min((elapsed / INTERVAL) * 100, 100);
      progressRef.current = next / 100;
      setProgress(next);
      raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [active, paused]);

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
      <div className="grid gap-12 lg:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-10">
        <div className="relative hidden lg:block">
          <span className="absolute -left-4 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs uppercase tracking-[0.2em] text-muted-foreground">
            En plattform
          </span>
        </div>

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
                    {isActive ? <ProgressRing progress={progress} /> : <span className="inline-block h-5 w-5" />}
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
