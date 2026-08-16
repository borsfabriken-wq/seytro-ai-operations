import { useEffect } from "react";
import { ArrowLeft, Mail, Phone, Star, Users, X } from "lucide-react";
import type { Booking, Guest } from "@/lib/dashboard-data";

/**
 * Sidopanel som visar hela bokningen och gästprofilen.
 * Öppnas när man klickar sig vidare från ett bord på salsplanen.
 */
export function BookingDrawer({
  open,
  booking,
  guest,
  unitWord,
  onClose,
  children,
}: {
  open: boolean;
  booking: Booking | null;
  guest?: Guest | null;
  unitWord: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Stäng"
        onClick={onClose}
        className="drawer-backdrop absolute inset-0 bg-forest/25 backdrop-blur-[2px]"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Bokning ${booking.name}`}
        className="drawer-panel relative flex h-full w-full max-w-[34rem] flex-col border-l border-border bg-card shadow-overlay"
      >
        <header className="flex items-center gap-3 border-b border-border px-5 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Tillbaka till salsplan
          </button>
          <div className="min-w-0 flex-1 text-right">
            <p className="truncate text-sm text-forest">{booking.name}</p>
            <p className="text-xs text-muted-foreground">
              {booking.time}
              {booking.end ? `–${booking.end}` : ""} · {booking.party} gäster ·{" "}
              {booking.table ? `${unitWord} ${booking.table}` : "ej placerad"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Stäng panel"
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-forest"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* Gästprofil */}
          <div className="mb-5 rounded-2xl border border-border bg-surface-2 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="eyebrow text-muted-foreground">Gästprofil</p>
              {guest ? (
                <span className="flex items-center gap-1 text-xs text-primary">
                  <Star className="h-3.5 w-3.5" /> Återkommande gäst
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">Ny gäst</span>
              )}
            </div>
            <p className="mt-1 text-subheading text-forest">{booking.name}</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                {booking.phone || guest?.phone || "—"}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                {booking.email || guest?.email || "—"}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                {booking.party} gäster
              </span>
            </div>
            {guest && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                <Stat label="Besök" value={`${guest.visits}`} />
                <Stat label="Snittnota" value={`${Math.round(guest.spend / Math.max(guest.visits, 1))} kr`} />
                <Stat label="Senast" value={guest.last} />
              </div>
            )}
            {(guest?.tags?.length ?? 0) > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {guest!.tags.map((t) => (
                  <span key={t} className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {children}
        </div>
      </aside>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm tabular-nums text-forest">{value}</p>
    </div>
  );
}
