import { useEffect, useMemo, useRef, useState } from "react";
import { MessageSquare, Send, Sparkle, X, Check, StickyNote } from "lucide-react";
import { toast } from "sonner";

import {
  nowTime,
  readThreads,
  suggestReply,
  unreadCount,
  writeThreads,
  type ChatEntry,
  type ChatThread,
} from "@/lib/guest-chat";

/* ------------------------------------------------------------------ store */

export function useGuestChat() {
  const [threads, setThreads] = useState<ChatThread[]>([]);

  useEffect(() => {
    setThreads(readThreads());
  }, []);

  const update = (next: ChatThread[]) => {
    setThreads(next);
    writeThreads(next);
  };

  const patch = (id: string, fn: (t: ChatThread) => ChatThread) =>
    update(threads.map((t) => (t.id === id ? fn(t) : t)));

  return { threads, update, patch, unread: unreadCount(threads) };
}

/* ------------------------------------------------------------------- view */

function Bubble({ entry }: { entry: ChatEntry }) {
  if (entry.author === "system") {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
        <span className="font-medium text-forest">{entry.event ?? "Händelse"}</span>
        <span className="truncate">{entry.text}</span>
        <span className="ml-auto tabular-nums">{entry.time}</span>
      </div>
    );
  }
  const isGuest = entry.author === "gäst";
  return (
    <div className={`flex flex-col ${isGuest ? "items-start" : "items-end"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isGuest
            ? "bg-primary text-primary-foreground"
            : entry.author === "ai"
              ? "border border-accent-edge bg-accent-tint text-forest"
              : "border border-border bg-card text-forest"
        }`}
      >
        {entry.text}
      </div>
      <span className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        {entry.author === "ai" && <Sparkle className="h-3 w-3 text-primary" />}
        {entry.author === "ai" ? "Seytro AI" : isGuest ? "Gäst" : "Personal"} · {entry.time}
      </span>
    </div>
  );
}

