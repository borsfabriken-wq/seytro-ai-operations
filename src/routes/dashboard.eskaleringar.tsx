import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { CheckCircle2, Plus, ShieldAlert } from "lucide-react";

import { useVenue } from "@/components/dashboard/DashboardShell";
import { opsData, type Escalation } from "@/lib/ops-data";

export const Route = createFileRoute("/dashboard/eskaleringar")({
  head: () => ({
    meta: [
      { title: "Eskaleringar — Seytro Dashboard" },
      { name: "description", content: "Ärenden som AI lämnar över till personalen." },
      { property: "og:title", content: "Eskaleringar — Seytro Dashboard" },
      { property: "og:description", content: "Ärenden som AI lämnar över till personalen." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EscalationsPage,
});

const priorityStyles: Record<Escalation["priority"], string> = {
  hög: "border-status-alert-border bg-status-alert text-status-alert-fg",
  medel: "border-status-clean-border bg-status-clean text-status-clean-fg",
  låg: "border-status-done-border bg-status-done text-status-done-fg",
};

const filters = ["kräver åtgärd", "pågår", "löst", "alla"] as const;

function EscalationsPage() {
  const { venue } = useVenue();
  const [items, setItems] = useState<Escalation[]>(() => opsData[venue].escalations);
  const [filter, setFilter] = useState<(typeof filters)[number]>("kräver åtgärd");
  const [query, setQuery] = useState("");

  const list = items.filter(
    (e) =>
      (filter === "alla" || e.status === filter) &&
      (e.title + e.guest + e.reason).toLowerCase().includes(query.toLowerCase()),
  );

  const resolve = (id: string) => {
    setItems((prev) => prev.map((e) => (e.id === id ? { ...e, status: "löst" } : e)));
    toast.success("Ärendet markerat som löst");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display text-forest">Eskaleringar</h1>
          <p className="text-body text-muted-foreground">
            Allt AI inte kan lösa själv — klagomål, återuppringningar och specialönskemål.
          </p>
        </div>
        <button
          type="button"
          onClick={() => toast("Logga något", { description: "Manuellt ärende skapas här." })}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" /> Logga något
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
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
          placeholder="Sök ärende eller gäst"
          className="w-56 rounded-full border border-border bg-card px-4 py-2 text-sm outline-none focus:border-primary"
        />
      </div>

      {list.length === 0 ? (
        <div className="grid place-items-center gap-2 rounded-2xl border border-border bg-card py-20 text-center">
          <CheckCircle2 className="h-8 w-8 text-status-free-fg" />
          <p className="text-lg text-forest">Inget kräver dig</p>
          <p className="text-sm text-muted-foreground">
            AI har hanterat alla klagomål och återuppringningar.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((e) => (
            <article
              key={e.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-soft"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-forest">
                    <ShieldAlert className="h-4 w-4 shrink-0 text-muted-foreground" />
                    {e.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {e.guest} · {e.channel} · {e.created}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] ${priorityStyles[e.priority]}`}
                  >
                    {e.priority} prioritet
                  </span>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground">
                    {e.status}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{e.detail}</p>
              {e.status !== "löst" && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => resolve(e.id)}
                    className="rounded-full bg-primary px-4 py-1.5 text-sm text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Markera som löst
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      toast("AI-förslag", {
                        description:
                          "Erbjud en välkomstdrink vid nästa besök och be köksmästaren höra av sig personligen.",
                      })
                    }
                    className="rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:text-forest"
                  >
                    Be AI föreslå svar
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
