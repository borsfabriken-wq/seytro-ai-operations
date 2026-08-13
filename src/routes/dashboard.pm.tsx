import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, ClipboardList, FilePlus2, Users } from "lucide-react";
import { useVenue } from "@/components/dashboard/DashboardShell";
import { PmSheet } from "@/components/dashboard/PmSheet";
import { statusStyles, type Booking } from "@/lib/dashboard-data";
import { kr, pmDocs as seedDocs, pmTotal, uid, type PmDoc } from "@/lib/pm";

export const Route = createFileRoute("/dashboard/pm")({
  head: () => ({
    meta: [
      { title: "PM och förbeställningar — Seytro Dashboard" },
      {
        name: "description",
        content:
          "Förbeställda sällskap och event med fasta menyer, dryck, kassaunderlag och fakturauppgifter.",
      },
      { property: "og:title", content: "PM och förbeställningar — Seytro Dashboard" },
      {
        property: "og:description",
        content: "Förbeställda sällskap och event med fasta menyer och fakturaunderlag.",
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

  const bookingOf = (doc: PmDoc) =>
    data.bookings.find((b) => b.id === doc.bookingId) ?? null;

  /** Stora sällskap som saknar PM — här börjar förberedelsen. */
  const missing = useMemo(
    () =>
      data.bookings.filter(
        (b) => b.status !== "avbokad" && b.party >= 8 && !b.pmId,
      ),
    [data.bookings],
  );

  const active = docs.find((d) => d.id === selected) ?? null;

  const createFor = (b: Booking) => {
    const doc: PmDoc = {
      id: uid("pm"),
      bookingId: b.id,
      title: `${b.name} — sällskap ${b.party} personer`,
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

  const updateDoc = (next: PmDoc) =>
    setDocs((prev) => prev.map((d) => (d.id === next.id ? next : d)));

  return (
    <div className="mx-auto max-w-[86rem] space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5">
        <h1 className="text-heading text-forest">PM och förbeställningar</h1>
        <p className="text-caption text-muted-foreground">
          Sällskap och event med fasta menyer som köket ska ha koll på — {docs.length} aktiva PM ·{" "}
          {missing.length} sällskap utan PM.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[20rem_1fr]">
        <div className="space-y-4">
          <section className="rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <ClipboardList className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-forest">Aktiva PM</h2>
            </div>
            <ul className="divide-y divide-border/60">
              {docs.map((d) => {
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
                      <p className="text-sm font-medium text-forest">{d.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {d.date} · {d.time} · {d.party} pers · {kr(pmTotal(d))}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="rounded-full bg-muted px-2 py-0.5">{d.status}</span>
                        {b && (
                          <span
                            className={`rounded-full px-2 py-0.5 ${statusStyles[b.status]}`}
                          >
                            {b.table ? `${unitWord} ${b.table}` : "Ej placerad"}
                          </span>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <CalendarDays className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-forest">Sällskap utan PM</h2>
            </div>
            {missing.length === 0 ? (
              <p className="px-4 py-5 text-xs text-muted-foreground">
                Alla stora sällskap har ett PM.
              </p>
            ) : (
              <ul className="divide-y divide-border/60">
                {missing.map((b) => (
                  <li
                    key={b.id}
                    className="flex items-center justify-between gap-2 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm text-forest">{b.name}</p>
                      <p className="text-xs text-muted-foreground">
                        <Users className="mr-1 inline h-3 w-3" />
                        {b.party} gäster · {b.time}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => createFor(b)}
                      className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:border-primary hover:text-primary"
                    >
                      <FilePlus2 className="h-3.5 w-3.5" /> Skapa PM
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          {active ? (
            <PmSheet doc={active} onChange={updateDoc} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Välj ett PM i listan eller skapa ett nytt från ett sällskap.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
