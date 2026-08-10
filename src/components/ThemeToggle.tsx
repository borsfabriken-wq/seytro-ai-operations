import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const STORAGE_KEY = "seytro-theme";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  window.localStorage.setItem(STORAGE_KEY, theme);
}

export function ThemeToggle({
  className = "",
  variant = "ghost",
}: {
  className?: string;
  variant?: "ghost" | "solid";
}) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTheme(getInitialTheme());
  }, []);

  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme);
  }, [theme, mounted]);

  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  if (!mounted) {
    return (
      <span
        aria-hidden="true"
        className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${className}`}
      />
    );
  }

  const baseStyles =
    variant === "solid"
      ? "rounded-full border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
      : "text-primary-foreground/80 hover:text-primary-foreground";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "light" ? "Växla till mörkt läge" : "Växla till ljust läge"}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${baseStyles} ${className}`}
    >
      {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  );
}

export { applyTheme, STORAGE_KEY };
export type { Theme };
