import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Bot, Plus } from "lucide-react";

import { useVenue } from "@/components/dashboard/DashboardShell";
import { opsData, type WaitlistEntry } from "@/lib/ops-data";
import { matchWaitlist } from "@/lib/booking-ai";

export const Route = createFileRoute("/dashboard/vantelista")({
  head: () => ({
    meta: [
      { title: "Väntelista — Seytro Dashboard" },
      { name: "description", content: "Väntande gäster matchas automatiskt mot lediga bord." },
      { property: "og:title", content: "Väntelista — Seytro Dashboard" },
      { property: "og:description", content: "Väntande gäster matchas automatiskt mot lediga bord." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WaitlistPage,
});

const filters = ["öppna", "väntar", "erbjuden", "omvandlad", "avbokad"] as const;

const statusStyle: Record<WaitlistEntry["status"], string> = {
  väntar: "border-status-clean-border bg-status-clean text-status-clean-fg",
  erbjuden: "border-status-set-border bg-status-set text-status-set-fg",
  omvandlad: "border-status-free-border bg-status-free text-status-free-fg",
  avbokad: "border-status-done-border bg-status-done text-status-done-fg",
};

function WaitlistPage() {
  const { venue, data } = useVenue();
  const [entries, setEntries] = useState<WaitlistEntry[]>(() => opsData[venue].waitlist);
  const [filter, setFilter] = useState<(typeof filters)[number]>("öppna");
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", party: "2", wanted: "19:00" });

  const matches = useMemo(
    () => matchWaitlist(entries, data.bookings, data.units),
    [entries, data.bookings, data.units],
  );

  const list = entries.filter((e) => {
    const okStatus =
      filter === "öppna" ? e.status === "väntar" || e.status === "erbjuden" : e.status === filter;
    return okStatus && (e.name + e.phone).toLowerCase().includes(query.toLowerCase());
  });
  const waiting = entries.filter((e) => e.status === "väntar").length;

  const setStatus = (id: string, status: WaitlistEntry["status"]) =>
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display text-forest">Väntelista</h1>
          <p className="text-body text-muted-foreground">
            {waiting} väntar · röstagenten och e-postconciergen lägger själva in gäster här.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" /> Lägg till gäst
        </button>
      </div>

      {adding && (
        <div className="grid gap-3 rounded-2xl border border-border bg-card p-5 sm:grid-cols-4">
          {(
            [
              ["name", "Namn", "text"],
              ["phone", "Telefon", "tel"],
              ["party", "Antal", "number"],
              ["wanted", "Önskad tid", "text"],
            ] as const
          ).map(([key, label, type]) => (
            <label key={key} className="block text-xs text-muted-foreground">
              {label}
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-forest outline-none focus:border-primary"
              />
            </label>
          ))}
          <div className="sm:col-span-4">
            <button
              type="button"
              onClick={() => {
                if (!form.name.trim()) return;
                setEntries((prev) => [
                  {
                    id: `w${Date.now()}`,
                    name: form.name,
                    phone: form.phone,
                    party: Number(form.party) || 2,
                    wanted: form.wanted,
                    flexibility: "Flexibel",
                    created: "nyss",
                    status: "väntar",
                  },
                  ...prev,
                ]);
                setForm({ name: "", phone: "", party: "2", wanted: "19:00" });
                setAdding(false);
                toast.success("Gästen är tillagd i väntelistan");
              }}
              className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground"
            >
              Spara
            </button>
          </div>
        </div>
      )}

      {matches.length > 0 && (
        <div className="rounded-2xl border border-status-set-border bg-status-set p-5">
          <p className="mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-status-set-fg">
            <Bot className="h-3 w-3" /> AI-matchning mot lediga bord
          </p>
          <div className="space-y-2">
            {matches.map((m) => (
              <div
                key={m.entry.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-background/70 px-4 py-2.5"
              >
                <p className="text-sm text-forest">
                  {m.entry.name} · {m.entry.party} pers → bord {m.table} ({m.seats} pl) kl {m.time}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStatus(m.entry.id, "erbjuden");
                    toast.success("Erbjudande skickat", {
                      description: `${m.entry.name} har 15 minuter på sig att svara.`,
                    });
                  }}
                  className="rounded-full bg-primary px-3.5 py-1.5 text-xs text-primary-foreground"
                >
                  Skicka erbjudande
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-soft">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 text-sm capitalize transition-colors ${
                filter === f ? "bg-accent text-forest" : "text-muted-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Sök gäst"
          className="w-52 rounded-full border border-border bg-card px-4 py-1.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="rounded-2xl border border-border bg-card">
        {list.map((e) => (
          <div
            key={e.id}
            className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-5 py-4 last:border-0"
          >
            <div className="min-w-0">
              <p className="text-forest">
                {e.name}{" "}
                <span className="text-sm text-muted-foreground">· {e.party} pers</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Önskar {e.wanted} · {e.flexibility} · {e.phone} · inlagd {e.created}
              </p>
              {e.offer && (
                <p className="mt-1 text-xs text-status-set-fg">
                  Erbjudet {e.offer.time}, bord {e.offer.table} — går ut {e.offer.expires}
                </p>
              )}
              {e.note && <p className="mt-1 text-xs text-muted-foreground">{e.note}</p>}
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full border px-2.5 py-0.5 text-[11px] ${statusStyle[e.status]}`}>
                {e.status}
              </span>
              {e.status !== "omvandlad" && e.status !== "avbokad" && (
                <button
                  type="button"
                  onClick={() => {
                    setStatus(e.id, "omvandlad");
                    toast.success("Omvandlad till bokning", { description: e.name });
                  }}
                  className="rounded-full bg-primary px-3.5 py-1.5 text-xs text-primary-foreground"
                >
                  Gör till bokning
                </button>
              )}
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <p className="px-5 py-12 text-center text-sm text-muted-foreground">
            Ingen i väntelistan just nu.
          </p>
        )}
      </div>
    </div>
  );
}
