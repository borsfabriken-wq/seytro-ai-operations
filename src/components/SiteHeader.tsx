import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

const navItems = [
  { label: "Plattform", href: "#pelare", dropdown: true },
  { label: "Lösningar", href: "#pelare", dropdown: true },
  { label: "Resurser", href: "#vision", dropdown: true },
  { label: "Företag", href: "#vision", dropdown: false },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[padding] duration-500 ease-out ${
        scrolled ? "px-4 pt-4 sm:px-6 sm:pt-5" : "px-0 pt-0"
      }`}
    >
      <nav
        className={`mx-auto flex items-center justify-between transition-all duration-500 ease-out ${
          scrolled
            ? "max-w-5xl rounded-full border border-primary-foreground/10 bg-forest-deep/90 px-6 py-3 shadow-2xl backdrop-blur-md sm:px-8"
            : "max-w-7xl rounded-none border border-transparent bg-transparent px-6 py-6 shadow-none sm:px-10"
        }`}
      >
        <a href="#top" className="text-lg tracking-[0.3em] text-primary-foreground uppercase">
          Seytro
        </a>
        <div className="flex items-center gap-7">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="hidden items-center gap-1.5 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground sm:flex"
            >
              {item.label}
              {item.dropdown && <ChevronDown className="h-3.5 w-3.5 opacity-60" />}
            </a>
          ))}
          <a
            href="#demo"
            className="rounded-full border border-primary-foreground/40 px-5 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary-foreground hover:text-forest-deep"
          >
            Boka demo
          </a>
        </div>
      </nav>
    </header>
  );
}
