import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpDown, Check, Clock, FileText, Plus, Search, SlidersHorizontal, Users, X } from "lucide-react";
import { useVenue } from "@/components/dashboard/DashboardShell";
import { FloorPlan, floorStateOf } from "@/components/dashboard/FloorPlan";
import { BookingDrawer } from "@/components/dashboard/BookingDrawer";
import { PmBookIcon, PmModal } from "@/components/dashboard/PmModal";
import {
  BookingDialog,
  pmTemplates,
  tagGroups,
  type NewBookingDraft,
} from "@/components/dashboard/BookingDialog";
import {
  serviceOf,
  servicePeriods,
  unitStatusStyles,
  type Booking,
  type TableUnit,
} from "@/lib/dashboard-data";

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
  validateSearch: (search: Record<string, unknown>): { new?: true; q?: string } => ({
    ...(search["new"] === "1" || search["new"] === true ? { new: true as const } : {}),
    ...(typeof search["q"] === "string" && search["q"] ? { q: search["q"] } : {}),
  }),

  component: FloorPage,
});


const serviceHours: Record<"lunch" | "middag", string[]> = {
  lunch: ["11:30", "12:00", "12:30", "13:00", "14:00"],
  middag: ["17:00", "18:00", "19:00", "20:00", "21:00"],
};

