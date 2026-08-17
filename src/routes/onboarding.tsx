import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarClock,
  Check,
  LayoutGrid,
  MessageSquare,
  Plus,
  Settings2,
  Sparkles,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { FloorPlanEditor } from "@/components/dashboard/FloorPlanEditor";
import { MenuBuilder } from "@/components/onboarding/MenuBuilder";
import {
  PeriodIconGlyph,
  ServicePeriodPanel,
} from "@/components/onboarding/ServicePeriodPanel";
import { writeTemplates } from "@/lib/pm-templates";
import { writeAccountPlan } from "@/lib/account";
import {
  activePeriods,
  coversPerService,
  emptySetup,
  minutesBetween,
  newPeriod,
  readSetup,
  seatCount,
  weekdayShort,
  writeSetup,
  type ServicePeriod,
  type VenueSetup,
} from "@/lib/onboarding";


export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarda din restaurang — Seytro" },
      {
        name: "description",
        content:
          "Bygg din Seytro-drift från grunden: verksamhet, öppettider och pass, zoner, bordskarta, bokningsregler och AI-kanaler.",
      },
      { property: "og:title", content: "Onboarda din restaurang — Seytro" },
      {
        property: "og:description",
        content: "Sätt upp bordskarta, öppettider, bokningsregler och AI-agenter på några minuter.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OnboardingPage,
});

const steps = [
  { id: 0, label: "Verksamhet", icon: Building2 },
  { id: 1, label: "Öppettider", icon: CalendarClock },
  { id: 2, label: "Zoner & bordskarta", icon: LayoutGrid },
  { id: 3, label: "Bokningsregler", icon: Settings2 },
  { id: 4, label: "Menyer & dryck", icon: UtensilsCrossed },
  { id: 5, label: "Kanaler & AI", icon: MessageSquare },
  { id: 6, label: "Klart", icon: Sparkles },
] as const;

const field =
  "mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary";
const labelCls = "text-xs font-medium uppercase tracking-wide text-muted-foreground";

