import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, Lock, Plus, Search, Users } from "lucide-react";
import { useVenue } from "@/components/dashboard/DashboardShell";
import { FloorPlan } from "@/components/dashboard/FloorPlan";
import { unitStatusStyles, type TableUnit } from "@/lib/dashboard-data";

export const Route = createFileRoute("/dashboard/salsplan")({
  head: () => ({
    meta: [
      { title: "Salsplan och rumsöversikt — Seytro Dashboard" },
      { name: "description", content: "Live-vy över bord och rum med status i realtid." },
      { property: "og:title", content: "Salsplan och rumsöversikt — Seytro Dashboard" },
      { property: "og:description", content: "Live-vy över bord och rum med status i realtid." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FloorPage,
});

const services = ["17:00", "18:00", "19:00", "20:00", "21:00"];

function FloorPage() {
  const { data, venue } = useVenue();
  const [query, setQuery] = useState("");
  const [service, setService] = useState("19:00");
  const [zone, setZone] = useState<string>("Alla");
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  const zones = useMemo(
    () => ["Alla", ...Array.from(new Set(data.units.map((u) => u.zone)))],
    [data.units],
  );

  const visibleUnits = data.units.filter((u) => zone === "Alla" || u.zone === zone);

  const bookings = data.bookings.filter((b) =>
    b.name.toLowerCase().includes(query.toLowerCase()),
  );
  const unplaced = bookings.filter((b) => b.placed === false);
  const placed = bookings.filter((b) => b.placed !== false);

  const counts = {
    ledigt: visibleUnits.filter((u) => u.status === "ledigt").length,
    dukat: visibleUnits.filter((u) => u.status === "dukat").length,
    upptaget: visibleUnits.filter((u) => u.status === "upptaget").length,
    städas: visibleUnits.filter((u) => u.status === "städas").length,
  };

  const guestsUnplaced = unplaced.reduce((s, b) => s + b.party, 0);
  const guestsPlaced = placed.reduce((s, b) => s + b.party, 0);
  const activeBooking = data.bookings.find((b) => b.id === selectedBooking) ?? null;
  const activeUnit = data.units.find((u) => u.id === selectedUnit) ?? null;

  const handleUnit = (u: TableUnit) => {
    setSelectedUnit(u.id === selectedUnit ? null : u.id);
    setSelectedBooking(null);
  };

  return (
    <div className="mx-auto max-w-[110rem] space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display text-forest">
            {venue === "hotell" ? "Rumsöversikt" : "Salsplan"}
          </h1>
          <p className="text-body text-muted-foreground">
            {visibleUnits.length} {venue === "hotell" ? "rum" : "bord"} ·{" "}
            {guestsPlaced + guestsUnplaced} gäster inbokade idag
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(counts).map(([k, v]) => (
            <span
              key={k}
              className={`rounded-full border px-3 py-1 text-xs capitalize ${unitStatusStyles[k as keyof typeof counts]}`}
            >
              {k} · {v}
            </span>
          ))}
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full bg-forest px-3.5 py-1.5 text-xs text-primary-foreground"
          >
            <Plus className="h-3.5 w-3.5" /> Ny bokning
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[22rem_minmax(0,1fr)]">
        {/* Bokningslista */}
        <div className="flex max-h-[42rem] flex-col overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex-1 overflow-y-auto text-sm">
            <GroupHeader
              tone="amber"
              title="Ej placerade"
              meta={`${guestsUnplaced} gäster, ${unplaced.length} bokningar`}
            />
            {unplaced.map((b) => (
              <BookingRow
                key={b.id}
                active={selectedBooking === b.id}
                onClick={() => {
                  setSelectedBooking(b.id === selectedBooking ? null : b.id);
                  setSelectedUnit(null);
                }}
                time={b.time}
                party={b.party}
                name={b.name}
                table={b.table}
              />
            ))}

            <GroupHeader
              tone="green"
              title="Placerade"
              meta={`${guestsPlaced} gäster, ${placed.length} bokningar`}
            />
            {placed.map((b) => (
              <BookingRow
                key={b.id}
                active={selectedBooking === b.id}
                onClick={() => {
                  setSelectedBooking(b.id === selectedBooking ? null : b.id);
                  setSelectedUnit(null);
                }}
                time={b.time}
                party={b.party}
                name={b.name}
                table={b.table}
              />
            ))}
          </div>
        </div>

        {/* Plan */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3">
            <div className="flex flex-wrap gap-1">
              {zones.map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => setZone(z)}
                  className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                    zone === z
                      ? "bg-forest text-primary-foreground"
                      : "border border-border text-muted-foreground hover:text-forest"
                  }`}
                >
                  {z}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 rounded-full border border-border p-1">
              <Clock className="mx-1.5 h-3.5 w-3.5 text-muted-foreground" />
              {services.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setService(s)}
                  className={`rounded-full px-2.5 py-1 text-xs ${
                    service === s ? "bg-primary/12 text-primary" : "text-muted-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {venue === "restaurang" ? (
            <FloorPlan units={visibleUnits} selected={selectedUnit} onSelect={handleUnit} />
          ) : (
            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-card p-5 sm:grid-cols-4 lg:grid-cols-6">
              {visibleUnits.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleUnit(u)}
                  className={`rounded-xl border p-4 text-left transition-transform hover:-translate-y-0.5 ${unitStatusStyles[u.status]} ${
                    selectedUnit === u.id ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <span className="block text-lg font-medium">{u.label}</span>
                  <span className="block text-xs opacity-80">{u.seats} bäddar</span>
                  <span className="mt-2 block text-xs capitalize opacity-90">{u.status}</span>
                  {u.guest && (
                    <span className="block truncate text-xs opacity-80">
                      {u.guest} · {u.until}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Detaljpanel */}
          <div className="rounded-2xl border border-border bg-card p-5">
            {activeBooking ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="eyebrow text-muted-foreground">
                      Bokning #{activeBooking.id.toUpperCase()}
                    </p>
                    <h2 className="text-subheading text-forest">{activeBooking.name}</h2>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Pill icon={<Users className="h-3.5 w-3.5" />} text={`${activeBooking.party} gäster`} />
                    <Pill icon={<Clock className="h-3.5 w-3.5" />} text={`${activeBooking.time}–${activeBooking.end ?? ""}`} />
                    <Pill text={activeBooking.source} />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activeBooking.note ?? "Ingen bokningskommentar."}
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeBooking.tags.map((t) => (
                    <span key={t} className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                      activeBooking.placed === false
                        ? "bg-amber-500/15 text-amber-700"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {activeBooking.placed === false
                      ? `Välj bord · ${activeBooking.party} kvar`
                      : `Placerad på bord ${activeBooking.table}`}
                  </button>
                  <button type="button" className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground">
                    Bekräfta bokning
                  </button>
                  <button type="button" className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground">
                    No show
                  </button>
                  <button type="button" className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground">
                    <Lock className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : activeUnit ? (
              <div className="space-y-2">
                <p className="eyebrow text-muted-foreground">{activeUnit.zone}</p>
                <h2 className="text-subheading text-forest">
                  {venue === "hotell" ? "Rum" : "Bord"} {activeUnit.label}
                </h2>
                <p className="text-sm capitalize text-muted-foreground">
                  {activeUnit.seats} platser · {activeUnit.status}
                  {activeUnit.guest ? ` · ${activeUnit.guest} till ${activeUnit.until}` : ""}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Välj en bokning eller ett {venue === "hotell" ? "rum" : "bord"} för att se detaljer,
                gästprofil och placeringsförslag från Seytro.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function GroupHeader({ title, meta, tone }: { title: string; meta: string; tone: "amber" | "green" }) {
  return (
    <div
      className={`sticky top-0 px-4 py-2 text-xs font-medium ${
        tone === "amber" ? "bg-amber-500/15 text-amber-800" : "bg-emerald-500/15 text-emerald-800"
      }`}
    >
      {title} <span className="font-normal opacity-75">({meta})</span>
    </div>
  );
}

function BookingRow({
  time,
  party,
  name,
  table,
  active,
  onClick,
}: {
  time: string;
  party: number;
  name: string;
  table: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 border-b border-border/60 px-4 py-2.5 text-left transition-colors ${
        active ? "bg-primary/8" : "hover:bg-muted/50"
      }`}
    >
      <span className="w-11 text-xs text-muted-foreground">{time}</span>
      <span className="grid h-6 w-6 place-items-center rounded-md bg-muted text-xs text-forest">
        {party}
      </span>
      <span className="min-w-0 flex-1 truncate text-forest">{name}</span>
      <span className="text-xs text-muted-foreground">{table || "—"}</span>
    </button>
  );
}

function Pill({ icon, text }: { icon?: React.ReactNode; text: string }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-muted-foreground">
      {icon}
      {text}
    </span>
  );
}
