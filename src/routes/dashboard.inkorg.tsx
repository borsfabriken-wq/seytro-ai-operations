import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useVenue } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/dashboard/inkorg")({
  head: () => ({
    meta: [
      { title: "Inkorg — Seytro Dashboard" },
      { name: "description", content: "Samtal, mejl och SMS hanterade av Seytros AI-agenter." },
      { property: "og:title", content: "Inkorg — Seytro Dashboard" },
      { property: "og:description", content: "Samtal, mejl och SMS hanterade av Seytros AI-agenter." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: InboxPage,
});

function InboxPage() {
  const { data } = useVenue();
  const [activeId, setActiveId] = useState(data.messages[0]?.id ?? "");
  const [tab, setTab] = useState<"alla" | "väntar">("alla");
  const list = data.messages.filter((m) => (tab === "alla" ? true : !m.handled));
  const active = data.messages.find((m) => m.id === activeId) ?? list[0] ?? data.messages[0];

  return (
    <div className="mx-auto max-w-[96rem] space-y-6">
      <div>
        <h1 className="text-display text-forest">Inkorg</h1>
        <p className="text-body text-muted-foreground">
          {data.messages.filter((m) => m.handled).length} av {data.messages.length} hanterade
          automatiskt.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[24rem_minmax(0,1fr)]">
        <div className="rounded-2xl border border-border bg-card">
          <div className="flex gap-1 border-b border-border p-3">
            {(["alla", "väntar"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`rounded-full px-3 py-1.5 text-xs capitalize ${
                  tab === t ? "bg-forest text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <ul>
            {list.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(m.id)}
                  className={`w-full border-b border-border/60 p-4 text-left transition-colors hover:bg-muted/50 ${
                    active?.id === m.id ? "bg-muted/60" : ""
                  }`}
                >
                  <span className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{m.channel}</span>
                    <span>{m.time}</span>
                  </span>
                  <span className="mt-1 block text-sm text-forest">{m.from}</span>
                  <span className="mt-1 block truncate text-xs text-muted-foreground">
                    {m.preview}
                  </span>
                  <span
                    className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[11px] ${
                      m.handled ? "bg-primary/10 text-primary" : "bg-amber-500/15 text-amber-700"
                    }`}
                  >
                    {m.handled ? "Hanterat" : "Väntar"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {active && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="eyebrow text-muted-foreground">
              {active.channel} · {active.intent}
            </p>
            <h2 className="mt-2 text-heading text-forest">{active.from}</h2>
            <p className="mt-4 rounded-xl bg-muted/50 p-4 text-body text-forest">{active.preview}</p>
            <p className="mt-5 text-caption text-muted-foreground">Seytros förslag på svar</p>
            <div className="mt-2 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-forest">
              Tack för ert meddelande! Vi har noterat önskemålet och återkommer med bekräftelse inom
              kort. Vill ni ändra något mer inför besöket hjälper vi gärna till.
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button className="rounded-full bg-forest px-5 py-2 text-sm text-primary-foreground">
                Skicka svar
              </button>
              <button className="rounded-full border border-border px-5 py-2 text-sm text-forest">
                Redigera
              </button>
              <button className="rounded-full border border-border px-5 py-2 text-sm text-muted-foreground">
                Markera som klar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
