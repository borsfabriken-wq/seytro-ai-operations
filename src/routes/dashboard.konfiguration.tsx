import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Building2,
  CalendarX,
  Clock,
  LayoutGrid,
  MessageSquare,
  Salad,
  Shuffle,
  Timer,
  Trash2,
  Users,
  Wand2,
} from "lucide-react";

import { useVenue } from "@/components/dashboard/DashboardShell";
import {
  PeriodIconGlyph,
  ServicePeriodPanel,
} from "@/components/onboarding/ServicePeriodPanel";
import {
  activePeriods,
  defaultPeriods,
  newPeriod,
  readSetup,
  weekdayShort,
  writeSetup,
  type ServicePeriod,
} from "@/lib/onboarding";

export const Route = createFileRoute("/dashboard/konfiguration")({
  head: () => ({
    meta: [
      { title: "Konfiguration — Seytro Dashboard" },
      { name: "description", content: "Öppettider, bokningsregler, bokningsmotor och bord." },
      { property: "og:title", content: "Konfiguration — Seytro Dashboard" },
      { property: "og:description", content: "Öppettider, bokningsregler, bokningsmotor och bord." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConfigPage,
});

const sections = [
  { id: "profil", label: "Profil", icon: Building2 },
  { id: "oppettider", label: "Öppettider", icon: Clock },
  { id: "regler", label: "Bokningsregler", icon: Wand2 },
  { id: "motor", label: "Bokningsmotor", icon: Shuffle },
  { id: "turtider", label: "Turtider", icon: Timer },
  { id: "sallskap", label: "Stora sällskap", icon: Users },
  { id: "meny", label: "Meny & allergener", icon: Salad },
  { id: "sms", label: "SMS & bekräftelser", icon: MessageSquare },
  { id: "bord", label: "Bord & zoner", icon: LayoutGrid },
  { id: "stangningar", label: "Stängningar", icon: CalendarX },
] as const;

type SectionId = (typeof sections)[number]["id"];

const days = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"];

type Effort = "varsamt" | "balanserat" | "offensivt";

type Closure = {
  id: string;
  from: string;
  to: string;
  scope: "Hela dagen" | "Lunch" | "Middag";
  reason: string;
};

type Settings = {
  effort: Effort;
  moveKnownBookings: boolean;
  maxMoves: number;
  keepVips: boolean;
  holdBigTables: boolean;
  chainMoves: boolean;
  onlyTouchingTables: boolean;
  suggestWithinMinutes: number;
  onlyIfBetterPct: number;
  approvalNote: string;
};

const defaultSettings: Settings = {
  effort: "balanserat",
  moveKnownBookings: true,
  maxMoves: 2,
  keepVips: true,
  holdBigTables: true,
  chainMoves: false,
  onlyTouchingTables: false,
  suggestWithinMinutes: 60,
  onlyIfBetterPct: 15,
  approvalNote: "",
};

const effortOptions: { id: Effort; label: string; desc: string }[] = [
  {
    id: "varsamt",
    label: "Varsamt",
    desc: "Placerar varje sällskap vettigt men flyttar aldrig någon. Vissa bokningar ni hade kunnat ta emot nekas.",
  },
  {
    id: "balanserat",
    label: "Balanserat",
    desc: "Flyttar bokningar som ännu inte anlänt till ett annat bord när det är enda sättet att ta emot ett sällskap ni annars hade nekat.",
  },
  {
    id: "offensivt",
    label: "Offensivt",
    desc: "Möblerar även om rummet för att frigöra kapacitet ingen ännu bett om. Det kan innebära samtal till gäster för en bokning som kanske aldrig kommer.",
  },
];

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-forest outline-none focus:border-primary";

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-primary" : "bg-muted"
      }`}
    >
      <span
        className={`block h-5 w-5 rounded-full bg-background shadow-soft transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

/** Toggle rad i lista (lokalt state, används för enklare inställningar). */
function Toggle({
  label,
  hint,
  defaultOn = false,
  onDirty,
}: {
  label: string;
  hint?: string;
  defaultOn?: boolean;
  onDirty?: () => void;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 py-3 last:border-0">
      <div>
        <p className="text-sm text-forest">{label}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      <Switch
        checked={on}
        label={label}
        onChange={(v) => {
          setOn(v);
          onDirty?.();
        }}
      />
    </div>
  );
}

/** Kort med tydlig rubrik, beskrivning och en switch till höger. */
function SwitchCard({
  title,
  desc,
  checked,
  onChange,
}: {
  title: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-background p-4">
      <div>
        <p className="text-sm text-forest">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={checked} onChange={onChange} label={title} />
    </div>
  );
}

function Card({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <h2 className="text-lg text-forest">{title}</h2>
      {desc && <p className="mt-0.5 text-sm text-muted-foreground">{desc}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function ConfigPage() {
  const { venue, data, setup } = useVenue();
  const navigate = useNavigate();
  const [section, setSection] = useState<SectionId>("profil");
  const [dirty, setDirty] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [closures, setClosures] = useState<Closure[]>([]);
  const [closureForm, setClosureForm] = useState({
    from: "",
    to: "",
    scope: "Hela dagen" as Closure["scope"],
    reason: "",
  });

  const [periods, setPeriods] = useState<ServicePeriod[]>(defaultPeriods);
  const [editingPeriod, setEditingPeriod] = useState<string | null>(null);

  // Pass ligger i den sparade uppsättningen; faller tillbaka på standardpassen.
  useEffect(() => {
    const stored = readSetup();
    if (stored?.periods?.length) setPeriods(stored.periods);
  }, []);

  const persistPeriods = (next: ServicePeriod[]) => {
    setPeriods(next);
    const stored = readSetup();
    if (stored) writeSetup({ ...stored, periods: next });
  };

  const addPeriod = () => {
    const p = newPeriod();
    persistPeriods([...periods, p]);
    setEditingPeriod(p.id);
  };

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }));
    setDirty(true);
  };
  const markDirty = () => setDirty(true);

  const save = () => {
    setDirty(false);
    toast.success("Inställningarna är sparade");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display text-forest">Konfiguration</h1>
          <p className="text-body text-muted-foreground">
            Allt som styr hur AI:n bokar, placerar och kommunicerar.
          </p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={!dirty}
          className={`rounded-full px-5 py-2 text-sm transition-opacity ${
            dirty
              ? "bg-primary text-primary-foreground hover:opacity-90"
              : "cursor-default bg-muted text-muted-foreground"
          }`}
        >
          {dirty ? "Spara ändringar" : "Inga ändringar"}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[14rem_1fr]">
        <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-border bg-card p-2 lg:flex-col lg:overflow-visible">
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSection(s.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${
                section === s.id ? "bg-accent text-forest" : "text-muted-foreground hover:text-forest"
              }`}
            >
              <s.icon className="h-4 w-4" />
              {s.label}
            </button>
          ))}
        </nav>

        <div className="space-y-6">
          {section === "profil" && (
            <Card title="Verksamhetsprofil" desc="Uppgifterna används i bekräftelser och av AI-agenterna.">
              <div className="grid gap-4 sm:grid-cols-2" onChange={markDirty}>
                <Field label="Namn">
                  <input className={inputClass} defaultValue={setup?.org ?? "Astrid Restaurang"} />
                </Field>
                <Field label="Typ">
                  <select className={inputClass} defaultValue={venue}>
                    <option value="restaurang">Restaurang</option>
                    <option value="hotell">Hotell</option>
                    <option value="hybrid">Hotell med restaurang</option>
                  </select>
                </Field>
                <Field label="Telefon">
                  <input className={inputClass} defaultValue={setup?.phone ?? "+46 8 555 120 00"} />
                </Field>
                <Field label="E-post">
                  <input className={inputClass} defaultValue={setup?.email ?? "bokning@seytro.com"} />
                </Field>
                <Field label="Adress">
                  <input
                    className={inputClass}
                    defaultValue={setup?.address ?? "Birger Jarlsgatan 12, Stockholm"}
                  />
                </Field>
                <Field label="Tidszon">
                  <select className={inputClass} defaultValue="Europe/Stockholm">
                    <option>Europe/Stockholm</option>
                    <option>Europe/Oslo</option>
                    <option>Europe/London</option>
                  </select>
                </Field>
                <Field label="Språk i gästkommunikation">
                  <select className={inputClass} defaultValue="sv">
                    <option value="sv">Svenska</option>
                    <option value="en">Engelska</option>
                    <option value="auto">Automatiskt efter gästen</option>
                  </select>
                </Field>
                <Field label="Ton i AI-svar">
                  <select className={inputClass} defaultValue="varm">
                    <option value="varm">Varm och personlig</option>
                    <option value="kort">Kort och effektiv</option>
                    <option value="formell">Formell</option>
                  </select>
                </Field>
              </div>
            </Card>
          )}

          {section === "oppettider" && (
            <Card
              title="Öppettider och pass"
              desc="Serveringspass med egna tidsinställningar. Klicka på ett pass för att ändra tider, veckodagar och ikon."
            >
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
                {periods.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setEditingPeriod(p.id)}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card px-3.5 py-2.5 text-left transition hover:border-primary/50 hover:shadow-sm"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
                      <PeriodIconGlyph icon={p.icon} />
                    </span>
                    <span>
                      <span className="block text-sm font-medium tracking-tight">{p.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {p.start}–{p.end} · standard {p.defaultTime}
                      </span>
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-5 space-y-1">
                {days.map((d, i) => {
                  const dayPeriods = activePeriods(periods, i);
                  return (
                    <div
                      key={d}
                      className="flex flex-wrap items-center gap-3 border-b border-border/60 py-3 last:border-0"
                    >
                      <span className="w-28 text-sm text-forest">{d}</span>
                      {dayPeriods.length === 0 ? (
                        <span className="text-sm text-muted-foreground">Stängt</span>
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

              <div className="mt-5">
                <Toggle
                  label="Stäng automatiskt vid helgdagar"
                  hint="Följer svensk helgdagskalender."
                  defaultOn
                  onDirty={markDirty}
                />
                <Toggle
                  label="Sista bokningsbara tid = 60 min före stängning"
                  defaultOn
                  onDirty={markDirty}
                />
              </div>
            </Card>
          )}

          {section === "regler" && (
            <Card title="Bokningsregler" desc="Ramarna AI:n aldrig bryter mot.">
              <div className="grid gap-4 sm:grid-cols-2" onChange={markDirty}>
                <Field label="Max sällskap online">
                  <input type="number" className={inputClass} defaultValue={8} />
                </Field>
                <Field label="Minsta framförhållning (minuter)">
                  <input type="number" className={inputClass} defaultValue={30} />
                </Field>
                <Field label="Bokningsbart i förväg (dagar)">
                  <input type="number" className={inputClass} defaultValue={90} />
                </Field>
                <Field label="Kapacitetstak per 15 min">
                  <input type="number" className={inputClass} defaultValue={20} />
                </Field>
              </div>
              <div className="mt-5">
                <Toggle label="AI får neka bokningar vid överbelastning" defaultOn onDirty={markDirty} />
                <Toggle
                  label="Kräv kortgaranti för sällskap över 8"
                  hint="Gästen får en säker länk i bekräftelsen."
                  defaultOn
                  onDirty={markDirty}
                />
                <Toggle label="Tillåt dubbelbokning av bord med marginal" onDirty={markDirty} />
                <Toggle label="Automatisk väntelista när passet är fullt" defaultOn onDirty={markDirty} />
              </div>
            </Card>
          )}

          {section === "motor" && (
            <>
              <Card
                title="Hur hårt ska rummet jobbas"
                desc="Om bokningsmotorn får möblera om för att få in fler sällskap — och hur långt den får gå innan den frågar er."
              >
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Omplacering</p>
                  {effortOptions.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => update("effort", o.id)}
                      className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                        settings.effort === o.id
                          ? "border-primary bg-accent"
                          : "border-border bg-background hover:border-primary/40"
                      }`}
                    >
                      <span
                        className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
                          settings.effort === o.id ? "border-primary" : "border-border"
                        }`}
                      >
                        {settings.effort === o.id && (
                          <span className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </span>
                      <span>
                        <span className="block text-sm text-forest">{o.label}</span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                          {o.desc}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-5 space-y-3">
                  <SwitchCard
                    title="Får flytta bokningar gästen redan känner till"
                    desc="Endast till ett annat bord, aldrig en annan tid och aldrig ett sällskap som redan satt sig. Av betyder att bara obekräftade bokningar flyttas."
                    checked={settings.moveKnownBookings}
                    onChange={(v) => update("moveKnownBookings", v)}
                  />
                  <Field
                    label="Max flyttade bokningar per beslut"
                    hint="Varje flytt är en bordsändring någon i salen måste känna till. 0 stänger av omplacering helt, oavsett nivå ovan."
                  >
                    <input
                      type="number"
                      min={0}
                      value={settings.maxMoves}
                      onChange={(e) => update("maxMoves", Number(e.target.value))}
                      className={inputClass}
                    />
                  </Field>
                  <SwitchCard
                    title="Lämna VIP och stamgäster där de är"
                    desc="En stamgäst som lovats sitt vanliga bord behåller det, även när en flytt hade släppt in ett annat sällskap."
                    checked={settings.keepVips}
                    onChange={(v) => update("keepVips", v)}
                  />
                  <SwitchCard
                    title="Håll stora bord för stora sällskap"
                    desc="En lugn tisdag sätter inte ett par vid niobordet. Av fyller det som är ledigt, först till kvarn."
                    checked={settings.holdBigTables}
                    onChange={(v) => update("holdBigTables", v)}
                  />
                  <SwitchCard
                    title="Följ en kedja av flyttar"
                    desc="Flytta ett sällskap till ett bord som i sin tur är upptaget, genom att först flytta det sällskapet. Går aldrig djupare än två steg och varje flytt räknas mot taket ovan."
                    checked={settings.chainMoves}
                    onChange={(v) => update("chainMoves", v)}
                  />
                  <SwitchCard
                    title="Slå bara ihop bord som är kartlagda som angränsande"
                    desc="Ett bord utan angivna grannar i salsplanen kan då inte slås ihop med något alls. Slå på först när ni satt 'kan slås ihop med' på de bord som verkligen går att skjuta ihop."
                    checked={settings.onlyTouchingTables}
                    onChange={(v) => update("onlyTouchingTables", v)}
                  />
                </div>
              </Card>

              <Card
                title="Alternativa tider"
                desc="Hur gärna AI:n får föreslå en annan tid än den gästen frågade om."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Föreslå andra tider inom (min)"
                    hint="Hur långt före eller efter den önskade tiden motorn får leta efter en bättre tid. 0 stänger av förslagen."
                  >
                    <input
                      type="number"
                      min={0}
                      value={settings.suggestWithinMinutes}
                      onChange={(e) => update("suggestWithinMinutes", Number(e.target.value))}
                      className={inputClass}
                    />
                  </Field>
                  <Field
                    label="Bara om det är bättre med (%)"
                    hint="Hur mycket bättre alternativet måste vara för kvällen innan det är värt att störa gästen. Låga siffror ger fler förslag."
                  >
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={settings.onlyIfBetterPct}
                      onChange={(e) => update("onlyIfBetterPct", Number(e.target.value))}
                      className={inputClass}
                    />
                  </Field>
                </div>
              </Card>
            </>
          )}

          {section === "turtider" && (
            <Card title="Turtider" desc="Hur länge ett bord är upptaget beroende på sällskapets storlek.">
              <div className="space-y-1" onChange={markDirty}>
                {[
                  ["1–2 personer", 90],
                  ["3–4 personer", 105],
                  ["5–6 personer", 120],
                  ["7–8 personer", 150],
                  ["9+ personer", 180],
                ].map(([label, min]) => (
                  <div
                    key={label as string}
                    className="flex items-center justify-between gap-4 border-b border-border/60 py-3 last:border-0"
                  >
                    <span className="text-sm text-forest">{label}</span>
                    <div className="flex items-center gap-2">
                      <input type="number" defaultValue={min as number} className={`${inputClass} w-24`} />
                      <span className="text-xs text-muted-foreground">min</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <Toggle
                  label="Låt AI justera turtider efter faktiskt utfall"
                  hint="Lär sig av historiska sittningar per veckodag."
                  defaultOn
                  onDirty={markDirty}
                />
                <Toggle label="Extra 15 min buffert mellan sittningar" defaultOn onDirty={markDirty} />
              </div>
            </Card>
          )}

          {section === "sallskap" && (
            <Card title="Stora sällskap" desc="Sällskap över tröskeln hanteras som PM av AI:n.">
              <div className="grid gap-4 sm:grid-cols-2" onChange={markDirty}>
                <Field label="Tröskel för stort sällskap" hint="Antal gäster som triggar PM-flödet.">
                  <input type="number" className={inputClass} defaultValue={8} />
                </Field>
                <Field label="Deadline för förbeställning (dagar innan)">
                  <input type="number" className={inputClass} defaultValue={3} />
                </Field>
                <Field label="Depositionsbelopp per gäst (kr)">
                  <input type="number" className={inputClass} defaultValue={300} />
                </Field>
                <Field label="Avbokningsfrist (timmar)">
                  <input type="number" className={inputClass} defaultValue={48} />
                </Field>
              </div>
              <div className="mt-5">
                <Toggle label="AI skapar PM automatiskt vid bokning" defaultOn onDirty={markDirty} />
                <Toggle label="Skicka menyval och dryckespaket automatiskt" defaultOn onDirty={markDirty} />
                <Toggle label="Kräv manuellt godkännande innan bekräftelse" onDirty={markDirty} />
              </div>
              <div className="mt-5">
                <Field
                  label="Not som visas när godkännande behövs"
                  hint="Läses av personalen och av AI:n när den måste berätta för gästen att bokningen behöver kollas. Skriv vad som händer härnäst, inte att något är fel."
                >
                  <textarea
                    rows={3}
                    value={settings.approvalNote}
                    onChange={(e) => update("approvalNote", e.target.value)}
                    placeholder="Ring chefen på 070…, eller mejla events@…"
                    className={inputClass}
                  />
                </Field>
              </div>
            </Card>
          )}

          {section === "meny" && (
            <Card title="Meny och allergener" desc="Underlaget AI:n använder när gäster frågar.">
              <div className="space-y-1">
                {["Gluten", "Laktos", "Nötter", "Skaldjur", "Vegan", "Vegetariskt"].map((a) => (
                  <Toggle
                    key={a}
                    label={a}
                    hint={`Alternativ finns för ${a.toLowerCase()}`}
                    defaultOn
                    onDirty={markDirty}
                  />
                ))}
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2" onChange={markDirty}>
                <Field label="Menypaket 1">
                  <input className={inputClass} defaultValue="3 rätter — 695 kr" />
                </Field>
                <Field label="Menypaket 2">
                  <input className={inputClass} defaultValue="4 rätter — 895 kr" />
                </Field>
                <Field label="Dryckespaket">
                  <input className={inputClass} defaultValue="Vinpaket 3 glas — 545 kr" />
                </Field>
                <Field label="Barnmeny">
                  <input className={inputClass} defaultValue="2 rätter — 165 kr" />
                </Field>
              </div>
            </Card>
          )}

          {section === "sms" && (
            <Card title="SMS och bekräftelser" desc="Automatiska utskick till gästen.">
              <div className="space-y-1">
                <Toggle label="Bekräftelse direkt vid bokning" defaultOn onDirty={markDirty} />
                <Toggle label="Påminnelse 24 timmar innan" defaultOn onDirty={markDirty} />
                <Toggle
                  label="Påminnelse 2 timmar innan vid hög no-show-risk"
                  defaultOn
                  onDirty={markDirty}
                />
                <Toggle
                  label="Tack-meddelande med recensionslänk efter besök"
                  defaultOn
                  onDirty={markDirty}
                />
                <Toggle label="Erbjudande från väntelistan via SMS" defaultOn onDirty={markDirty} />
              </div>
              <div className="mt-5 grid gap-4" onChange={markDirty}>
                <Field label="Avsändarnamn" hint="Max 11 tecken.">
                  <input className={inputClass} defaultValue="Seytro" maxLength={11} />
                </Field>
                <Field label="Mall för bekräftelse">
                  <textarea
                    rows={3}
                    className={inputClass}
                    defaultValue="Hej {namn}! Din bokning {datum} kl {tid} för {antal} personer är bekräftad. Svara AVBOKA för att avboka."
                  />
                </Field>
                <Field label="Mall för påminnelse">
                  <textarea
                    rows={3}
                    className={inputClass}
                    defaultValue="Vi ses idag kl {tid}, {namn}! Svara JA för att bekräfta eller AVBOKA om något kommit emellan."
                  />
                </Field>
              </div>
            </Card>
          )}

          {section === "bord" && (
            <Card
              title={venue === "hotell" ? "Rum och kategorier" : "Bord och zoner"}
              desc="Kapaciteten AI:n placerar gäster i."
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[34rem] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="py-2 font-normal">Beteckning</th>
                      <th className="py-2 font-normal">Zon</th>
                      <th className="py-2 font-normal">Platser</th>
                      <th className="py-2 font-normal">Kan slås ihop</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.units.map((u) => (
                      <tr key={u.id} className="border-b border-border/60 last:border-0">
                        <td className="py-2.5 text-forest">{u.label}</td>
                        <td className="py-2.5 text-muted-foreground">{u.zone}</td>
                        <td className="py-2.5 text-muted-foreground">{u.seats}</td>
                        <td className="py-2.5 text-muted-foreground">{u.seats >= 4 ? "Ja" : "Nej"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                onClick={() => navigate({ to: "/onboarding" })}
                className="mt-5 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-forest"
              >
                Öppna salsplanseditorn
              </button>
            </Card>
          )}

          {section === "stangningar" && (
            <Card
              title="Stängningar och specialdatum"
              desc="Dagar då ni inte tar emot bokningar — helgdagar, privata event, renovering. Sparas direkt när ni lägger till dem."
            >
              {closures.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                  Inga stängningar. Bokningar tas emot alla dagar öppettiderna gäller.
                </p>
              ) : (
                <ul className="space-y-2">
                  {closures.map((c) => (
                    <li
                      key={c.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3"
                    >
                      <div>
                        <p className="text-sm text-forest">
                          {c.from}
                          {c.to && c.to !== c.from ? ` – ${c.to}` : ""} · {c.scope}
                        </p>
                        <p className="text-xs text-muted-foreground">{c.reason || "Ingen orsak angiven"}</p>
                      </div>
                      <button
                        type="button"
                        aria-label="Ta bort stängning"
                        onClick={() => {
                          setClosures((prev) => prev.filter((x) => x.id !== c.id));
                          toast.success("Stängningen är borttagen");
                        }}
                        className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-forest"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-5 rounded-xl border border-border bg-background p-4">
                <p className="text-sm text-forest">Lägg till en stängning</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Från">
                    <input
                      type="date"
                      value={closureForm.from}
                      onChange={(e) => setClosureForm((f) => ({ ...f, from: e.target.value }))}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Till">
                    <input
                      type="date"
                      value={closureForm.to}
                      onChange={(e) => setClosureForm((f) => ({ ...f, to: e.target.value }))}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Omfattning">
                    <select
                      value={closureForm.scope}
                      onChange={(e) =>
                        setClosureForm((f) => ({ ...f, scope: e.target.value as Closure["scope"] }))
                      }
                      className={inputClass}
                    >
                      <option>Hela dagen</option>
                      <option>Lunch</option>
                      <option>Middag</option>
                    </select>
                  </Field>
                  <Field label="Orsak">
                    <input
                      value={closureForm.reason}
                      onChange={(e) => setClosureForm((f) => ({ ...f, reason: e.target.value }))}
                      placeholder="Midsommar, privat event…"
                      className={inputClass}
                    />
                  </Field>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!closureForm.from) {
                      toast.error("Välj ett från-datum");
                      return;
                    }
                    setClosures((prev) => [
                      ...prev,
                      {
                        id: `c${Date.now()}`,
                        from: closureForm.from,
                        to: closureForm.to || closureForm.from,
                        scope: closureForm.scope,
                        reason: closureForm.reason,
                      },
                    ]);
                    setClosureForm({ from: "", to: "", scope: "Hela dagen", reason: "" });
                    toast.success("Stängningen är tillagd");
                  }}
                  className="mt-4 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Lägg till stängning
                </button>
              </div>
            </Card>
          )}
        </div>
      </div>
      {editingPeriod && periods.some((p) => p.id === editingPeriod) && (
        <ServicePeriodPanel
          period={periods.find((p) => p.id === editingPeriod)!}
          siblings={periods}
          onSelect={setEditingPeriod}
          onAdd={addPeriod}
          onSave={(next) => {
            persistPeriods(periods.map((p) => (p.id === next.id ? next : p)));
            toast.success(`${next.name} sparat`);
            setEditingPeriod(null);
          }}
          onDelete={(id) => {
            persistPeriods(periods.filter((p) => p.id !== id));
            setEditingPeriod(null);
          }}
          onClose={() => setEditingPeriod(null)}
        />
      )}
    </div>
  );
}
