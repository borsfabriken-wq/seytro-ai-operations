import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, ClipboardList, FilePlus2, Search, Sparkles, Users } from "lucide-react";
import { useVenue } from "@/components/dashboard/DashboardShell";
import { PmSheet } from "@/components/dashboard/PmSheet";
import { statusStyles } from "@/lib/dashboard-data";
import { kr, pmDocs as seedDocs, pmTotal, uid, type PmDoc } from "@/lib/pm";

export const Route = createFileRoute("/dashboard/pm")({
  head: () => ({
    meta: [
      { title: "PM och förbeställningar — Seytro Dashboard" },
      {
        name: "description",
        content:
          "Förbeställningar med fasta menyer, dryck, kassaunderlag och fakturauppgifter samlade på ett ställe.",
      },
      { property: "og:title", content: "PM och förbeställningar — Seytro Dashboard" },
      {
        property: "og:description",
        content: "Förbeställningar med fasta menyer och fakturaunderlag.",
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

  const [docs, setDocs] = useState<PmDoc[]>(seedDocs);
  const [selected, setSelected] = useState<string>(seedDocs[0]?.id ?? "");
  const [query, setQuery] = useState("");

  const bookingOf = (doc: PmDoc) => data.bookings.find((b) => b.id === doc.bookingId) ?? null;

  const visible = docs.filter((d) =>
    query ? d.title.toLowerCase().includes(query.toLowerCase()) : true,
  );
  const active = docs.find((d) => d.id === selected) ?? null;

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
    setDocs((prev) => [doc, ...prev]);
    setSelected(doc.id);
  };

  const updateDoc = (next: PmDoc) =>
    setDocs((prev) => prev.map((d) => (d.id === next.id ? next : d)));

  /** Alla sällskap över 8 personer landar här automatiskt när gästen bokar. */
  const largeParties = data.bookings
    .filter((b) => b.status !== "avbokad" && b.party >= 8)
    .sort((a, b) => a.time.localeCompare(b.time));

  const openOrCreate = (b: (typeof largeParties)[number]) => {
    const existing = docs.find((d) => d.bookingId === b.id);
    if (existing) {
      setSelected(existing.id);
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
    setDocs((prev) => [doc, ...prev]);
    setSelected(doc.id);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-heading text-forest">PM och förbeställningar</h1>
          <p className="mt-1 text-caption text-muted-foreground">
            {docs.length} aktiva PM · allt annat sköts automatiskt av Seytro.
          </p>
        </div>
        <button
          type="button"
          onClick={createBlank}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-forest px-4 py-2 text-sm text-primary-foreground transition-opacity hover:opacity-90"
        >
          <FilePlus2 className="h-4 w-4" /> Nytt PM
        </button>
      </div>

      {/* Widget: stora sällskap kommer in automatiskt */}
      <section className="rounded-2xl border border-border bg-card p-5">
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
                        ? "bg-emerald-500/15 text-emerald-700"
                        : "bg-amber-500/15 text-amber-700"
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
            <p className="text-xs text-muted-foreground">Inga sällskap över 8 personer just nu.</p>
          )}
        </div>
      </section>


      <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <section className="h-fit rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <ClipboardList className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-forest">Aktiva PM</h2>
          </div>

          <div className="px-4 py-3">
            <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-2">
              <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Sök PM"
                className="w-full bg-transparent text-sm text-forest outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <ul className="divide-y divide-border/60">
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
              <li className="px-4 py-6 text-xs text-muted-foreground">Inga PM matchar sökningen.</li>
            )}
          </ul>
        </section>

        <div className="rounded-2xl border border-border bg-card p-6">
          {active ? (
            <PmSheet doc={active} onChange={updateDoc} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Välj ett PM i listan eller skapa ett nytt.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