export function GuestChatView({
  threads,
  patch,
  compact = false,
}: {
  threads: ChatThread[];
  patch: (id: string, fn: (t: ChatThread) => ChatThread) => void;
  compact?: boolean;
}) {
  const [activeId, setActiveId] = useState<string>("");
  const [filter, setFilter] = useState<"alla" | "obesvarade">("alla");
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const list = threads.filter((t) => (filter === "alla" ? true : t.status === "obesvarad"));
  const active = threads.find((t) => t.id === activeId) ?? list[0] ?? threads[0];
  const suggestion = useMemo(() => (active ? suggestReply(active) : null), [active]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [active?.entries.length, active?.id]);

  const send = (text: string, author: "personal" | "ai") => {
    if (!active || !text.trim()) return;
    const extra: ChatEntry[] = [];
    if (author === "ai" && suggestion?.event) {
      extra.push({
        id: `s${Date.now()}`,
        author: "system",
        text: suggestion.note ?? "",
        time: nowTime(),
        event: suggestion.event,
      });
    }
    patch(active.id, (t) => ({
      ...t,
      status: "aktiv",
      updated: "nyss",
      notes:
        author === "ai" && suggestion?.note && !t.notes.includes(suggestion.note)
          ? [...t.notes, suggestion.note]
          : t.notes,
      entries: [
        ...t.entries,
        { id: `m${Date.now()}`, author, text: text.trim(), time: nowTime() },
        ...extra,
      ],
    }));
    setDraft("");
    toast.success(author === "ai" ? "AI-svar skickat" : "Svar skickat", {
      description: active.guest,
    });
  };

  return (
    <div
      className={
        compact
          ? "flex h-full min-h-0 flex-col"
          : "grid min-h-0 gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]"
      }
    >
      {/* Konversationer */}
      <div
        className={`flex min-h-0 flex-col rounded-2xl border border-border bg-card ${
          compact ? "max-h-52 shrink-0" : ""
        }`}
      >
        <div className="flex gap-1 border-b border-border p-3">
          {(["alla", "obesvarade"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 text-xs capitalize transition-colors ${
                filter === f ? "bg-forest text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {f}
              {f === "obesvarade" && (
                <span className="ml-1.5">{threads.filter((t) => t.status === "obesvarad").length}</span>
              )}
            </button>
          ))}
        </div>
        <ul className="min-h-0 flex-1 overflow-y-auto">
          {list.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => setActiveId(t.id)}
                className={`w-full border-b border-border/60 px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
                  active?.id === t.id ? "bg-muted/60" : ""
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium text-forest">{t.guest}</span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{t.updated}</span>
                </span>
                <span className="mt-0.5 block text-[11px] text-muted-foreground">
                  {t.party} pers · {t.date} {t.time} · {t.channel}
                </span>
                <span className="mt-1 block truncate text-xs text-muted-foreground">
                  {t.entries[t.entries.length - 1]?.text}
                </span>
                <span
                  className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[11px] ${
                    t.status === "obesvarad"
                      ? "bg-status-wait text-status-wait-fg"
                      : "bg-status-set text-status-set-fg"
                  }`}
                >
                  {t.status === "obesvarad" ? "Obesvarad" : t.aiAuto ? "AI svarar" : "Aktiv"}
                </span>
              </button>
            </li>
          ))}
          {list.length === 0 && (
            <li className="p-6 text-center text-sm text-muted-foreground">Inga konversationer.</li>
          )}
        </ul>
      </div>

      {/* Tråd */}
      {active && (
        <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-forest">
                {active.guest} <span className="text-muted-foreground">({active.ref})</span>
              </p>
              <p className="text-[11px] text-muted-foreground">
                {active.party} pers · {active.date} · {active.time}
              </p>
            </div>
            <label className="flex cursor-pointer items-center gap-2 rounded-full border border-border-hairline bg-background px-3 py-1.5 text-xs text-forest">
              <input
                type="checkbox"
                checked={active.aiAuto}
                onChange={(e) => patch(active.id, (t) => ({ ...t, aiAuto: e.target.checked }))}
                className="accent-[hsl(var(--primary))]"
              />
              <Sparkle className="h-3.5 w-3.5 text-primary" />
              AI svarar automatiskt
            </label>
          </div>

          {active.notes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 border-b border-border/60 px-5 py-2.5">
              {active.notes.map((n) => (
                <span
                  key={n}
                  className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11px] text-forest"
                >
                  <StickyNote className="h-3 w-3 text-primary" />
                  {n}
                </span>
              ))}
            </div>
          )}

          <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-5">
            {active.entries.map((e) => (
              <Bubble key={e.id} entry={e} />
            ))}
          </div>

          {suggestion && (
            <div className="mx-5 mb-3 rounded-xl border border-accent-edge bg-accent-tint/60 p-3">
              <p className="flex items-center gap-1.5 text-[11px] font-medium text-primary">
                <Sparkle className="h-3 w-3" /> AI-förslag · {suggestion.intent}
              </p>
              <p className="mt-1.5 text-sm text-forest">{suggestion.reply}</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => send(suggestion.reply, "ai")}
                  className="inline-flex items-center gap-1.5 rounded-full bg-forest px-3.5 py-1.5 text-xs text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Check className="h-3.5 w-3.5" /> Skicka
                </button>
                <button
                  type="button"
                  onClick={() => setDraft(suggestion.reply)}
                  className="rounded-full border border-border bg-background px-3.5 py-1.5 text-xs text-forest transition-colors hover:bg-muted"
                >
                  Redigera
                </button>
                {suggestion.note && (
                  <button
                    type="button"
                    onClick={() => {
                      patch(active.id, (t) => ({
                        ...t,
                        notes: t.notes.includes(suggestion.note!)
                          ? t.notes
                          : [...t.notes, suggestion.note!],
                        entries: [
                          ...t.entries,
                          {
                            id: `n${Date.now()}`,
                            author: "system",
                            text: suggestion.note!,
                            time: nowTime(),
                            event: "Notering i bokning",
                          },
                        ],
                      }));
                      toast("Noterat i bokningen", { description: suggestion.note });
                    }}
                    className="rounded-full border border-border bg-background px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted"
                  >
                    Notera i bokning
                  </button>
                )}
              </div>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(draft, "personal");
            }}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Skriv till gästen…"
              className="min-w-0 flex-1 rounded-full border border-border-hairline bg-background px-4 py-2.5 text-sm text-forest outline-none transition-shadow focus:border-primary/40 focus:shadow-soft"
            />
            <button
              type="submit"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform hover:-translate-y-px"
              aria-label="Skicka"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------- slide-over */

export function GuestChatButton() {
  const [open, setOpen] = useState(false);
  const { threads, patch, unread } = useGuestChat();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative grid h-9 w-9 place-items-center rounded-full border border-border-hairline bg-background text-muted-foreground shadow-soft transition-colors hover:text-forest"
        aria-label="Gästchatt"
      >
        <MessageSquare className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Stäng"
            onClick={() => setOpen(false)}
            className="flex-1 bg-forest-deep/25 backdrop-blur-[2px]"
          />
          <aside className="flex h-full w-full max-w-[30rem] flex-col gap-3 border-l border-border bg-surface-1 p-4 shadow-raised duration-300 animate-in slide-in-from-right">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-forest">Gästchatt</p>
                <p className="text-[11px] text-muted-foreground">
                  Direktmeddelanden kopplade till bokningarna
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted"
                aria-label="Stäng chatt"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <GuestChatView threads={threads} patch={patch} compact />
          </aside>
        </div>
      )}
    </>
  );
}
