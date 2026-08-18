import { useLanguage } from "@/i18n/LanguageProvider";

/**
 * Discreet language switcher, pinned bottom-left so it never collides with
 * booking notifications (toasts render bottom-right). Fades in on hover/focus.
 */
export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      data-no-translate
      className="group fixed bottom-3 left-3 z-40 flex items-center gap-0.5 rounded-full border border-border/50 bg-background/60 px-0.5 py-0.5 text-[10px] font-medium tracking-[0.12em] opacity-45 backdrop-blur-md transition-opacity duration-200 hover:opacity-100 focus-within:opacity-100 print:hidden"
    >
      {(["sv", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          aria-label={code === "sv" ? "Svenska" : "English"}
          aria-pressed={locale === code}
          className={`rounded-full px-2 py-0.5 uppercase transition-colors ${
            locale === code
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
