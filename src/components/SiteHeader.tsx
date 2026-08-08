import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import logoAsset from "@/assets/seytro-logo.png.asset.json";
import { PlatformMenu } from "@/components/PlatformMenu";
import { SolutionsMenu } from "@/components/SolutionsMenu";
import { ResourcesMenu } from "@/components/ResourcesMenu";
import { CompanyMenu } from "@/components/CompanyMenu";

const navItems = [
  { label: "Plattform", href: "#pelare", dropdown: true },
  { label: "Lösningar", href: "#losningar", dropdown: true },
  { label: "Resurser", href: "#resurser", dropdown: true },
  { label: "Företag", href: "#foretag", dropdown: true },
];

type DropdownState = {
  platform: boolean;
  solutions: boolean;
  resources: boolean;
  company: boolean;
};

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

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
        scrolled ? "px-4 pt-3 sm:px-6 sm:pt-4" : "px-0 pt-0"
      }`}
    >
      <nav
        className={`mx-auto flex items-center justify-between transition-all duration-500 ease-out ${
          scrolled
            ? "max-w-4xl rounded-full border border-primary-foreground/10 bg-forest-deep/90 px-5 py-2.5 shadow-2xl backdrop-blur-md sm:px-6"
            : "max-w-7xl rounded-none border border-transparent bg-transparent px-6 py-6 shadow-none sm:px-10"
        }`}
      >
        <div className="flex items-center gap-4 sm:gap-5">
          <a href="#top" className="block shrink-0">
            <img src={logoAsset.url} alt="Seytro" className="h-6 w-auto" />
          </a>
          <div className="flex items-center gap-5 sm:gap-6">
            {renderDropdown("Plattform", "platform", platformRef, PlatformMenu)}
            {renderDropdown("Lösningar", "solutions", solutionsRef, SolutionsMenu)}
            {renderDropdown("Resurser", "resources", resourcesRef, ResourcesMenu)}
            {renderDropdown("Företag", "company", companyRef, CompanyMenu)}
          </div>
        </div>
        <div className="flex items-center gap-4 sm:gap-5">
          <a
            href="#login"
            className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
          >
            Logga in
          </a>
          <a
            href="#demo"
            className="rounded-full border border-primary-foreground/40 px-4 py-1.5 text-sm text-primary-foreground transition-colors hover:bg-primary-foreground hover:text-forest-deep"
          >
            Boka demo
          </a>
        </div>
      </nav>
    </header>
  );
}
