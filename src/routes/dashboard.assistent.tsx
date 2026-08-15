import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUp, Bot } from "lucide-react";

import { useVenue } from "@/components/dashboard/DashboardShell";
import { serviceOf } from "@/lib/dashboard-data";
import { assessRisk, suggestMoves, unplacedWithOptions } from "@/lib/booking-ai";

export const Route = createFileRoute("/dashboard/assistent")({
  head: () => ({
    meta: [
      { title: "Assistent — Seytro Dashboard" },
      { name: "description", content: "Fråga Seytro-assistenten om dagens drift i klartext." },
      { property: "og:title", content: "Assistent — Seytro Dashboard" },
      { property: "og:description", content: "Fråga Seytro-assistenten om dagens drift i klartext." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AssistantPage,
});

type Msg = { role: "user" | "assistant"; text: string };

function AssistantPage() {
  const { data, venue, serviceBookings, service } = useVenue();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => inputRef.current?.focus(), []);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const answer = (q: string): string => {
    const t = q.toLowerCase();
    const active = serviceBookings.filter((b) => b.status !== "avbokad");
    const covers = active.reduce((s, b) => s + b.party, 0);

    if (t.includes("risk") || t.includes("no-show") || t.includes("uteblir")) {
      const risky = active
        .map((b) => ({ b, r: assessRisk(b) }))
        .filter((x) => x.r.level !== "låg")
        .slice(0, 5);
      return risky.length
        ? `${risky.length} bokningar har förhöjd no-show-risk:\n${risky
            .map((x) => `• ${x.b.name} kl ${x.b.time} — ${x.r.level} risk (${x.r.reasons[0]})`)
            .join("\n")}\nJag kan skicka bekräftelse-SMS till dem.`
        : "Inga bokningar har förhöjd no-show-risk just nu.";
    }
    if (t.includes("flytt") || t.includes("optimer") || t.includes("plats")) {
      const moves = suggestMoves(serviceBookings, data.units);
      const gain = moves.reduce((s, m) => s + m.gain, 0);
      return moves.length
        ? `Jag hittar ${moves.length} flyttar som frigör ${gain} extra täckningar:\n${moves
            .map((m) => `• ${m.guest}: bord ${m.from} → ${m.to} (${m.reason})`)
            .join("\n")}`
        : "Rummet är redan optimalt placerat för det här passet.";
    }
    if (t.includes("oplacerad") || t.includes("väntar på bord")) {
      const un = unplacedWithOptions(serviceBookings, data.units);
      return un.length
        ? `${un.length} sällskap saknar bord:\n${un
            .map(
              (u) =>
                `• ${u.booking.name} (${u.booking.party} pers, ${u.booking.time}) — förslag: ${
                  u.options.map((o) => o.label).join(", ") || "inget bord räcker"
                }`,
            )
            .join("\n")}`
        : "Alla sällskap är placerade.";
    }
    if (t.includes("stor") || t.includes("sällskap")) {
      const big = active.filter((b) => b.party >= 8);
      return big.length
        ? `${big.length} stora sällskap idag:\n${big
            .map((b) => `• ${b.name} — ${b.party} pers kl ${b.time}${b.pmId ? " (PM finns)" : " (PM saknas)"}`)
            .join("\n")}`
        : "Inga sällskap över 8 personer idag.";
    }
    if (t.includes("allerg") || t.includes("special")) {
      const a = active.filter((b) => (b.note ?? "").toLowerCase().match(/allerg|glutens?|laktos|vegan/));
      return a.length
        ? `Specialkost idag:\n${a.map((b) => `• ${b.name} kl ${b.time} — ${b.note}`).join("\n")}`
        : "Inga registrerade allergier eller specialkost idag.";
    }
    if (t.includes("ledig") || t.includes("tillgäng")) {
      const taken = new Set(active.filter((b) => b.placed).map((b) => b.table));
      const free = data.units.filter((u) => !taken.has(u.label));
      return `${free.length} ${venue === "hotell" ? "rum" : "bord"} är lediga: ${free
        .slice(0, 12)
        .map((u) => `${u.label} (${u.seats} pl)`)
        .join(", ")}.`;
    }
    if (t.includes("lunch") || t.includes("middag") || t.includes("pass")) {
      const lunch = data.bookings.filter((b) => b.status !== "avbokad" && serviceOf(b.time) === "lunch");
      const dinner = data.bookings.filter((b) => b.status !== "avbokad" && serviceOf(b.time) === "middag");
      return `Lunch: ${lunch.length} bokningar / ${lunch.reduce((s, b) => s + b.party, 0)} täckningar.\nMiddag: ${dinner.length} bokningar / ${dinner.reduce((s, b) => s + b.party, 0)} täckningar.`;
    }
    return `Just nu ${service === "lunch" ? "under lunch" : "under kvällen"}: ${active.length} bokningar och ${covers} täckningar. Fråga mig gärna om no-show-risk, oplacerade sällskap, lediga bord, allergier eller optimering.`;
  };

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", text: q }, { role: "assistant", text: answer(q) }]);
    setInput("");
    inputRef.current?.focus();
  };

  const suggestions = [
    "Vilka bokningar har hög no-show-risk?",
    "Vilka sällskap saknar bord?",
    "Kan vi optimera placeringen?",
    "Finns det allergier idag?",
  ];

  return (
    <div className="mx-auto flex h-[calc(100vh-11rem)] max-w-3xl flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto pb-4">
        {messages.length === 0 ? (
          <div className="grid place-items-center gap-3 py-16 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-forest">
              <Bot className="h-6 w-6" />
            </span>
            <h1 className="text-display text-forest">Vad vill du veta om dagen?</h1>
            <p className="max-w-md text-body text-muted-foreground">
              Assistenten läser bokningar, bord, väntelista och gästprofiler i realtid.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-forest"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
              <p
                className={`whitespace-pre-line text-body ${
                  m.role === "user"
                    ? "max-w-[80%] rounded-2xl bg-primary px-4 py-2.5 text-primary-foreground"
                    : "text-forest"
                }`}
              >
                {m.text}
              </p>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-soft"
      >
        <textarea
          ref={inputRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          placeholder="Fråga om bokningar, bord, gäster…"
          className="max-h-32 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-forest outline-none"
        />
        <button
          type="submit"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90"
          aria-label="Skicka"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
