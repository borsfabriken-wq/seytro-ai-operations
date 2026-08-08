import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import logoAsset from "@/assets/seytro-logo.png.asset.json";
import { PlatformMenu } from "@/components/PlatformMenu";

const navItems = [
  { label: "Plattform", href: "#pelare", dropdown: true },
  { label: "Lösningar", href: "#pelare", dropdown: true },
  { label: "Resurser", href: "#vision", dropdown: true },
  { label: "Företag", href: "#vision", dropdown: false },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [platformOpen, setPlatformOpen] = useState(false);
  const platformRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setPlatformOpen(true);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setPlatformOpen(false), 120);
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (platformRef.current && !platformRef.current.contains(e.target as Node)) {
        setPlatformOpen(false);
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
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="hidden items-center gap-1 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground sm:flex"
              >
                {item.label}
                {item.dropdown && <ChevronDown className="h-3 w-3 opacity-60" />}
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <a
            href="#login"
            className="rounded-full bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground transition-colors hover:bg-primary-foreground/20"
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
