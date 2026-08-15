import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Bot, Mail, Send } from "lucide-react";

import { useVenue } from "@/components/dashboard/DashboardShell";
import { opsData, type AiMode } from "@/lib/ops-data";

export const Route = createFileRoute("/dashboard/epost")({
  head: () => ({
    meta: [
      { title: "E-post — Seytro Dashboard" },
      { name: "description", content: "Gästmejl besvarade av Seytros e-postconcierge." },
      { property: "og:title", content: "E-post — Seytro Dashboard" },
      { property: "og:description", content: "Gästmejl besvarade av Seytros e-postconcierge." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EmailPage,
});

const aiModes: { id: AiMode; label: string; hint: string }[] = [
  { id: "auto", label: "Auto", hint: "AI svarar direkt på allt den klarar" },
  { id: "utkast", label: "Utkast", hint: "AI skriver förslag som ni godkänner" },
  { id: "av", label: "Av", hint: "Alla mejl hanteras manuellt" },
];

function EmailPage() {
  const { venue } = useVenue();
  const threads = opsData[venue].emails;
  const [mode, setMode] = useState<AiMode>("auto");
  const [filter, setFilter] = useState<"alla" | "olästa" | "gäster">("alla");
  const [activeId, setActiveId] = useState(threads[0]?.id ?? "");
  const [reply, setReply] = useState("");
  const [sent, setSent] = useState<string[]>([]);

  const list = useMemo(
    () =>
      threads.filter((t) =>
        filter === "olästa" ? t.unread : filter === "gäster" ? !t.aiHandled : true,
      ),
    [threads, filter],
  );
  const active = threads.find((t) => t.id === activeId) ?? list[0] ?? threads[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display text-forest">E-post</h1>
          <p className="text-body text-muted-foreground">
            {threads.filter((t) => t.aiHandled).length} av {threads.length} trådar hanteras av AI.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">AI-hantering</span>
          <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-soft">
            {aiModes.map((m) => (
              <button
                key={m.id}
                type="button"
                title={m.hint}
                onClick={() => setMode(m.id)}
                className={`rounded-full px-3 py-1 text-sm transition-colors ${
                  mode === m.id ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <div className="rounded-2xl border border-border bg-card">
          <div className="flex gap-1 border-b border-border p-3">
            {(["alla", "olästa", "gäster"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-full px-3 py-1.5 text-xs capitalize transition-colors ${
                  filter === f ? "bg-accent text-forest" : "text-muted-foreground"
                }`}
              >
                {f === "gäster" ? "Från gäster" : f}
              </button>
            ))}
          </div>
          <div className="max-h-[36rem] overflow-y-auto">
            {list.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveId(t.id)}
                className={`block w-full border-b border-border/60 px-4 py-3 text-left last:border-0 transition-colors hover:bg-muted/60 ${
                  active?.id === t.id ? "bg-muted/70" : ""
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm text-forest">{t.guest}</span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{t.time}</span>
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                  {t.subject}
                </span>
                <span className="mt-1.5 flex items-center gap-1.5">
                  {t.aiHandled && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-status-set-border bg-status-set px-2 py-0.5 text-[10px] text-status-set-fg">
                      <Bot className="h-3 w-3" /> AI hanterad
                    </span>
                  )}
                  {t.unread && (
                    <span className="rounded-full border border-status-alert-border bg-status-alert px-2 py-0.5 text-[10px] text-status-alert-fg">
                      Oläst
                    </span>
                  )}
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                    {t.intent}
                  </span>
                </span>
              </button>
            ))}
            {list.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">Inga trådar här.</p>
            )}
          </div>
        </div>

        {active ? (
          <div className="flex flex-col rounded-2xl border border-border bg-card">
            <div className="flex items-start justify-between gap-4 border-b border-border p-5">
              <div>
                <h2 className="text-lg text-forest">{active.subject}</h2>
                <p className="text-sm text-muted-foreground">
                  {active.guest} · {active.address}
                </p>
              </div>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {active.messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[46rem] rounded-2xl border p-4 text-sm ${
                    m.outgoing
                      ? "ml-auto border-accent-edge bg-accent/60"
                      : "border-border bg-background"
                  }`}
                >
                  <p className="mb-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                    {m.ai && <Bot className="h-3 w-3" />}
                    {m.from} · {m.time}
                  </p>
                  <p className="leading-relaxed text-forest">{m.body}</p>
                </div>
              ))}
              {sent.includes(active.id) && (
                <div className="ml-auto max-w-[46rem] rounded-2xl border border-accent-edge bg-accent/60 p-4 text-sm">
                  <p className="mb-1.5 text-[11px] text-muted-foreground">Du · nyss</p>
                  <p className="leading-relaxed text-forest">{reply}</p>
                </div>
              )}
            </div>

            <div className="border-t border-border p-4">
              {mode !== "av" && (
                <button
                  type="button"
                  onClick={() =>
                    setReply(
                      "Hej! Tack för ditt meddelande — vi har noterat önskemålet och bekräftar inom kort.",
                    )
                  }
                  className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-forest"
                >
                  <Bot className="h-3 w-3" /> Hämta AI-förslag
                </button>
              )}
              <div className="flex items-end gap-2">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={3}
                  placeholder="Skriv ett svar…"
                  className="min-h-[4.5rem] flex-1 resize-y rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!reply.trim()) return;
                    setSent((s) => [...s, active.id]);
                    toast.success("Svar skickat", { description: active.address });
                  }}
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Send className="h-3.5 w-3.5" /> Skicka
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid place-items-center rounded-2xl border border-border bg-card p-16 text-sm text-muted-foreground">
            Inkorgen är tom.
          </div>
        )}
      </div>
    </div>
  );
}
