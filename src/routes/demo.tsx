import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Check, Clock, Video, ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Boka demo — Träffa Seytro" },
      {
        name: "description",
        content:
          "Boka en 30 minuters produktdemo med Seytro och se hur AI-driven drift förändrar gästupplevelsen och effektiviteten i din restaurang.",
      },
      { property: "og:title", content: "Boka demo — Träffa Seytro" },
      {
        property: "og:description",
        content:
          "30 minuters genomgång anpassad efter er verksamhet. Se våra AI-röst- och mejlagenter hantera verkliga scenarion.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DemoPage,
});

const bullets = [
  "30 minuter anpassat efter din restaurang eller ditt hotell",
  "Se AI-agenter hantera bokningar, frågor och ändringar live",
  "Få koll på migrering, uppstart och snabb ROI",
];

const monthNames = [
  "januari",
  "februari",
  "mars",
  "april",
  "maj",
  "juni",
  "juli",
  "augusti",
  "september",
  "oktober",
  "november",
  "december",
];

const weekdays = ["S", "M", "T", "O", "T", "F", "L"];

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function Calendar() {
  const today = new Date();
  const [cursor, setCursor] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selected, setSelected] = useState<Date | null>(null);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Välj en tid</p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Föregående månad"
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[7.5rem] text-center text-sm capitalize text-foreground">
            {monthNames[month]} {year}
          </span>
          <button
            type="button"
            aria-label="Nästa månad"
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {weekdays.map((d, i) => (
          <div
            key={`${d}-${i}`}
            className="py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground"
          >
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;
          const date = new Date(year, month, day);
          const isToday = sameDay(date, today);
          const isSelected = selected ? sameDay(date, selected) : false;
          const isPast = date < startOfToday;
          return (
            <button
              key={day}
              type="button"
              disabled={isPast}
              onClick={() => setSelected(date)}
              className={[
                "aspect-square rounded-full text-sm transition-colors",
                isSelected
                  ? "bg-forest-deep text-primary-foreground"
                  : isToday
                    ? "border border-forest-deep font-medium text-forest-deep hover:bg-muted"
                    : isPast
                      ? "cursor-not-allowed text-muted-foreground/40"
                      : "text-foreground hover:bg-muted",
              ].join(" ")}
            >
              {day}
            </button>
          );
        })}
      </div>

      {selected && (
        <p className="mt-4 text-sm text-muted-foreground">
          Valt datum:{" "}
          <span className="text-foreground">
            {selected.getDate()} {monthNames[selected.getMonth()]}{" "}
            {selected.getFullYear()}
          </span>
        </p>
      )}
    </div>
  );
}

function DemoPage() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader solid />

      <main className="mx-auto max-w-6xl px-6 pb-16 pt-32 sm:pb-24 sm:pt-40">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Left */}
          <div className="lg:pt-6">
            <h1 className="font-display text-5xl leading-[1.05] text-forest-deep sm:text-6xl">
              Träffa Seytro
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
              Se hur AI-driven drift kan förändra din restaurangs gästupplevelse
              och effektivitet.
            </p>

            <ul className="mt-10 space-y-5">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest-deep">
                    <Check className="h-3.5 w-3.5 text-primary-foreground" />
                  </span>
                  <span className="text-base leading-relaxed text-foreground">
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — booking widget */}
          <div className="rounded-3xl border border-border bg-card p-7 shadow-[0_18px_50px_-24px_color-mix(in_oklab,var(--forest)_35%,transparent)] sm:p-9">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest-deep text-sm font-medium tracking-wide text-primary-foreground">
                CA
              </span>
              <span className="text-sm text-muted-foreground">
                Carl Milio Andrée
              </span>
            </div>

            <h2 className="mt-6 font-display text-2xl leading-snug text-forest-deep">
              30 minuters produktdemo med Seytro
            </h2>

            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-forest-deep" />
                30 min möte
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Video className="h-4 w-4 text-forest-deep" />
                Videolänk skickas efter bokning
              </div>
            </div>

            <div className="mt-7 border-t border-border pt-6">
              <h3 className="text-sm font-medium text-foreground">
                Vad händer under demot?
              </h3>
              <div className="mt-3 space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  På 30 minuter visar vi hur Seytro kan ersätta ditt nuvarande
                  bokningssystem, hjälpa dig att få in fler bokningar, minska
                  administrationen och ge dig bättre kontroll över salsplan och
                  tillgänglighet.
                </p>
                <p>
                  Du får se hur Seytros AI-agenter fungerar som en digital
                  maître d' — tillgängliga dygnet runt. De hanterar
                  bokningsförfrågningar via telefon och mejl, svarar gäster
                  inom en minut, följer upp när information saknas, och sköter
                  detaljer som större sällskap, menyval, allergier, ändringar,
                  avbokningar och särskilda önskemål.
                </p>
                <p>
                  Vi visar också hur bordsoptimeringen arbetar i realtid för
                  att hitta smartare sätt att placera gäster. Det hjälper dig
                  att ta emot fler bokningar, minska det manuella arbetet med
                  bordsfördelning och skapa ett lugnare flöde för reception,
                  bokningsansvariga och servicepersonal.
                </p>
                <p>
                  En viktig del av demon är övergången till Seytro. Vi går
                  igenom exakt hur migreringen fungerar, vad vårt team tar hand
                  om och vad vi behöver från er. Historiska bokningsdata,
                  gästinformation, mejlkonto, telefonuppsättning och viktiga
                  inställningar flyttas genom en tydlig process, så att ni kan
                  komma igång utan tekniska bekymmer eller störningar i
                  verksamheten.
                </p>
                <p>
                  Demot anpassas efter din restaurang, ditt hotell, dina
                  arbetsflöden och dina mål. Du lämnar mötet med en tydlig bild
                  av hur Seytro skulle fungera i din vardag, vilka delar som kan
                  automatiseras direkt och hur enkelt det är att komma igång.
                </p>
              </div>
            </div>

            <div className="mt-7 border-t border-border pt-6">
              <Calendar />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