function FloorPage() {
  const { data, venue, service, setService } = useVenue();
  const search = Route.useSearch();
  const [bookings, setBookings] = useState<Booking[]>(data.bookings);
  const [query, setQuery] = useState(search.q ?? "");

  const [slot, setSlot] = useState("19:00");
  const [zone, setZone] = useState("Alla");
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [placingId, setPlacingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(Boolean(search.new));
  const [toast, setToast] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropUnit, setDropUnit] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"alla" | Booking["status"]>("alla");
  const [tagFilter, setTagFilter] = useState<string>("alla");
  const [sort, setSort] = useState<"tid" | "namn" | "sallskap" | "status">("tid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openPmId, setOpenPmId] = useState<string | null>(null);
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [quickOpen, setQuickOpen] = useState(false);
  const [quickIndex, setQuickIndex] = useState(0);

  // Öppna nybokning / förifylld sökning när man kommer från toppraden.
  useEffect(() => {
    if (search.new) setDialogOpen(true);
    if (search.q) setQuery(search.q);
  }, [search.new, search.q]);

  // Passbytet i toppraden styr vilka tider salsplanen visar.
  useEffect(() => {
    setSlot(service === "lunch" ? "12:00" : "19:00");
  }, [service]);


  useEffect(() => {
    setBookings(data.bookings);
    setSelectedBooking(null);
    setSelectedUnit(null);
    setPlacingId(null);
    setZone("Alla");
    setDrawerId(null);
  }, [data]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const zones = useMemo(
    () => ["Alla", ...Array.from(new Set(data.units.map((u) => u.zone)))],
    [data.units],
  );
  const visibleUnits = data.units.filter((u) => zone === "Alla" || u.zone === zone);

  const allTags = useMemo(
    () => Array.from(new Set(bookings.flatMap((b) => b.tags))).sort((a, b) => a.localeCompare(b, "sv")),
    [bookings],
  );

  const statusOrder: Record<Booking["status"], number> = {
    anlänt: 0,
    bekräftad: 1,
    väntar: 2,
    avbokad: 3,
  };

  const filtered = bookings
    .filter((b) => {
      const q = query.toLowerCase();
      const matchesQuery =
        b.name.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q)) ||
        b.table.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "alla" || b.status === statusFilter;
      const matchesTag = tagFilter === "alla" || b.tags.includes(tagFilter);
      const matchesService = venue === "hotell" || serviceOf(b.time) === service;
      return matchesQuery && matchesStatus && matchesTag && matchesService;
    })
    .sort((a, b) => {
      if (sort === "namn") return a.name.localeCompare(b.name, "sv");
      if (sort === "sallskap") return b.party - a.party;
      if (sort === "status") return statusOrder[a.status] - statusOrder[b.status];
      return a.time.localeCompare(b.time);
    });

  const activeFilterCount =
    (statusFilter !== "alla" ? 1 : 0) + (tagFilter !== "alla" ? 1 : 0);

  const resetFilters = () => {
    setStatusFilter("alla");
    setTagFilter("alla");
  };

  const unplaced = filtered.filter((b) => b.placed === false);
  const placed = filtered.filter((b) => b.placed !== false);

  const counts =
    venue === "hotell"
      ? {
          ledigt: visibleUnits.filter((u) => u.status === "ledigt").length,
          dukat: visibleUnits.filter((u) => u.status === "dukat").length,
          upptaget: visibleUnits.filter((u) => u.status === "upptaget").length,
          städas: visibleUnits.filter((u) => u.status === "städas").length,
        }
      : {
          Tillgängligt: visibleUnits.filter((u) => floorStateOf(u) === "tillgängligt").length,
          Upptaget: visibleUnits.filter((u) => floorStateOf(u) === "upptaget").length,
        };

  const activeBooking = bookings.find((b) => b.id === selectedBooking) ?? null;
  const activeUnit = data.units.find((u) => u.id === selectedUnit) ?? null;
  const drawerBooking = bookings.find((b) => b.id === drawerId) ?? null;
  const drawerGuest = drawerBooking
    ? (data.guests.find(
        (g) =>
          g.name.toLowerCase() === drawerBooking.name.toLowerCase() ||
          (Boolean(drawerBooking.email) && g.email === drawerBooking.email),
      ) ?? null)
    : null;

  /** Snabbsök: träffar både bord/rum och bokningar i en enda lista. */
  type QuickHit =
    | { kind: "bord"; key: string; badge: string; title: string; meta: string; unitId: string }
    | { kind: "bokning"; key: string; badge: string; title: string; meta: string; bookingId: string };

  const quickResults = useMemo<QuickHit[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const unitHits: QuickHit[] = data.units
      .filter(
        (u) => u.label.toLowerCase().includes(q) || u.zone.toLowerCase().includes(q),
      )
      .slice(0, 6)
      .map((u) => {
        const b = bookings.find(
          (x) => x.table === u.label && x.placed !== false && x.status !== "avbokad",
        );
        return {
          kind: "bord" as const,
          key: `u-${u.id}`,
          badge: u.label,
          title: `${venue === "hotell" ? "Rum" : "Bord"} ${u.label} · ${u.zone}`,
          meta: b ? `${b.time} · ${b.name} (${b.party})` : `${u.seats} platser · tillgängligt`,
          unitId: u.id,
        };
      });

    const bookingHits: QuickHit[] = bookings
      .filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.table.toLowerCase().includes(q) ||
          b.time.includes(q) ||
          (b.phone ?? "").includes(q) ||
          (b.company ?? "").toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q)),
      )
      .sort((a, b) => a.time.localeCompare(b.time))
      .slice(0, 8)
      .map((b) => ({
        kind: "bokning" as const,
        key: `b-${b.id}`,
        badge: String(b.party),
        title: b.name,
        meta: `${b.time}${b.end ? `–${b.end}` : ""} · ${
          b.table ? `${venue === "hotell" ? "rum" : "bord"} ${b.table}` : "ej placerad"
        }${b.tags.length ? ` · ${b.tags.join(", ")}` : ""}`,
        bookingId: b.id,
      }));

    return [...unitHits, ...bookingHits];
  }, [query, bookings, data.units, venue]);

  /** Bord som matchar sökningen lyfts fram på planen, övriga tonas ned. */
  const highlightUnits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return data.units
      .filter((u) => {
        if (u.label.toLowerCase().includes(q) || u.zone.toLowerCase().includes(q)) return true;
        return bookings.some(
          (b) =>
            b.table === u.label &&
            b.placed !== false &&
            (b.name.toLowerCase().includes(q) ||
              b.time.includes(q) ||
              b.tags.some((t) => t.toLowerCase().includes(q))),
        );
      })
      .map((u) => u.id);
  }, [query, bookings, data.units]);

  const pickQuick = (hit: QuickHit) => {
    setQuickOpen(false);
    if (hit.kind === "bord") {
      const unit = data.units.find((u) => u.id === hit.unitId);
      setSelectedUnit(hit.unitId);
      setSelectedBooking(null);
      if (unit) setZone(unit.zone);
      const booking = bookings.find(
        (b) => b.table === unit?.label && b.placed !== false && b.status !== "avbokad",
      );
      if (booking) setSelectedBooking(booking.id);
      return;
    }
    setSelectedUnit(null);
    setSelectedBooking(hit.bookingId);
    setDrawerId(hit.bookingId);
  };



  const update = (id: string, patch: Partial<Booking>) =>
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));

  const handleUnit = (u: TableUnit) => {
    if (placingId) {
      update(placingId, { table: u.label, placed: true });
      const name = bookings.find((b) => b.id === placingId)?.name ?? "Bokningen";
      setPlacingId(null);
      setSelectedUnit(null);
      setToast(`${name} placerad på ${venue === "hotell" ? "rum" : "bord"} ${u.label}`);
      return;
    }
    setSelectedUnit(u.id === selectedUnit ? null : u.id);
    setSelectedBooking(null);
  };

  const dropOnUnit = (u: TableUnit, bookingId: string) => {
    const b = bookings.find((x) => x.id === bookingId);
    if (!b) return;
    update(bookingId, { table: u.label, placed: true });
    setDraggingId(null);
    setPlacingId(null);
    setSelectedBooking(bookingId);
    setSelectedUnit(null);
    setToast(
      `${b.name} placerad på ${venue === "hotell" ? "rum" : "bord"} ${u.label}${
        b.party > u.seats ? " — obs: fler gäster än platser" : ""
      }`,
    );
  };

  const selectBooking = (id: string) => {
    setSelectedBooking(id === selectedBooking ? null : id);
    setSelectedUnit(null);
    setPlacingId(null);
  };

  const addBooking = (draft: NewBookingDraft) => {
    const id = `n${Date.now()}`;
    setBookings((prev) => [...prev, { ...draft, id }]);
    setSelectedBooking(id);
    setToast(
      draft.table
        ? `Bokning skapad · ${venue === "hotell" ? "rum" : "bord"} ${draft.table}${draft.lockedTable ? " (låst)" : ""}`
        : "Bokning skapad — Seytro placerar automatiskt",
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display text-forest">
            {venue === "hotell" ? "Rumsöversikt" : "Salsplan"}
          </h1>
          <p className="text-body text-muted-foreground">
            {visibleUnits.length} {venue === "hotell" ? "rum" : "bord"} ·{" "}
            {filtered.reduce((s, b) => s + b.party, 0)} gäster{" "}
            {venue === "hotell"
              ? "inbokade idag"
              : `på ${servicePeriods.find((p) => p.id === service)?.label.toLowerCase()}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(counts).map(([k, v]) => (
            <span
              key={k}
              className={`rounded-full border px-3 py-1 text-xs capitalize ${
                unitStatusStyles[k as TableUnit["status"]] ??
                (k === "Upptaget"
                  ? "border-transparent bg-surface-inverse text-primary-foreground"
                  : "border-border-subtle bg-surface-2 text-muted-foreground")
              }`}
            >
              {k} · {v}
            </span>
          ))}
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" /> Ny bokning
          </button>
        </div>
      </div>

      {placingId && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/40 bg-primary/8 px-4 py-2.5 text-sm text-primary">
          <span>
            Välj {venue === "hotell" ? "ett rum" : "ett bord"} på planen för{" "}
            <strong>{bookings.find((b) => b.id === placingId)?.name}</strong>
          </span>
          <button type="button" onClick={() => setPlacingId(null)} className="underline">
            Avbryt
          </button>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[23rem_minmax(0,1fr)]">
        {/* Gäster / bokningar */}
        <div className="flex max-h-[44rem] flex-col overflow-hidden rounded-2xl border border-border bg-card">
          <div className="relative border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setQuickOpen(true);
                  setQuickIndex(0);
                }}
                onFocus={() => setQuickOpen(true)}
                onKeyDown={(e) => {
                  if (!quickResults.length) return;
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setQuickOpen(true);
                    setQuickIndex((i) => (i + 1) % quickResults.length);
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setQuickIndex((i) => (i - 1 + quickResults.length) % quickResults.length);
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    const hit = quickResults[quickIndex];
                    if (hit) pickQuick(hit);
                  } else if (e.key === "Escape") {
                    setQuickOpen(false);
                  }
                }}
                placeholder="Snabbsök bord, gäst, tagg eller tid…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {query && (
                <button type="button" aria-label="Rensa sökning" onClick={() => setQuery("")}>
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setFiltersOpen((v) => !v)}
                title="Filter och sortering"
                className={`flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors ${
                  filtersOpen || activeFilterCount > 0
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-forest"
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                {activeFilterCount > 0 ? activeFilterCount : "Filter"}
              </button>
            </div>

            {quickOpen && query.trim().length > 0 && (
              <div className="drawer-backdrop absolute left-3 right-3 top-full z-30 mt-1 max-h-80 overflow-y-auto rounded-xl border border-border bg-card p-1 shadow-overlay">
                {quickResults.length === 0 && (
                  <p className="px-3 py-3 text-xs text-muted-foreground">Inga träffar</p>
                )}
                {quickResults.map((r, i) => (
                  <button
                    key={r.key}
                    type="button"
                    onMouseEnter={() => setQuickIndex(i)}
                    onClick={() => pickQuick(r)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                      i === quickIndex ? "bg-primary/8 text-forest" : "hover:bg-muted/60"
                    }`}
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-muted text-[10px] text-forest">
                      {r.kind === "bord" ? r.badge : r.badge}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-forest">{r.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">{r.meta}</span>
                    </span>
                    <span className="shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {r.kind}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>


          {filtersOpen && (
            <div className="space-y-3 border-b border-border bg-muted/30 px-4 py-3">
              <FilterRow label="Status">
                <Chip active={statusFilter === "alla"} onClick={() => setStatusFilter("alla")}>
                  Alla
                </Chip>
                {(["väntar", "bekräftad", "anlänt", "avbokad"] as const).map((s) => (
                  <Chip key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>
                    {s === "väntar" ? "Preliminär" : s}
                  </Chip>
                ))}
              </FilterRow>


              {allTags.length > 0 && (
                <FilterRow label="Taggar">
                  <Chip active={tagFilter === "alla"} onClick={() => setTagFilter("alla")}>
                    Alla
                  </Chip>
                  {allTags.map((t) => (
                    <Chip key={t} active={tagFilter === t} onClick={() => setTagFilter(t)}>
                      {t}
                    </Chip>
                  ))}
                </FilterRow>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as typeof sort)}
                    className="rounded-lg border border-border bg-background px-2 py-1 text-xs outline-none"
                  >
                    <option value="tid">Sortera: tid</option>
                    <option value="namn">Sortera: namn</option>
                    <option value="sallskap">Sortera: störst sällskap</option>
                    <option value="status">Sortera: status</option>
                  </select>
                </div>
                {activeFilterCount > 0 && (
                  <button type="button" onClick={resetFilters} className="text-xs text-primary underline">
                    Rensa filter
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto text-sm">
            <GroupHeader
              tone="amber"
              title="Ej placerade"
              meta={`${unplaced.reduce((s, b) => s + b.party, 0)} gäster, ${unplaced.length} bokningar`}
            />
            {unplaced.map((b) => (
              <BookingRow
                key={b.id}
                b={b}
                active={selectedBooking === b.id}
                onClick={() => selectBooking(b.id)}
                onDragStart={() => setDraggingId(b.id)}
                onDragEnd={() => setDraggingId(null)}
                onOpenPm={setOpenPmId}
              />
            ))}
            <GroupHeader
              tone="green"
              title="Placerade"
              meta={`${placed.reduce((s, b) => s + b.party, 0)} gäster, ${placed.length} bokningar`}
            />
            {placed.map((b) => (
              <BookingRow
                key={b.id}
                b={b}
                active={selectedBooking === b.id}
                onClick={() => selectBooking(b.id)}
                onDragStart={() => setDraggingId(b.id)}
                onDragEnd={() => setDraggingId(null)}
                onOpenPm={setOpenPmId}
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
              {serviceHours[service].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSlot(s)}
                  className={`rounded-full px-2.5 py-1 text-xs ${
                    slot === s ? "bg-primary/12 text-primary" : "text-muted-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {venue === "restaurang" ? (
            <FloorPlan
              units={visibleUnits}
              bookings={bookings}
              selected={selectedUnit}
              onSelect={handleUnit}
              onOpenBooking={(b) => {
                setSelectedBooking(b.id);
                setSelectedUnit(null);
                setPlacingId(null);
                setDrawerId(b.id);
              }}
              dragging={Boolean(draggingId)}
              onDropBooking={dropOnUnit}
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-card p-5 sm:grid-cols-4 lg:grid-cols-6">
              {visibleUnits.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleUnit(u)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    if (dropUnit !== u.id) setDropUnit(u.id);
                  }}
                  onDragLeave={() => setDropUnit((v) => (v === u.id ? null : v))}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDropUnit(null);
                    const id = e.dataTransfer.getData("text/booking-id");
                    if (id) dropOnUnit(u, id);
                  }}
                  className={`rounded-xl border p-4 text-left transition-transform hover:-translate-y-0.5 ${unitStatusStyles[u.status]} ${
                    dropUnit === u.id
                      ? "scale-[1.03] ring-2 ring-primary"
                      : selectedUnit === u.id
                        ? "ring-2 ring-primary"
                        : draggingId
                          ? "ring-1 ring-primary/30"
                          : ""
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

          <UpcomingPmCard
            bookings={bookings}
            unitWord={venue === "hotell" ? "rum" : "bord"}
            activeId={selectedBooking}
            onSelect={selectBooking}
          />

          <div className="rounded-2xl border border-border bg-card p-5">
            {activeBooking ? (
              <BookingPanel
                booking={activeBooking}
                unitWord={venue === "hotell" ? "rum" : "bord"}
                placing={placingId === activeBooking.id}
                onPlace={() => setPlacingId(activeBooking.id)}
                onUpdate={(patch) => update(activeBooking.id, patch)}
                onOpenPm={setOpenPmId}
              />
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
                taggar, PM och placeringsförslag från Seytro.
              </p>
            )}
          </div>
        </div>
      </div>

      <BookingDrawer
        open={Boolean(drawerBooking)}
        booking={drawerBooking}
        guest={drawerGuest}
        unitWord={venue === "hotell" ? "rum" : "bord"}
        onClose={() => setDrawerId(null)}
      >
        {drawerBooking && (
          <BookingPanel
            booking={drawerBooking}
            unitWord={venue === "hotell" ? "rum" : "bord"}
            placing={placingId === drawerBooking.id}
            onPlace={() => {
              setPlacingId(drawerBooking.id);
              setDrawerId(null);
            }}
            onUpdate={(patch) => update(drawerBooking.id, patch)}
            onOpenPm={setOpenPmId}
          />
        )}
      </BookingDrawer>

      <PmModal pmId={openPmId} onClose={() => setOpenPmId(null)} />

      <BookingDialog
        open={dialogOpen}
        unitWord={venue === "hotell" ? "Rum" : "Bord"}
        guests={data.guests}
        units={data.units}
        onClose={() => setDialogOpen(false)}
        onSave={addBooking}
      />

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-surface-inverse px-4 py-2 text-sm text-primary-foreground shadow-overlay">
          {toast}
        </div>
      )}
    </div>
  );
}

function BookingPanel({
  booking,
  unitWord,
  placing,
  onPlace,
  onUpdate,
  onOpenPm,
}: {
  booking: Booking;
  unitWord: string;
  placing: boolean;
  onPlace: () => void;
  onUpdate: (patch: Partial<Booking>) => void;
  onOpenPm?: (pmId: string) => void;
}) {
  const [tagEditor, setTagEditor] = useState(false);
  const isLarge = booking.party >= 8;

  const toggleTag = (t: string) =>
    onUpdate({
      tags: booking.tags.includes(t) ? booking.tags.filter((x) => x !== t) : [...booking.tags, t],
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow text-muted-foreground">Bokning #{booking.id.toUpperCase()}</p>
          <h2 className="text-subheading text-forest">{booking.name}</h2>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <Pill icon={<Users className="h-3.5 w-3.5" />} text={`${booking.party} gäster`} />
          <Pill icon={<Clock className="h-3.5 w-3.5" />} text={`${booking.time}${booking.end ? `–${booking.end}` : ""}`} />
          <Pill text={booking.source} />
        </div>
      </div>

      {/* Status */}
      <div className="flex flex-wrap gap-2">
        {(["väntar", "bekräftad", "anlänt", "avbokad"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onUpdate({ status: s })}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm capitalize ${
              booking.status === s
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-forest"
            }`}
          >
            {booking.status === s && <Check className="h-3.5 w-3.5" />}
            {s === "väntar" ? "Preliminär" : s}
          </button>
        ))}
      </div>

      {/* Gästdata */}
      <div className="rounded-xl border border-border p-3">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-muted-foreground">Gästdata</p>
          {!booking.consent && (
            <button
              type="button"
              onClick={() => onUpdate({ consent: true })}
              className="text-xs text-primary underline"
            >
              Registrera samtycke
            </button>
          )}
          {booking.consent && (
            <span className="text-xs text-primary">Samtycke registrerat</span>
          )}
        </div>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <input
            value={booking.phone ?? ""}
            onChange={(e) => onUpdate({ phone: e.target.value })}
            placeholder="Telefon"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
          />
          <input
            value={booking.email ?? ""}
            onChange={(e) => onUpdate({ email: e.target.value })}
            placeholder="E-post"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
          />
          <input
            value={booking.company ?? ""}
            onChange={(e) => onUpdate({ company: e.target.value })}
            placeholder="Företag"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
          />
          <input
            value={booking.occasion ?? ""}
            onChange={(e) => onUpdate({ occasion: e.target.value })}
            placeholder="Tillfälle"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Sparas i gästregistret — Seytro använder det för bekräftelser, uppföljning och
          personliga erbjudanden.
        </p>
      </div>

      {/* Taggar */}
      <div>
        <div className="flex items-center gap-2">
          <p className="eyebrow text-muted-foreground">Taggar</p>
          <button
            type="button"
            onClick={() => setTagEditor((v) => !v)}
            className="text-xs text-primary underline"
          >
            {tagEditor ? "Klar" : "Redigera"}
          </button>
        </div>
        {tagEditor ? (
          <div className="mt-2 space-y-2">
            {tagGroups.map((g) => (
              <div key={g.label}>
                <p className="text-xs text-muted-foreground">{g.label}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {g.tags.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTag(t)}
                      className={`rounded-full border px-2.5 py-1 text-xs ${
                        booking.tags.includes(t)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-2 flex flex-wrap gap-2">
            {booking.tags.length === 0 && (
              <span className="text-sm text-muted-foreground">Inga taggar</span>
            )}
            {booking.tags.map((t) => (
              <span key={t} className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Notering / PM */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="eyebrow text-muted-foreground">{isLarge ? "PM & notering" : "Notering"}</p>
          {isLarge && (
            <select
              value=""
              onChange={(e) => {
                const tpl = pmTemplates.find((t) => t.label === e.target.value);
                if (tpl) onUpdate({ note: `${booking.note ? booking.note + "\n\n" : ""}${tpl.text}` });
              }}
              className="rounded-lg border border-border bg-background px-2 py-1 text-xs outline-none"
            >
              <option value="">Infoga mall…</option>
              {pmTemplates.map((t) => (
                <option key={t.label}>{t.label}</option>
              ))}
            </select>
          )}
          {booking.pmId && (
            <button
              type="button"
              onClick={() => onOpenPm?.(booking.pmId!)}
              className="flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/8 px-2 py-1 text-xs text-primary"
            >
              <PmBookIcon className="h-3.5 w-3.5" />
              Förbeställning finns — visa PM
            </button>
          )}
        </div>
        <textarea
          value={booking.note ?? ""}
          onChange={(e) => onUpdate({ note: e.target.value })}
          rows={isLarge ? 6 : 3}
          placeholder="Skriv en notering…"
          className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onPlace}
          className={`rounded-lg px-3 py-2 text-sm ${
            placing
              ? "bg-primary text-primary-foreground"
              : booking.placed === false
                ? "bg-status-clean text-status-clean-fg"
                : "bg-primary/10 text-primary"
          }`}
        >
          {placing
            ? `Välj ${unitWord} på planen…`
            : booking.placed === false
              ? `Placera på ${unitWord}`
              : `Placerad på ${unitWord} ${booking.table} · flytta`}
        </button>
        {booking.placed !== false && (
          <button
            type="button"
            onClick={() => onUpdate({ placed: false, table: "" })}
            className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground"
          >
            Ta bort placering
          </button>
        )}
      </div>
    </div>
  );
}

function GroupHeader({ title, meta, tone }: { title: string; meta: string; tone: "amber" | "green" }) {
  return (
    <div
      className={`sticky top-0 px-4 py-2 text-xs font-medium ${
        tone === "amber" ? "bg-status-clean text-status-clean-fg" : "bg-status-free text-status-free-fg"
      }`}
    >
      {title} <span className="font-normal opacity-75">({meta})</span>
    </div>
  );
}

function BookingRow({
  b,
  active,
  onClick,
  onDragStart,
  onDragEnd,
  onOpenPm,
}: {
  b: Booking;
  active: boolean;
  onClick: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onOpenPm?: (pmId: string) => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/booking-id", b.id);
        e.dataTransfer.effectAllowed = "move";
        onDragStart?.();
      }}
      onDragEnd={() => onDragEnd?.()}
      className={`flex w-full cursor-grab items-center gap-3 border-b border-border/60 px-4 py-2.5 text-left transition-colors active:cursor-grabbing ${
        active ? "bg-primary/8" : "hover:bg-muted/50"
      }`}
    >
      <span className="w-11 text-xs text-muted-foreground">{b.time}</span>
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-muted text-xs text-forest">
        {b.party}
      </span>
      {b.pmId && (
        <button
          type="button"
          title="Visa PM"
          onClick={(e) => {
            e.stopPropagation();
            onOpenPm?.(b.pmId!);
          }}
          className="shrink-0 rounded p-0.5 hover:bg-muted"
        >
          <PmBookIcon />
        </button>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-forest">{b.name}</span>
        {b.tags.length > 0 && (
          <span className="block truncate text-xs text-muted-foreground">{b.tags.join(" · ")}</span>
        )}
      </span>
      <span className="text-xs text-muted-foreground">{b.table || "—"}</span>
    </div>
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

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow text-muted-foreground">{label}</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-xs capitalize transition-colors ${
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-background text-muted-foreground hover:text-forest"
      }`}
    >
      {children}
    </button>
  );
}

/** Samlat kort över kommande PM-noteringar och stora sällskap. */
function UpcomingPmCard({
  bookings,
  unitWord,
  activeId,
  onSelect,
}: {
  bookings: Booking[];
  unitWord: string;
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  const items = useMemo(
    () =>
      bookings
        .filter((b) => b.status !== "avbokad" && (b.party >= 8 || Boolean(b.note)))
        .sort((a, b) => a.time.localeCompare(b.time)),
    [bookings],
  );

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-forest">PM och stora sällskap</h3>
        </div>
        <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Inga PM eller stora sällskap inbokade för dagen.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((b) => (
            <li key={b.id}>
              <button
                type="button"
                onClick={() => onSelect(b.id)}
                className={`w-full rounded-xl border p-3 text-left transition-colors ${
                  activeId === b.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-forest">{b.name}</span>
                  <span className="text-xs text-muted-foreground">{b.time}</span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {b.party} gäster
                  </span>
                  <span>{b.table ? `${unitWord} ${b.table}` : `Ej placerad`}</span>
                  {b.party >= 8 && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                      Stort sällskap
                    </span>
                  )}
                </div>
                {b.note && <p className="mt-1.5 text-xs text-forest/80">PM: {b.note}</p>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