function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-border bg-background p-3 text-left"
    >
      <span className="min-w-0">
        <span className="block text-sm font-medium">{label}</span>
        {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-muted-foreground/25"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-surface-0 shadow-soft transition-all ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [setup, setSetup] = useState<VenueSetup>(() => readSetup() ?? emptySetup());
  const [zoneInput, setZoneInput] = useState("");

  const patch = (p: Partial<VenueSetup>) => setSetup((s) => ({ ...s, ...p }));

  const openMinutes = useMemo(() => {
    const open = setup.hours.filter((h) => !h.closed);
    if (open.length === 0 || setup.periods.length === 0) return 0;
    const total = open.reduce(
      (sum, h) =>
        sum +
        activePeriods(setup.periods, h.day).reduce(
          (m, p) => m + minutesBetween(p.start, p.end),
          0,
        ),
      0,
    );
    const passes = open.reduce((n, h) => n + activePeriods(setup.periods, h.day).length, 0) || 1;
    return Math.round(total / passes);
  }, [setup.hours, setup.periods]);

  const canContinue =
    step !== 0 || (setup.org.trim().length > 1 && setup.city.trim().length > 0);

  const finish = () => {
    writeSetup({ ...setup, seatsTotal: seatCount(setup.tables) });
    writeTemplates(setup.menus.filter((m) => m.custom));
    writeAccountPlan("custom");
    window.localStorage.setItem(
      "seytro-venue",
      setup.type === "hotell" ? "hotell" : "restaurang",
    );
    toast.success(`${setup.org || "Din verksamhet"} är uppsatt i Seytro`);
    navigate({ to: "/dashboard" });
  };

  return (
    <main className="min-h-[100svh] bg-muted/40 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to="/login" className="text-sm text-muted-foreground hover:text-forest">
            ← Till inloggning
          </Link>
          <button
            type="button"
            onClick={() => {
              writeSetup(setup);
              toast.success("Utkast sparat");
            }}
            className="text-sm text-muted-foreground hover:text-forest"
          >
            Spara utkast
          </button>
        </div>

        <h1 className="mt-5 text-3xl sm:text-4xl">Onboarda en ny verksamhet</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Bygg hela driften från grunden — utan demodata. Du sätter öppettider, zoner, bordskarta,
          bokningsregler och vilka kanaler Seytro AI ska sköta.
        </p>

        {/* Stegindikator */}
        <ol className="mt-8 flex flex-wrap gap-2">
          {steps.map((s) => {
            const Icon = s.icon;
            const done = step > s.id;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setStep(s.id)}
                  className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${
                    step === s.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : done
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                  {s.label}
                </button>
              </li>
            );
          })}
        </ol>

        <section className="mt-6 rounded-2xl border border-border bg-card p-5 sm:p-6">
          {step === 0 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <h2 className="text-xl">Verksamheten</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Grunduppgifter som används i bekräftelser, PM och gästkommunikation.
                </p>
              </div>
              <div>
                <label className={labelCls}>Namn</label>
                <input
                  value={setup.org}
                  onChange={(e) => patch({ org: e.target.value })}
                  placeholder="t.ex. Restaurang Nord"
                  className={field}
                />
              </div>
              <div>
                <label className={labelCls}>Typ av verksamhet</label>
                <select
                  value={setup.type}
                  onChange={(e) => patch({ type: e.target.value as VenueSetup["type"] })}
                  className={field}
                >
                  <option value="restaurang">Restaurang</option>
                  <option value="hotell">Hotell</option>
                  <option value="hybrid">Hotell med restaurang</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Stad</label>
                <input
                  value={setup.city}
                  onChange={(e) => patch({ city: e.target.value })}
                  placeholder="Stockholm"
                  className={field}
                />
              </div>
              <div>
                <label className={labelCls}>Adress</label>
                <input
                  value={setup.address}
                  onChange={(e) => patch({ address: e.target.value })}
                  placeholder="Gatan 1"
                  className={field}
                />
              </div>
              <div>
                <label className={labelCls}>Telefon</label>
                <input
                  value={setup.phone}
                  onChange={(e) => patch({ phone: e.target.value })}
                  placeholder="+46 8 000 00 00"
                  className={field}
                />
              </div>
              <div>
                <label className={labelCls}>E-post för bokningar</label>
                <input
                  value={setup.email}
                  onChange={(e) => patch({ email: e.target.value })}
                  placeholder="bokning@restaurang.se"
                  className={field}
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-xl">Öppettider och pass</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Skapa så många serveringspass ni behöver — frukost, lunch, middag, afternoon tea.
                Klicka på ett pass för att öppna dess tidsinställningar. Stängda dagar bokas aldrig
                av AI:n.
              </p>

              <div className="mt-5 rounded-2xl border border-border bg-background p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Serveringspass
                  </p>
                  <button
                    type="button"
                    onClick={addPeriod}
                    className="rounded-xl border border-dashed border-border px-3 py-1.5 text-xs transition hover:border-primary/50"
                  >
                    + Nytt pass
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {setup.periods.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setEditingPeriod(p.id)}
                      className="group flex items-center gap-3 rounded-2xl border border-border bg-card px-3.5 py-2.5 text-left transition hover:border-primary/50 hover:shadow-sm"
                    >
                      <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
                        <PeriodIconGlyph icon={p.icon} />
                      </span>
                      <span>
                        <span className="block text-sm font-medium tracking-tight">{p.name}</span>
                        <span className="block text-xs text-muted-foreground">
                          {p.start}–{p.end} ·{" "}
                          {p.days.length === 7
                            ? "alla dagar"
                            : p.days.map((d) => weekdayShort[d]).join(", ")}
                        </span>
                      </span>
                    </button>
                  ))}
                  {setup.periods.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Inga pass ännu — lägg till ert första.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {setup.hours.map((h, i) => {
                  const dayPeriods = activePeriods(setup.periods, h.day);
                  return (
                    <div
                      key={h.day}
                      className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background p-3"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          patch({
                            hours: setup.hours.map((x, j) =>
                              j === i ? { ...x, closed: !x.closed } : x,
                            ),
                          })
                        }
                        className="flex w-32 items-center gap-2 text-left text-sm font-medium"
                      >
                        <span
                          className={`grid h-5 w-5 place-items-center rounded border ${
                            h.closed
                              ? "border-border text-transparent"
                              : "border-primary bg-primary text-primary-foreground"
                          }`}
                        >
                          <Check className="h-3 w-3" />
                        </span>
                        {h.label}
                      </button>
                      {h.closed ? (
                        <span className="text-sm text-muted-foreground">Stängt</span>
                      ) : dayPeriods.length === 0 ? (
                        <span className="text-sm text-muted-foreground">Inget pass denna dag</span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {dayPeriods.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => setEditingPeriod(p.id)}
                              className="flex items-center gap-2 rounded-lg bg-muted/70 px-2.5 py-1.5 text-xs transition hover:bg-muted"
                            >
                              <PeriodIconGlyph icon={p.icon} className="h-3.5 w-3.5 text-primary" />
                              {p.name} {p.start}–{p.end}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl">Zoner och bordskarta</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Lägg till zoner, placera borden och sätt platser och form. Kartan blir din salsplan
                och underlaget AI:n placerar gäster på.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                {setup.zones.map((z) => (
                  <span
                    key={z}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm"
                  >
                    {z}
                    <button
                      type="button"
                      onClick={() =>
                        patch({
                          zones: setup.zones.filter((x) => x !== z),
                          tables: setup.tables.filter((t) => t.zone !== z),
                        })
                      }
                      className="text-muted-foreground hover:text-destructive"
                      aria-label={`Ta bort ${z}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
                <span className="flex items-center gap-1">
                  <input
                    value={zoneInput}
                    onChange={(e) => setZoneInput(e.target.value)}
                    placeholder="Ny zon"
                    className="h-9 w-32 rounded-lg border border-border bg-background px-3 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const v = zoneInput.trim();
                      if (!v || setup.zones.includes(v)) return;
                      patch({ zones: [...setup.zones, v] });
                      setZoneInput("");
                    }}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-border"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </span>
              </div>

              <div className="mt-5">
                <FloorPlanEditor
                  tables={setup.tables}
                  zones={setup.zones}
                  onChange={(tables) => patch({ tables })}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <h2 className="text-xl">Bokningsregler</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Reglerna styr vad AI:n får lova gäster i telefon, e-post och på webben.
                </p>
              </div>
              {(
                [
                  ["slotMinutes", "Bokningsintervall (min)"],
                  ["durationSmall", "Sittning 1–4 gäster (min)"],
                  ["durationLarge", "Sittning 5+ gäster (min)"],
                  ["buffer", "Buffert mellan sittningar (min)"],
                  ["maxParty", "Max sällskap online"],
                  ["largePartyThreshold", "Stort sällskap från (pers)"],
                  ["cancellationHours", "Avbokning senast (tim)"],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <label className={labelCls}>{label}</label>
                  <input
                    type="number"
                    value={setup.rules[key]}
                    onChange={(e) =>
                      patch({ rules: { ...setup.rules, [key]: Number(e.target.value) } })
                    }
                    className={field}
                  />
                </div>
              ))}
              <div className="grid gap-2 sm:col-span-2 sm:grid-cols-3">
                <Toggle
                  label="Automatisk bekräftelse"
                  hint="AI bekräftar direkt inom reglerna"
                  checked={setup.rules.autoConfirm}
                  onChange={(v) => patch({ rules: { ...setup.rules, autoConfirm: v } })}
                />
                <Toggle
                  label="Kräv telefonnummer"
                  checked={setup.rules.requirePhone}
                  onChange={(v) => patch({ rules: { ...setup.rules, requirePhone: v } })}
                />
                <Toggle
                  label="Kortgaranti stora sällskap"
                  checked={setup.rules.requireCard}
                  onChange={(v) => patch({ rules: { ...setup.rules, requireCard: v } })}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-xl">Menyer och dryck</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Lägg in matmenyer, dryckespaket, vin och sprit — på flera språk. Allt blir
                    valbart direkt när ett PM skapas på en bokning.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  Hoppa över — fyll på senare
                </button>
              </div>
              <div className="mt-5">
                <MenuBuilder value={setup.menus} onChange={(menus) => patch({ menus })} />
              </div>
            </div>
          )}


          {step === 5 && (
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="lg:col-span-2">
                <h2 className="text-xl">Kanaler och AI</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Välj vad Seytro sköter automatiskt. Allt annat landar i inkorgen för manuell
                  hantering.
                </p>
              </div>
              <div className="space-y-2">
                <p className={labelCls}>Kanaler</p>
                <Toggle
                  label="Röstagent"
                  hint="Svarar i telefon dygnet runt"
                  checked={setup.channels.voice}
                  onChange={(v) => patch({ channels: { ...setup.channels, voice: v } })}
                />
                <Toggle
                  label="E-postconcierge"
                  checked={setup.channels.email}
                  onChange={(v) => patch({ channels: { ...setup.channels, email: v } })}
                />
                <Toggle
                  label="Webbokning"
                  checked={setup.channels.web}
                  onChange={(v) => patch({ channels: { ...setup.channels, web: v } })}
                />
                <Toggle
                  label="SMS-påminnelser"
                  checked={setup.channels.sms}
                  onChange={(v) => patch({ channels: { ...setup.channels, sms: v } })}
                />
              </div>
              <div className="space-y-2">
                <p className={labelCls}>AI-automation</p>
                <Toggle
                  label="Besvara förfrågningar"
                  checked={setup.ai.autoAnswer}
                  onChange={(v) => patch({ ai: { ...setup.ai, autoAnswer: v } })}
                />
                <Toggle
                  label="Om- och avbokningar"
                  checked={setup.ai.autoRebook}
                  onChange={(v) => patch({ ai: { ...setup.ai, autoRebook: v } })}
                />
                <Toggle
                  label="Optimera bordsplacering"
                  hint="Låsta bord flyttas aldrig"
                  checked={setup.ai.autoOptimise}
                  onChange={(v) => patch({ ai: { ...setup.ai, autoOptimise: v } })}
                />
                <Toggle
                  label="Bygg PM för sällskap"
                  checked={setup.ai.autoPm}
                  onChange={(v) => patch({ ai: { ...setup.ai, autoPm: v } })}
                />
                <Toggle
                  label="Väntelista vid fullt"
                  checked={setup.ai.waitlist}
                  onChange={(v) => patch({ ai: { ...setup.ai, waitlist: v } })}
                />
                <div>
                  <label className={labelCls}>Tonalitet</label>
                  <select
                    value={setup.ai.tone}
                    onChange={(e) =>
                      patch({ ai: { ...setup.ai, tone: e.target.value as VenueSetup["ai"]["tone"] } })
                    }
                    className={field}
                  >
                    <option value="professionell">Professionell</option>
                    <option value="varm">Varm</option>
                    <option value="kortfattad">Kortfattad</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div>
              <h2 className="text-xl">Klart att köra</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Så här ser din uppsättning ut. Du kan ändra allt senare i dashboarden.
              </p>
              <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Verksamhet", setup.org || "Namnlös"],
                  ["Bord", `${setup.tables.length} st`],
                  ["Platser", `${seatCount(setup.tables)} st`],
                  ["Kapacitet per pass", `≈ ${coversPerService(setup, openMinutes) || 0} gäster`],
                  ["Zoner", setup.zones.join(", ") || "—"],
                  ["Öppna dagar", `${setup.hours.filter((h) => !h.closed).length} av 7`],
                  [
                    "Kanaler",
                    Object.entries(setup.channels)
                      .filter(([, v]) => v)
                      .map(([k]) => k)
                      .join(", ") || "inga",
                  ],
                  ["Stort sällskap", `från ${setup.rules.largePartyThreshold} pers`],
                  [
                    "Menyer & dryck",
                    setup.menus.length
                      ? `${setup.menus.filter((m) => m.kind === "meny").length} menyer · ${
                          setup.menus.filter((m) => m.kind === "dryck").length
                        } paket · ${
                          setup.menus.filter((m) => m.kind === "vin" || m.kind === "sprit").length
                        } dryckeslistor`
                      : "inget utbud ännu",
                  ],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl border border-border bg-background p-4">
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">{k}</dt>
                    <dd className="mt-1 text-sm font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              {setup.tables.length === 0 && (
                <p className="mt-4 rounded-xl border border-status-clean-border bg-status-clean p-3 text-sm text-status-clean-fg">
                  Du har inga bord ännu — gå tillbaka till bordskartan så kan AI:n placera gäster.
                </p>
              )}
            </div>
          )}
        </section>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex h-11 items-center gap-2 rounded-xl border border-border px-5 text-sm disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" /> Tillbaka
          </button>
          {step < 6 ? (
            <button
              type="button"
              onClick={() => canContinue && setStep((s) => s + 1)}
              disabled={!canContinue}
              className="flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground disabled:opacity-40"
            >
              Nästa <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={finish}
              className="flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground"
            >
              Starta driften <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
