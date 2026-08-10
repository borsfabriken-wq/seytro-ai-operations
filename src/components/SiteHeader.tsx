import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import logoAsset from "@/assets/seytro-logo.png.asset.json";
import { PlatformMenu } from "@/components/PlatformMenu";
import { SolutionsMenu } from "@/components/SolutionsMenu";
import { ResourcesMenu } from "@/components/ResourcesMenu";
import { CompanyMenu } from "@/components/CompanyMenu";


const mobileNav: { label: string; links: { label: string; to: string }[] }[] = [
  {
    label: "Plattform",
    links: [
      { label: "Röstagent", to: "/voice-agent" },
      { label: "E-postconcierge", to: "/epostagent" },
      { label: "Bokningsassistent", to: "/bokningsassistent" },
      { label: "Bordsplacering", to: "/bordsplacering" },
      { label: "Salsplan", to: "/salsplan" },
      { label: "Tillgänglighet", to: "/tillganglighet" },
      { label: "Gästinsikt", to: "/gastinsikt" },
      { label: "Analys", to: "/analys" },
      { label: "Kampanjer", to: "/kampanjer" },
    ],
  },
  {
    label: "Lösningar",
    links: [
      { label: "Restauranggrupper", to: "/losningar/restauranggrupper" },
      { label: "Fine dining", to: "/losningar/fine-dining" },
      { label: "Fristående restauranger", to: "/losningar/fristaende-restauranger" },
      { label: "Barer och lounger", to: "/losningar/barer-och-lounger" },
      { label: "Hotell", to: "/losningar/hotell" },
      { label: "Högvolymsverksamheter", to: "/losningar/hogvolymsverksamheter" },
    ],
  },
  {
    label: "Resurser",
    links: [
      { label: "Hjälpcenter", to: "/resurser/hjalpcenter" },
      { label: "Guider", to: "/resurser/guider" },
      { label: "API", to: "/resurser/api" },
      { label: "Kundberättelser", to: "/resurser/kundberattelser" },
      { label: "Insikter", to: "/resurser/insikter" },
      { label: "Produktnyheter", to: "/resurser/produktnyheter" },
    ],
  },
  {
    label: "Företag",
    links: [
      { label: "Om oss", to: "/foretag/om-oss" },
      { label: "Karriär", to: "/foretag/karriar" },
      { label: "Säkerhet", to: "/foretag/sakerhet" },
      { label: "Partners", to: "/foretag/partners" },
      { label: "Kontakt", to: "/foretag/kontakt" },
    ],
  },
];


type DropdownState = {
  platform: boolean;
  solutions: boolean;
  resources: boolean;
  company: boolean;
};

