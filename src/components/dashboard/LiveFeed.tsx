import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";
import {
  Bell,
  Bot,
  CalendarX2,
  CheckCheck,
  Clock,
  Move,
  Sparkles,
  UserPlus,
} from "lucide-react";

import {
  getLiveEvents,
  markAllRead,
  startLiveSimulation,
  subscribeLive,
  timeAgo,
  unreadCount,
  type LiveEvent,
  type LiveEventKind,
} from "@/lib/live-events";

const emptyEvents: LiveEvent[] = [];

/** Läser hela livesströmmen (uppdateras automatiskt). */
export function useLiveEvents(): LiveEvent[] {
  return useSyncExternalStore(subscribeLive, getLiveEvents, () => emptyEvents);
}

/**
 * Kör `handler` för varje ny händelse av angivna typer.
 * Används av vyer för att uppdatera sina listor utan omladdning.
 */
export function useLiveSubscription(
  kinds: readonly LiveEventKind[],
  handler: (event: LiveEvent) => void,
) {
  const events = useLiveEvents();
  const seen = useRef<string | null>(null);
  const cb = useRef(handler);
  cb.current = handler;
  const kindKey = kinds.join(",");

  useEffect(() => {
    const latest = events[0];
    if (!latest) return;
    if (seen.current === null) {
      seen.current = latest.id;
      return;
    }
    if (seen.current === latest.id) return;
    const index = events.findIndex((e) => e.id === seen.current);
    const fresh = index === -1 ? events.slice(0, 1) : events.slice(0, index);
    seen.current = latest.id;
    for (const event of [...fresh].reverse()) {
      if (kindKey.split(",").includes(event.kind)) cb.current(event);
    }
  }, [events, kindKey]);
}

const iconFor: Record<LiveEventKind, typeof Bell> = {
  "vantelista-ny": UserPlus,
  "vantelista-match": Sparkles,
  "vantelista-erbjudande": Clock,
  "vantelista-svar": CheckCheck,
  "vantelista-omvandlad": CheckCheck,
  flytt: Move,
  avbokning: CalendarX2,
  "ny-bokning": UserPlus,
};

const toneFor: Record<LiveEventKind, string> = {
  "vantelista-ny": "bg-status-clean text-status-clean-fg",
  "vantelista-match": "bg-status-set text-status-set-fg",
  "vantelista-erbjudande": "bg-status-set text-status-set-fg",
  "vantelista-svar": "bg-status-free text-status-free-fg",
  "vantelista-omvandlad": "bg-status-free text-status-free-fg",
  flytt: "bg-status-set text-status-set-fg",
  avbokning: "bg-status-done text-status-done-fg",
  "ny-bokning": "bg-status-free text-status-free-fg",
};

export function LiveFeed({ venue }: { venue: "restaurang" | "hotell" }) {
  const events = useLiveEvents();
  const [open, setOpen] = useState(false);
  const [, setTick] = useState(0);
  const venueRef = useRef(venue);
  venueRef.current = venue;
  const panelRef = useRef<HTMLDivElement | null>(null);

  const getVenue = useCallback(() => venueRef.current, []);

  useEffect(() => startLiveSimulation(getVenue), [getVenue]);

  // Håll relativa tidsstämplar färska.
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  // Toast på nya händelser.
  useLiveSubscription(
    [
      "vantelista-ny",
      "vantelista-match",
      "vantelista-erbjudande",
      "vantelista-svar",
      "vantelista-omvandlad",
      "flytt",
      "avbokning",
      "ny-bokning",
    ],
    (event) => {
      const options = { description: event.detail, duration: 6000 };
      if (event.kind === "avbokning") toast.warning(event.title, options);
      else if (event.kind === "flytt") toast.info(event.title, options);
      else toast.success(event.title, options);
    },
  );

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const unread = unreadCount(events);
  const visible = events.filter((e) => e.venue === venue).slice(0, 12);

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => {
          setOpen((v) => {
            if (!v) markAllRead();
            return !v;
          });
        }}
        aria-label={`Aviseringar${unread ? ` (${unread} olästa)` : ""}`}
        className="relative grid h-9 w-9 place-items-center rounded-full border border-dashboard-header-edge bg-background text-forest shadow-soft transition-colors hover:bg-accent"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[22rem] overflow-hidden rounded-2xl border border-border bg-card shadow-raised">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-forest">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Live i driften
            </p>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Bot className="h-3 w-3" /> AI uppdaterar automatiskt
            </span>
          </div>

          <div className="max-h-[24rem] overflow-y-auto">
            {visible.map((event) => {
              const Icon = iconFor[event.kind];
              return (
                <div
                  key={event.id}
                  className="flex gap-3 border-b border-border/50 px-4 py-3 last:border-0"
                >
                  <span
                    className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${toneFor[event.kind]}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-forest">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.detail}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground/80">
                      {timeAgo(event.at)}
                      {event.auto ? " · hanterad av AI" : ""}
                    </p>
                  </div>
                </div>
              );
            })}
            {visible.length === 0 && (
              <p className="px-4 py-10 text-center text-sm text-muted-foreground">
                Inga händelser ännu — nya matchningar, flyttar och avbokningar dyker upp här direkt.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
