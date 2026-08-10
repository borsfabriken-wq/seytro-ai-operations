import { useLanguage } from "@/i18n/LanguageProvider";

/** Discreet language switcher, pinned in the corner of the viewport. */
export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      data-no-translate
      className="fixed bottom-4 right-4 z-[60] flex items-center gap-0.5 rounded-full border border-border/70 bg-background/80 px-1 py-1 text-[11px] font-medium tracking-[0.12em] shadow-sm backdrop-blur-md"
    >
      {(["sv", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          aria-label={code === "sv" ? "Svenska" : "English"}
          aria-pressed={locale === code}
          className={`rounded-full px-2.5 py-1 uppercase transition-colors ${
            locale === code
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