export function SiteHeader({ solid = false }: { solid?: boolean } = {}) {
  const [scrolledRaw, setScrolled] = useState(false);
  const scrolled = solid || scrolledRaw;
  const [mobileOpen, setMobileOpen] = useState(false);



  const [open, setOpen] = useState<DropdownState>({
    platform: false,
    solutions: false,
    resources: false,
    company: false,
  });

  const platformRef = useRef<HTMLDivElement>(null);
  const solutionsRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const companyRef = useRef<HTMLDivElement>(null);

  const timers = useRef<Record<keyof DropdownState, ReturnType<typeof setTimeout> | null>>({
    platform: null,
    solutions: null,
    resources: null,
    company: null,
  });

  const openMenu = (key: keyof DropdownState) => {
    const timer = timers.current[key];
    if (timer) clearTimeout(timer);
    setOpen((prev) => ({ ...prev, [key]: true }));
  };

  const scheduleClose = (key: keyof DropdownState) => {
    const timer = timers.current[key];
    if (timer) clearTimeout(timer);
    timers.current[key] = setTimeout(() => {
      setOpen((prev) => ({ ...prev, [key]: false }));
    }, 120);
  };

  const toggleMenu = (key: keyof DropdownState) => {
    setOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideAny =
        platformRef.current?.contains(target) ||
        solutionsRef.current?.contains(target) ||
        resourcesRef.current?.contains(target) ||
        companyRef.current?.contains(target);
      if (!insideAny) {
        setOpen({ platform: false, solutions: false, resources: false, company: false });
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const renderDropdown = (
    label: string,
    key: keyof DropdownState,
    ref: React.RefObject<HTMLDivElement | null>,
    MenuComponent: React.ComponentType<{ open: boolean }>,
  ) => (
    <div
      key={label}
      ref={ref}
      className="relative hidden sm:block"
      onMouseEnter={() => openMenu(key)}
      onMouseLeave={() => scheduleClose(key)}
    >
      <button
        type="button"
        aria-expanded={open[key]}
        onClick={() => toggleMenu(key)}
        className="flex items-center gap-1 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
      >
        {label}
        <ChevronDown
          className={`h-3 w-3 opacity-60 transition-transform duration-200 ${
            open[key] ? "rotate-180" : ""
          }`}
        />
      </button>
      <MenuComponent open={open[key]} />
    </div>
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[padding] duration-500 ease-out ${
        scrolled ? "px-3 pt-3 sm:px-6 sm:pt-4" : "px-0 pt-0"
      }`}
    >
      <nav
        className={`mx-auto flex items-center justify-between gap-3 transition-all duration-500 ease-out ${
          scrolled
            ? "max-w-4xl rounded-full border border-primary-foreground/10 bg-forest-deep/90 px-4 py-2.5 shadow-2xl backdrop-blur-md sm:px-6"
            : "max-w-7xl rounded-none border border-transparent bg-transparent px-5 py-5 shadow-none sm:px-10 sm:py-6 2xl:max-w-[96rem] 2xl:px-16"
        }`}
      >
        <div className="flex min-w-0 items-center gap-4 sm:gap-5">
          <Link to="/" className="block shrink-0">
            <img src={logoAsset.url} alt="Seytro" className="h-5 w-auto sm:h-6" />
          </Link>
          <div className="hidden items-center gap-5 lg:flex lg:gap-6">
            {renderDropdown("Plattform", "platform", platformRef, PlatformMenu)}
            {renderDropdown("Lösningar", "solutions", solutionsRef, SolutionsMenu)}
            {renderDropdown("Resurser", "resources", resourcesRef, ResourcesMenu)}
            {renderDropdown("Företag", "company", companyRef, CompanyMenu)}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <a
            href="https://www.seytro.com/login"
            className="hidden text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground sm:block"
          >
            Logga in
          </a>
          <Link
            to="/demo"
            className="hidden rounded-full border border-primary-foreground/40 px-4 py-1.5 text-sm text-primary-foreground transition-colors hover:bg-primary-foreground hover:text-forest-deep sm:block"
          >
            Boka demo
          </Link>
          <button
            type="button"
            aria-label={mobileOpen ? "Stäng meny" : "Öppna meny"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-primary-foreground/30 text-primary-foreground lg:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="mx-auto mt-2 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-3xl border border-primary-foreground/10 bg-forest-deep/95 p-5 text-primary-foreground shadow-2xl backdrop-blur-md lg:hidden">
          <div className="flex flex-col divide-y divide-primary-foreground/10">
            {mobileNav.map((group) => (
              <div key={group.label} className="py-3">
                <p className="text-xs uppercase tracking-[0.28em] text-primary-foreground/50">
                  {group.label}
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  {group.links.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setMobileOpen(false)}
                      className="text-base text-primary-foreground/85 transition-colors hover:text-primary-foreground"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-col gap-3">
            <Link
              to="/demo"
              onClick={() => setMobileOpen(false)}
              className="rounded-full bg-primary-foreground px-6 py-3 text-center text-sm font-medium text-forest-deep"
            >
              Boka demo
            </Link>
            <a
              href="https://www.seytro.com/login"
              className="rounded-full border border-primary-foreground/40 px-6 py-3 text-center text-sm text-primary-foreground"
            >
              Logga in
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

