import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowDownLeft, ArrowUpRight, Bot, PhoneMissed, PhoneOutgoing } from "lucide-react";

import { useVenue } from "@/components/dashboard/DashboardShell";
import { opsData } from "@/lib/ops-data";

export const Route = createFileRoute("/dashboard/samtal")({
  head: () => ({
    meta: [
      { title: "Samtal — Seytro Dashboard" },
      { name: "description", content: "Inspelade samtal med AI-sammanfattning och transkription." },
      { property: "og:title", content: "Samtal — Seytro Dashboard" },
      { property: "og:description", content: "Inspelade samtal med AI-sammanfattning och transkription." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CallsPage,
});

const dirIcon = {
  inkommande: ArrowDownLeft,
  utgående: ArrowUpRight,
  missat: PhoneMissed,
} as const;

function CallsPage() {
  const { venue } = useVenue();
  const calls = opsData[venue].calls;
  const [filter, setFilter] = useState<"alla" | "inkommande" | "missat">("alla");
  const [activeId, setActiveId] = useState(calls[0]?.id ?? "");
  const list = calls.filter((c) => (filter === "alla" ? true : c.direction === filter));
  const active = calls.find((c) => c.id === activeId) ?? list[0] ?? calls[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display text-forest">Samtal</h1>
          <p className="text-body text-muted-foreground">
            {calls.filter((c) => c.direction !== "missat").length} besvarade av röstagenten idag.
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-soft">
          {(["alla", "inkommande", "missat"] as const).map((f) => (
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
      </div>

      <div className="grid gap-4 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <div className="rounded-2xl border border-border bg-card">
          {list.map((c) => {
            const Icon = dirIcon[c.direction];
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveId(c.id)}
                className={`block w-full border-b border-border/60 px-4 py-3 text-left last:border-0 transition-colors hover:bg-muted/60 ${
                  active?.id === c.id ? "bg-muted/70" : ""
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-2">
                    <Icon
                      className={`h-3.5 w-3.5 shrink-0 ${
                        c.direction === "missat" ? "text-status-alert-fg" : "text-muted-foreground"
                      }`}
                    />
                    <span className="truncate text-sm text-forest">{c.guest ?? c.from}</span>
                  </span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{c.time}</span>
                </span>
                <span className="mt-1 block truncate text-xs text-muted-foreground">
                  {c.intent} · {c.duration}
                </span>
              </button>
            );
          })}
          {list.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">Inga samtal här.</p>
          )}
        </div>

        {active && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg text-forest">{active.guest ?? active.from}</h2>
                  <p className="text-sm text-muted-foreground">
                    {active.from} · {active.direction} · {active.duration} · {active.time}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    toast.success("Ringer upp", { description: active.from })
                  }
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <PhoneOutgoing className="h-3.5 w-3.5" /> Ring tillbaka
                </button>
              </div>

              <div className="mt-4 rounded-xl border border-status-set-border bg-status-set p-4">
                <p className="mb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-status-set-fg">
                  <Bot className="h-3 w-3" /> AI-sammanfattning
                </p>
                <p className="text-sm leading-relaxed text-forest">{active.summary}</p>
                <p className="mt-2 text-xs text-muted-foreground">Resultat: {active.outcome}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="eyebrow mb-3 text-muted-foreground">Transkription</p>
              {active.transcript.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Samtalet besvarades aldrig — ingen transkription finns.
                </p>
              ) : (
                <div className="space-y-3">
                  {active.transcript.map((t, i) => (
                    <div key={i} className="flex gap-3">
                      <span
                        className={`mt-0.5 h-fit shrink-0 rounded-full px-2 py-0.5 text-[10px] ${
                          t.role === "AI"
                            ? "border border-status-set-border bg-status-set text-status-set-fg"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {t.role}
                      </span>
                      <p className="text-sm leading-relaxed text-forest">{t.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
