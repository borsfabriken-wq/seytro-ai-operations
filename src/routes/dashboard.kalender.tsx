import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { CalendarRange, GripVertical, Lock, RotateCcw, Undo2 } from "lucide-react";

import { useVenue } from "@/components/dashboard/DashboardShell";
import { publishLive } from "@/lib/live-events";
import { statusStyles, type Booking, type BookingStatus } from "@/lib/dashboard-data";
import { toMinutes, toTime, turnTime } from "@/lib/capacity-ai";

export const Route = createFileRoute("/dashboard/kalender")({
  head: () => ({
    meta: [
      { title: "Kalender — Seytro Dashboard" },
      {
        name: "description",
        content: "Dagens bokningar i en kalendervy med drag-och-släpp och tydliga statusar.",
      },
      { property: "og:title", content: "Kalender — Seytro Dashboard" },
      {
        property: "og:description",
        content: "Flytta bokningar mellan bord och tider direkt i kalendern.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CalendarPage,
});

const SLOT = 15;
const SLOT_PX = 26;

const spans = {
  hela: { from: 11 * 60, to: 23 * 60 + 30, label: "Hela dagen" },
  lunch: { from: 11 * 60, to: 15 * 60, label: "Lunch" },
  middag: { from: 17 * 60, to: 23 * 60 + 30, label: "Middag" },
} as const;

type SpanKey = keyof typeof spans;

const statusLegend: { status: BookingStatus; hint: string }[] = [
  { status: "bekräftad", hint: "Bekräftad av gästen" },
  { status: "väntar", hint: "Väntar på bekräftelse" },
  { status: "anlänt", hint: "Gästen är på plats" },
  { status: "avbokad", hint: "Avbokad — platsen är fri" },
];

const statusBlock: Record<BookingStatus, string> = {
  bekräftad: "border-primary/40 bg-primary/10 text-forest",
  väntar: "border-status-clean-border bg-status-clean text-status-clean-fg",
  anlänt: "border-status-free-border bg-status-free text-status-free-fg",
  avbokad: "border-border bg-surface-1 text-muted-foreground line-through",
};

type Drag = { bookingId: string; grabMinutes: number };

function CalendarPage() {
  const { data, venue } = useVenue();
  const unitWord = (data.unitWord ?? "bord").toLowerCase();
  const Unit = unitWord.charAt(0).toUpperCase() + unitWord.slice(1);

  const [bookings, setBookings] = useState<Booking[]>(data.bookings);
  const [history, setHistory] = useState<Booking[][]>([]);
  const [span, setSpan] = useState<SpanKey>("hela");
  const [zone, setZone] = useState("alla");
  const [drag, setDrag] = useState<Drag | null>(null);
  const [hover, setHover] = useState<{ unit: string; start: number } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBookings(data.bookings);
    setHistory([]);
  }, [data.bookings]);

  const zones = useMemo(
    () => ["alla", ...Array.from(new Set(data.units.map((u) => u.zone)))],
    [data.units],
  );
  const units = data.units.filter((u) => zone === "alla" || u.zone === zone);
  const { from, to } = spans[span];
  const slots = Math.ceil((to - from) / SLOT);
  const hours = Array.from({ length: Math.ceil((to - from) / 60) + 1 }, (_, i) =>
    Math.floor(from / 60) + i,
  );

  const placed = bookings.filter((b) => b.table);
  const unplaced = bookings.filter((b) => !b.table && b.status !== "avbokad");

  const clashes = (bookingId: string, unitLabel: string, start: number, length: number) =>
    placed.some((o) => {
      if (o.id === bookingId || o.table !== unitLabel || o.status === "avbokad") return false;
      const os = toMinutes(o.time);
      return os < start + length && start < os + turnTime(o);
    });

  const commit = (next: Booking[]) => {
    setHistory((h) => [...h.slice(-9), bookings]);
    setBookings(next);
  };

  const dropAt = (unitLabel: string, start: number) => {
    if (!drag) return;
    const booking = bookings.find((b) => b.id === drag.bookingId);
    if (!booking) return;
    if (booking.lockedTable && booking.table !== unitLabel) {
      toast.error(`${booking.name} har låst ${unitWord} och kan inte flyttas`);
      return;
    }
    const unit = data.units.find((u) => u.label === unitLabel);
    const length = turnTime(booking);
    const snapped = Math.max(from, Math.min(to - length, Math.round(start / SLOT) * SLOT));

    if (unit && unit.seats < booking.party) {
      toast.error(`${Unit} ${unitLabel} har bara ${unit.seats} platser för ${booking.party} gäster`);
      return;
    }
    if (clashes(booking.id, unitLabel, snapped, length)) {
      toast.error(`Krock på ${unitWord} ${unitLabel} kl ${toTime(snapped)}`);
      return;
    }
    if (booking.table === unitLabel && toMinutes(booking.time) === snapped) return;

    const time = toTime(snapped);
    commit(
      bookings.map((b) =>
        b.id === booking.id
          ? { ...b, table: unitLabel, time, end: toTime(snapped + length), placed: true }
          : b,
      ),
    );
    publishLive({
      kind: "flytt",
      venue,
      title: "Bokning flyttad i kalendern",
      detail: `${booking.name} · ${unitWord} ${unitLabel} kl ${time}`,
      payload: { name: booking.name, unit: unitLabel },
    });
    toast.success(`${booking.name} → ${unitWord} ${unitLabel} kl ${time}`);
  };

  const onRowDragOver = (e: React.DragEvent, unitLabel: string) => {
    e.preventDefault();
    if (!drag) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const minutes = from + ((e.clientX - rect.left) / SLOT_PX) * SLOT - drag.grabMinutes;
    setHover({ unit: unitLabel, start: Math.round(minutes / SLOT) * SLOT });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display text-forest">Kalender</h1>
          <p className="text-body text-muted-foreground">
            Dagens bokningar per {unitWord}. Dra ett block för att byta tid eller {unitWord} — AI
            stoppar krockar och för små {unitWord}.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={history.length === 0}
            onClick={() => {
              const prev = history[history.length - 1];
              if (!prev) return;
              setHistory((h) => h.slice(0, -1));
              setBookings(prev);
              toast.success("Ångrade senaste flytten");
            }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-forest disabled:opacity-50"
          >
            <Undo2 className="h-3.5 w-3.5" /> Ångra
          </button>
          <button
            type="button"
            onClick={() => {
              setBookings(data.bookings);
              setHistory([]);
              toast.success("Kalendern återställd");
            }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-forest"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Återställ
          </button>
        </div>
      </div>

      {/* Filter + statuslegend */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(spans) as SpanKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setSpan(key)}
              className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                span === key
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:text-forest"
              }`}
            >
              {spans[key].label}
            </button>
          ))}
          <select
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="rounded-full border border-border bg-surface-1 px-3 py-1.5 text-xs text-muted-foreground"
          >
            {zones.map((z) => (
              <option key={z} value={z}>
                {z === "alla" ? "Alla zoner" : z}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {statusLegend.map((s) => (
            <span
              key={s.status}
              title={s.hint}
              className={`rounded-full border px-2.5 py-0.5 text-[11px] ${statusStyles[s.status]}`}
            >
              {s.status}
            </span>
          ))}
        </div>
      </div>

      {/* Oplacerade — dra in i kalendern */}
      {unplaced.length > 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-3">
          <p className="mb-2 text-xs text-muted-foreground">
            {unplaced.length} bokningar utan {unitWord} — dra in dem i kalendern
          </p>
          <div className="flex flex-wrap gap-2">
            {unplaced.map((b) => (
              <div
                key={b.id}
                draggable
                onDragStart={() => setDrag({ bookingId: b.id, grabMinutes: 0 })}
                onDragEnd={() => {
                  setDrag(null);
                  setHover(null);
                }}
                className={`cursor-grab rounded-full border px-3 py-1.5 text-xs active:cursor-grabbing ${statusBlock[b.status]}`}
              >
                {b.name} · {b.party} pers · {b.time}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kalendergrid */}
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <div ref={gridRef} style={{ minWidth: 180 + slots * SLOT_PX }}>
          {/* Tidshuvud */}
          <div className="sticky top-0 z-10 flex border-b border-border bg-card">
            <div className="flex w-[180px] shrink-0 items-center gap-2 px-4 py-2 text-xs text-muted-foreground">
              <CalendarRange className="h-3.5 w-3.5" /> {Unit}
            </div>
            <div className="relative h-9" style={{ width: slots * SLOT_PX }}>
              {hours.map((h) => {
                const left = ((h * 60 - from) / SLOT) * SLOT_PX;
                if (left < 0 || left > slots * SLOT_PX) return null;
                return (
                  <span
                    key={h}
                    className="absolute top-2 -translate-x-1/2 text-[11px] tabular-nums text-muted-foreground"
                    style={{ left }}
                  >
                    {String(h).padStart(2, "0")}:00
                  </span>
                );
              })}
            </div>
          </div>

          {/* Rader */}
          {units.map((unit) => {
            const rowBookings = placed.filter((b) => b.table === unit.label);
            return (
              <div key={unit.id} className="flex border-b border-border/60 last:border-0">
                <div className="w-[180px] shrink-0 border-r border-border/60 px-4 py-3">
                  <p className="text-sm text-forest">
                    {Unit} {unit.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {unit.seats} platser · {unit.zone}
                  </p>
                </div>
                <div
                  className="relative"
                  style={{ width: slots * SLOT_PX, height: 62 }}
                  onDragOver={(e) => onRowDragOver(e, unit.label)}
                  onDragLeave={() => setHover(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (hover) dropAt(unit.label, hover.start);
                    setDrag(null);
                    setHover(null);
                  }}
                >
                  {/* rutnät */}
                  {Array.from({ length: slots }).map((_, i) => (
                    <div
                      key={i}
                      className={`absolute top-0 h-full border-l ${
                        (from + i * SLOT) % 60 === 0 ? "border-border/70" : "border-border/25"
                      }`}
                      style={{ left: i * SLOT_PX }}
                    />
                  ))}

                  {/* släppindikator */}
                  {drag && hover?.unit === unit.label && (
                    <div
                      className="pointer-events-none absolute top-1 h-[54px] rounded-lg border-2 border-dashed border-primary/60 bg-primary/5"
                      style={{
                        left: ((hover.start - from) / SLOT) * SLOT_PX,
                        width:
                          (turnTime(
                            bookings.find((b) => b.id === drag.bookingId) ?? bookings[0]!,
                          ) /
                            SLOT) *
                          SLOT_PX,
                      }}
                    />
                  )}

                  {rowBookings.map((b) => {
                    const start = toMinutes(b.time);
                    const length = turnTime(b);
                    const left = ((start - from) / SLOT) * SLOT_PX;
                    const width = (length / SLOT) * SLOT_PX;
                    if (left + width < 0 || left > slots * SLOT_PX) return null;
                    return (
                      <div
                        key={b.id}
                        draggable={b.status !== "avbokad"}
                        onDragStart={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setDrag({
                            bookingId: b.id,
                            grabMinutes: ((e.clientX - rect.left) / SLOT_PX) * SLOT,
                          });
                        }}
                        onDragEnd={() => {
                          setDrag(null);
                          setHover(null);
                        }}
                        title={`${b.name} · ${b.party} pers · ${b.time}–${toTime(start + length)} · ${b.status}`}
                        className={`absolute top-1 flex h-[54px] cursor-grab items-center gap-1.5 overflow-hidden rounded-lg border px-2 shadow-soft transition-opacity active:cursor-grabbing ${
                          statusBlock[b.status]
                        } ${drag?.bookingId === b.id ? "opacity-50" : ""}`}
                        style={{ left: Math.max(0, left), width: Math.max(SLOT_PX * 2, width) }}
                      >
                        {b.lockedTable ? (
                          <Lock className="h-3 w-3 shrink-0 opacity-70" />
                        ) : (
                          <GripVertical className="h-3 w-3 shrink-0 opacity-50" />
                        )}
                        <span className="min-w-0">
                          <span className="block truncate text-xs leading-tight">{b.name}</span>
                          <span className="block truncate text-[10px] tabular-nums leading-tight opacity-75">
                            {b.time} · {b.party} pers
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
