import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Locale = "sv" | "en";

const STORAGE_KEY = "seytro-locale";

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
};

const LanguageContext = createContext<Ctx>({ locale: "sv", setLocale: () => {} });

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("sv");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "sv") setLocaleState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    window.localStorage.setItem(STORAGE_KEY, l);
    setLocaleState(l);
  }, []);

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>{children}</LanguageContext.Provider>
  );
}
