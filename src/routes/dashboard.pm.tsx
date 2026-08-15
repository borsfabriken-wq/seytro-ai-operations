import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronRight,
  ClipboardList,
  FilePlus2,
  Printer,
  Search,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { useVenue } from "@/components/dashboard/DashboardShell";
import { PmSheet } from "@/components/dashboard/PmSheet";
import { PmComposer } from "@/components/dashboard/PmComposer";
import { statusStyles } from "@/lib/dashboard-data";
import { TemplateManager } from "@/components/dashboard/TemplateManager";
import { useTemplates } from "@/lib/pm-templates";
import { kr, pmDocs as seedDocs, pmTotal, uid, type PmDoc } from "@/lib/pm";
import { buildPmDoc, emptyChoice, type PmChoice } from "@/lib/pm-compose";
import { updatePmDoc, usePmDocs } from "@/lib/pm-store";

export const Route = createFileRoute("/dashboard/pm")({
  head: () => ({
    meta: [
      { title: "PM och förbeställningar — Seytro Dashboard" },
      {
        name: "description",
        content:
          "Bygg PM i tre steg: fast meny, dryckespaket och speciella artiklar. Skrivs ut och betalas på plats.",
      },
      { property: "og:title", content: "PM och förbeställningar — Seytro Dashboard" },
      {
        property: "og:description",
        content: "Fasta menyer, dryckespaket och speciella artiklar i ett tydligt utskriftsunderlag.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PmPage,
});

function PmPage() {
  const { data, venue } = useVenue();
  const unitWord = venue === "hotell" ? "Rum" : "Bord";

  const stored = usePmDocs();
  const [local, setLocal] = useState<PmDoc[]>(seedDocs);
  const [selected, setSelected] = useState<string>(stored[0]?.id ?? seedDocs[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"pm" | "mallar">("pm");
  const [mode, setMode] = useState<"bygg" | "utskrift">("bygg");
  const [filter, setFilter] = useState<"kommande" | "alla">("kommande");
  const [choices, setChoices] = useState<Record<string, PmChoice>>({});
  const { templates, addTemplate, removeTemplate } = useTemplates();

  const docs = useMemo(
    () => [...stored.filter((s) => !local.some((l) => l.id === s.id)), ...local],
    [stored, local],
  );

  /** Kommande PM = allt som inte är avslutat/arkiverat. */
  const isUpcoming = (d: PmDoc) => d.status !== "skickad till kök" || d.date === "idag";

  const bookingOf = (doc: PmDoc) => data.bookings.find((b) => b.id === doc.bookingId) ?? null;

  const visible = docs
    .filter((d) => (filter === "kommande" ? isUpcoming(d) : true))
    .filter((d) => (query ? d.title.toLowerCase().includes(query.toLowerCase()) : true));
  const active = docs.find((d) => d.id === selected) ?? null;

  const updateDoc = (next: PmDoc) => {
    if (stored.some((s) => s.id === next.id)) {
      updatePmDoc(next);
      return;
    }
    setLocal((prev) => prev.map((d) => (d.id === next.id ? next : d)));
  };

  const createBlank = () => {
    const doc: PmDoc = {
      id: uid("pm"),
      bookingId: "",
      title: "Nytt PM",
      date: "idag",
      time: "18:00",
      party: 10,
      status: "utkast",
      split: [],
      sections: [],
    };
    setLocal((prev) => [doc, ...prev]);
    setSelected(doc.id);
    setChoices((prev) => ({ ...prev, [doc.id]: { ...emptyChoice } }));
    setMode("bygg");
  };

  /** Alla sällskap över 8 personer landar här automatiskt när gästen bokar. */
  const largeParties = data.bookings
    .filter((b) => b.status !== "avbokad" && b.party >= 8)
    .sort((a, b) => a.time.localeCompare(b.time));

  const openOrCreate = (b: (typeof largeParties)[number]) => {
    const existing = docs.find((d) => d.bookingId === b.id);
    if (existing) {
      setSelected(existing.id);
      setMode("utskrift");
      return;
    }
    const doc: PmDoc = {
      id: uid("pm"),
      bookingId: b.id,
      title: `${b.name} — ${b.party} personer`,
      date: "idag",
      time: b.time,
      party: b.party,
      status: "utkast",
      split: [],
      sections: [],
      ...(b.company ? { contact: b.company } : {}),
      ...(b.email ? { email: b.email } : {}),
    };
    setLocal((prev) => [doc, ...prev]);
    setSelected(doc.id);
    setChoices((prev) => ({ ...prev, [doc.id]: { ...emptyChoice } }));
    setMode("bygg");
  };

  const activeChoice = active ? (choices[active.id] ?? emptyChoice) : emptyChoice;

  const applyChoice = (next: PmChoice) => {
    if (!active) return;
    setChoices((prev) => ({ ...prev, [active.id]: next }));
    updateDoc(
      buildPmDoc(
        {
          id: active.id,
          title: active.title,
          date: active.date,
          time: active.time,
          party: active.party,
          status: active.status,
          ...(active.bookingId ? { bookingId: active.bookingId } : {}),
          ...(active.contact ? { contact: active.contact } : {}),
          ...(active.phone ? { phone: active.phone } : {}),
          ...(active.email ? { email: active.email } : {}),
          ...(active.invoice ? { invoice: active.invoice } : {}),
        },
        next,
        templates,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-heading text-forest">PM och förbeställningar</h1>
          <p className="mt-1 text-caption text-muted-foreground">
            {docs.length} PM · {templates.length} mallar · skrivs ut och betalas på plats.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {active && tab === "pm" && (
            <button
              type="button"
              onClick={() => {
                setMode("utskrift");
                toast("Skickar PM till skrivaren", { description: active.title });
                window.print();
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-forest"
            >
              <Printer className="h-4 w-4" /> Skriv ut
            </button>
          )}
          <button
            type="button"
            onClick={createBlank}
            className="inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-sm text-primary-foreground transition-opacity hover:opacity-90"
          >
            <FilePlus2 className="h-4 w-4" /> Nytt PM
          </button>
        </div>
      </div>

      <div data-print-hide className="flex w-fit items-center gap-1 rounded-full border border-border bg-card p-1">
        {(
          [
            { id: "pm", label: "PM" },
            { id: "mallar", label: "Mallar" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              tab === t.id ? "bg-forest text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "mallar" ? (
        <TemplateManager templates={templates} onAdd={addTemplate} onRemove={removeTemplate} />
      ) : (
        <>
          {/* Widget: stora sällskap kommer in automatiskt */}
          <section data-print-hide className="rounded-2xl border border-border bg-card p-5">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h2 className="inline-flex items-center gap-2 text-base font-medium text-forest">
                  <Users className="h-4 w-4 shrink-0 text-primary" /> Stora sällskap
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Alla bokningar över 8 personer hamnar här automatiskt och hanteras av Seytro AI.
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                <Sparkles className="h-3.5 w-3.5" /> {largeParties.length} sällskap
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {largeParties.map((b) => {
                const doc = docs.find((d) => d.bookingId === b.id);
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => openOrCreate(b)}
                    className="rounded-xl border border-border p-4 text-left transition-colors hover:border-primary/60"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="truncate text-sm font-medium text-forest">{b.name}</p>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] ${
                          doc
                            ? "bg-status-free text-status-free-fg"
                            : "bg-status-clean text-status-clean-fg"
                        }`}
                      >
                        {doc ? "PM klart" : "AI förbereder"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {b.time} · {b.party} gäster · {b.source}
                    </p>
                    {b.note && (
                      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{b.note}</p>
                    )}
                    <p className="mt-3 inline-flex items-center gap-1 text-xs text-primary">
                      {doc ? "Öppna PM" : "Skapa PM"} <ChevronRight className="h-3 w-3" />
                    </p>
                  </button>
                );
              })}
              {largeParties.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Inga sällskap över 8 personer just nu.
                </p>
              )}
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
            <section data-print-hide className="h-fit rounded-2xl border border-border bg-card">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
                <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-forest">
                  <ClipboardList className="h-4 w-4 text-primary" /> Alla PM
                </h2>
                <div className="flex items-center gap-1 rounded-full bg-muted p-0.5">
                  {(["kommande", "alla"] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFilter(f)}
                      className={`rounded-full px-2.5 py-1 text-[11px] capitalize transition-colors ${
                        filter === f ? "bg-background text-forest" : "text-muted-foreground"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-4 py-3">
                <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-2">
                  <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Sök PM"
                    className="w-full bg-transparent text-sm text-forest outline-none"
                  />
                </div>
              </div>

              <ul className="divide-y divide-border/60 border-t border-border">
                {visible.map((d) => {
                  const b = bookingOf(d);
                  return (
                    <li key={d.id}>
                      <button
                        type="button"
                        onClick={() => setSelected(d.id)}
                        className={`w-full px-4 py-3 text-left transition-colors ${
                          selected === d.id ? "bg-primary/8" : "hover:bg-muted/50"
                        }`}
                      >
                        <p className="truncate text-sm font-medium text-forest">{d.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {d.date} · {d.time} · {d.party} pers · {kr(pmTotal(d))}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="rounded-full bg-muted px-2 py-0.5">{d.status}</span>
                          {b && (
                            <span className={`rounded-full px-2 py-0.5 ${statusStyles[b.status]}`}>
                              {b.table ? `${unitWord} ${b.table}` : "Ej placerad"}
                            </span>
                          )}
                        </div>
                      </button>
                    </li>
                  );
                })}
                {visible.length === 0 && (
                  <li className="px-4 py-6 text-xs text-muted-foreground">
                    Inga PM matchar sökningen.
                  </li>
                )}
              </ul>
            </section>

            <div className="rounded-2xl border border-border bg-card p-6">
              {active ? (
                <div className="space-y-5">
                  <div
                    data-print-hide
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <input
                        value={active.title}
                        onChange={(e) => updateDoc({ ...active, title: e.target.value })}
                        className="w-full truncate bg-transparent text-subheading text-forest outline-none"
                      />
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <input
                          type="time"
                          value={active.time}
                          onChange={(e) => updateDoc({ ...active, time: e.target.value })}
                          className="rounded-md border border-border bg-background px-2 py-1 outline-none"
                        />
                        <span className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1">
                          <Users className="h-3 w-3" />
                          <input
                            type="number"
                            min={1}
                            value={active.party}
                            onChange={(e) =>
                              updateDoc({
                                ...active,
                                party: Math.max(1, Number(e.target.value || 1)),
                              })
                            }
                            className="w-12 bg-transparent tabular-nums outline-none"
                          />
                          gäster
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1">
                          <Wallet className="h-3 w-3 text-primary" /> Betalas på plats
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-card p-1">
                      {(
                        [
                          { id: "bygg", label: "Bygg" },
                          { id: "utskrift", label: "Utskrift" },
                        ] as const
                      ).map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setMode(m.id)}
                          className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                            mode === m.id
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {mode === "bygg" ? (
                    <PmComposer
                      party={active.party}
                      templates={templates}
                      value={activeChoice}
                      onChange={applyChoice}
                    />
                  ) : (
                    <PmSheet doc={active} onChange={updateDoc} templates={templates} />
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Välj ett PM i listan eller skapa ett nytt.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
