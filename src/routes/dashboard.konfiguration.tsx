import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Building2,
  Clock,
  LayoutGrid,
  MessageSquare,
  Salad,
  Timer,
  Users,
  Wand2,
} from "lucide-react";

import { useVenue } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/dashboard/konfiguration")({
  head: () => ({
    meta: [
      { title: "Konfiguration — Seytro Dashboard" },
      { name: "description", content: "Öppettider, bokningsregler, bord och AI-inställningar." },
      { property: "og:title", content: "Konfiguration — Seytro Dashboard" },
      { property: "og:description", content: "Öppettider, bokningsregler, bord och AI-inställningar." },
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
  { id: "turtider", label: "Turtider", icon: Timer },
  { id: "sallskap", label: "Stora sällskap", icon: Users },
  { id: "meny", label: "Meny & allergener", icon: Salad },
  { id: "sms", label: "SMS & bekräftelser", icon: MessageSquare },
  { id: "bord", label: "Bord & zoner", icon: LayoutGrid },
] as const;

type SectionId = (typeof sections)[number]["id"];

const days = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"];

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

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-forest outline-none focus:border-primary";

function Toggle({
  label,
  hint,
  defaultOn = false,
}: {
  label: string;
  hint?: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 py-3 last:border-0">
      <div>
        <p className="text-sm text-forest">{label}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => setOn((v) => !v)}
        className={`mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors ${
          on ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-background shadow-soft transition-transform ${
            on ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function Card({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
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

  const save = () => toast.success("Inställningarna är sparade");

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
          className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground transition-opacity hover:opacity-90"
        >
          Spara ändringar
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
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Namn">
                  <input className={inputClass} defaultValue={setup?.name ?? data.venueName} />
                </Field>
                <Field label="Typ">
                  <select className={inputClass} defaultValue={venue}>
                    <option value="restaurang">Restaurang</option>
                    <option value="hotell">Hotell</option>
                    <option value="hybrid">Hotell med restaurang</option>
                  </select>
                </Field>
                <Field label="Telefon">
                  <input className={inputClass} defaultValue="+46 8 555 120 00" />
                </Field>
                <Field label="E-post">
                  <input className={inputClass} defaultValue="bokning@seytro.com" />
                </Field>
                <Field label="Adress">
                  <input className={inputClass} defaultValue="Birger Jarlsgatan 12, Stockholm" />
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
            <Card title="Öppettider och pass" desc="Bokningsbara tider per dag och pass.">
              <div className="space-y-1">
                {days.map((d) => (
                  <div
                    key={d}
                    className="grid items-center gap-3 border-b border-border/60 py-3 last:border-0 sm:grid-cols-[7rem_1fr_1fr]"
                  >
                    <span className="text-sm text-forest">{d}</span>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-14 text-xs text-muted-foreground">Lunch</span>
                      <input className={inputClass} defaultValue="11:30" />
                      <input className={inputClass} defaultValue="14:30" />
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-14 text-xs text-muted-foreground">Middag</span>
                      <input className={inputClass} defaultValue="17:00" />
                      <input className={inputClass} defaultValue="22:00" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <Toggle label="Stäng automatiskt vid helgdagar" hint="Följer svensk helgdagskalender." defaultOn />
                <Toggle label="Sista bokningsbara tid = 60 min före stängning" defaultOn />
              </div>
            </Card>
          )}

          {section === "regler" && (
            <Card title="Bokningsregler" desc="Ramarna AI:n aldrig bryter mot.">
              <div className="grid gap-4 sm:grid-cols-2">
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
                <Toggle label="AI får neka bokningar vid överbelastning" defaultOn />
                <Toggle
                  label="Kräv kortgaranti för sällskap över 8"
                  hint="Gästen får en säker länk i bekräftelsen."
                  defaultOn
                />
                <Toggle label="Tillåt dubbelbokning av bord med marginal" />
                <Toggle label="Automatisk väntelista när passet är fullt" defaultOn />
              </div>
            </Card>
          )}

          {section === "turtider" && (
            <Card title="Turtider" desc="Hur länge ett bord är upptaget beroende på sällskapets storlek.">
              <div className="space-y-1">
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
                />
                <Toggle label="Extra 15 min buffert mellan sittningar" defaultOn />
              </div>
            </Card>
          )}

          {section === "sallskap" && (
            <Card title="Stora sällskap" desc="Sällskap över tröskeln hanteras som PM av AI:n.">
              <div className="grid gap-4 sm:grid-cols-2">
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
                <Toggle label="AI skapar PM automatiskt vid bokning" defaultOn />
                <Toggle label="Skicka menyval och dryckespaket automatiskt" defaultOn />
                <Toggle label="Kräv manuellt godkännande innan bekräftelse" />
              </div>
            </Card>
          )}

          {section === "meny" && (
            <Card title="Meny och allergener" desc="Underlaget AI:n använder när gäster frågar.">
              <div className="space-y-1">
                {["Gluten", "Laktos", "Nötter", "Skaldjur", "Vegan", "Vegetariskt"].map((a) => (
                  <Toggle key={a} label={a} hint={`Alternativ finns för ${a.toLowerCase()}`} defaultOn />
                ))}
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
                <Toggle label="Bekräftelse direkt vid bokning" defaultOn />
                <Toggle label="Påminnelse 24 timmar innan" defaultOn />
                <Toggle label="Påminnelse 2 timmar innan vid hög no-show-risk" defaultOn />
                <Toggle label="Tack-meddelande med recensionslänk efter besök" defaultOn />
                <Toggle label="Erbjudande från väntelistan via SMS" defaultOn />
              </div>
              <div className="mt-5 grid gap-4">
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
        </div>
      </div>
    </div>
  );
}
