import { useMemo, useState } from "react";
import {
  Check,
  Clock,
  Lock,
  LockOpen,
  Mail,
  Minus,
  Phone,
  Plus,
  Search,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";
import type { Booking, BookingSource, Guest, TableUnit } from "@/lib/dashboard-data";
import { PmComposer } from "@/components/dashboard/PmComposer";
import { useTemplates } from "@/lib/pm-templates";
import { uid } from "@/lib/pm";
import { addPmDoc } from "@/lib/pm-store";
import { buildPmDoc, choiceSummary, emptyChoice, type PmChoice } from "@/lib/pm-compose";


export const tagGroups: { label: string; tags: string[] }[] = [
  { label: "Gästtyp", tags: ["VIP", "Stamgäst", "Företag", "Barnfamilj", "Press"] },
  { label: "Tillfälle", tags: ["Årsdag", "Födelsedag", "Möte", "Sen sittning"] },
  { label: "Allergier", tags: ["Gluten", "Laktos", "Nötter", "Skaldjur", "Vegan"] },
  { label: "Plats", tags: ["Fönsterbord", "Uteservering", "Bar", "Lugnt bord"] },
];

export const pmTemplates: { label: string; text: string }[] = [
  {
    label: "Sällskapsmeny 3 rätter",
    text: "PM – Sällskap\n• Meny: 3 rätter (förrätt, huvudrätt, dessert)\n• Dryckespaket: 2 glas vin per gäst\n• Bordsplacering: långbord, dukas 30 min innan\n• Betalning: samlad nota\n• Kontaktperson på plats: ",
  },
  {
    label: "Konferens helpension",
    text: "PM – Konferens\n• Fika 09:30 och 14:30\n• Lunch 12:00, dagens två alternativ\n• Middag 19:00, 3 rätter\n• Teknik: projektor och whiteboard\n• Faktureras enligt avtal\n",
  },
  {
    label: "Fest / bröllop",
    text: "PM – Fest\n• Välkomstdryck 18:00\n• Middag 19:00, meny enligt överenskommelse\n• Tal mellan rätter, toastmaster kontaktas\n• Musik till 01:00\n• Deposition betald: \n",
  },
  {
    label: "Vinmiddag",
    text: "PM – Vinmiddag\n• 5 rätter med matchande viner\n• Sommelier presenterar varje glas\n• Allergier bekräftade i förväg\n• Starttid strikt, sen ankomst placeras vid baren\n",
  },
];

export type NewBookingDraft = Omit<Booking, "id">;

const quickTimes = ["11:30", "12:00", "12:30", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"];

export function BookingDialog({
  open,
  unitWord,
  guests = [],
  units = [],
  onClose,
  onSave,
}: {
  open: boolean;
  unitWord: string;
  guests?: Guest[];
  units?: TableUnit[];
  onClose: () => void;
  onSave: (draft: NewBookingDraft) => void;
}) {
  const [query, setQuery] = useState("");
  const [guestId, setGuestId] = useState<string | null>(null);
  const [party, setParty] = useState(2);
  const [time, setTime] = useState("19:00");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [occasion, setOccasion] = useState("");
  const [consent, setConsent] = useState(false);
  const [source, setSource] = useState<BookingSource>("Telefon");
  const [status, setStatus] = useState<"väntar" | "bekräftad">("väntar");
  const [tags, setTags] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [pm, setPm] = useState("");
  const [pmOpen, setPmOpen] = useState(false);
  const [pmChoice, setPmChoice] = useState<PmChoice>({ ...emptyChoice });
  const { templates } = useTemplates();

  const [table, setTable] = useState("");
  const [lockedTable, setLockedTable] = useState(false);
  const [showTags, setShowTags] = useState(false);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return guests
      .filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.email.toLowerCase().includes(q) ||
          g.phone.replace(/\s/g, "").includes(q.replace(/\s/g, "")),
      )
      .slice(0, 5);
  }, [guests, query]);

  const suggested = useMemo(
    () =>
      units
        .filter((u) => u.seats >= party && u.status !== "upptaget")
        .sort((a, b) => a.seats - b.seats || a.label.localeCompare(b.label)),
    [units, party],
  );

  if (!open) return null;

  const guest = guests.find((g) => g.id === guestId) ?? null;

  const pickGuest = (g: Guest) => {
    setGuestId(g.id);
    setName(g.name);
    setPhone(g.phone);
    setEmail(g.email);
    setConsent(true);
    setTags((prev) => Array.from(new Set([...prev, ...g.tags.slice(0, 2)])));
    setQuery("");
  };

  const clearGuest = () => {
    setGuestId(null);
    setName("");
    setPhone("");
    setEmail("");
  };

  const toggleTag = (t: string) =>
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const hasPm =
    pmOpen && (pmChoice.menuId || pmChoice.drinkId || pmChoice.extras.length > 0);

  const save = () => {
    const guestName = name.trim() || "Ny gäst";
    const summary = hasPm ? choiceSummary(pmChoice, templates, Math.max(1, party)) : "";
    const noteText = [note.trim(), pm.trim(), summary].filter(Boolean).join("\n\n");

    if (hasPm) {
      addPmDoc(
        buildPmDoc(
          {
            id: uid("pm"),
            title: `${guestName} — ${Math.max(1, party)} personer`,
            date: "idag",
            time,
            party: Math.max(1, party),
            status: "utkast",
            ...(company.trim() ? { contact: company.trim() } : {}),
            ...(phone.trim() ? { phone: phone.trim() } : {}),
            ...(email.trim() ? { email: email.trim() } : {}),
          },
          pmChoice,
          templates,
        ),
      );
    }

    onSave({
      time,
      name: guestName,
      party: Math.max(1, party),
      table,
      status,
      source,
      ...(noteText ? { note: noteText } : {}),
      ...(phone.trim() ? { phone: phone.trim() } : {}),
      ...(email.trim() ? { email: email.trim() } : {}),
      ...(company.trim() ? { company: company.trim() } : {}),
      ...(occasion.trim() ? { occasion: occasion.trim() } : {}),
      consent,
      tags,
      placed: Boolean(table),
      lockedTable: Boolean(table) && lockedTable,
    });
    setParty(2);
    clearGuest();
    setCompany("");
    setOccasion("");
    setConsent(false);
    setTags([]);
    setNote("");
    setPm("");
    setPmChoice({ ...emptyChoice });
    setPmOpen(false);
    setTable("");
    setLockedTable(false);
    onClose();
  };


  const unit = unitWord.toLowerCase();

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-foreground/30 backdrop-blur-[2px]">
      <button type="button" aria-label="Stäng" className="flex-1" onClick={onClose} />
      <aside className="flex h-full w-full max-w-md flex-col border-l border-border bg-card shadow-overlay sm:max-w-lg">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <p className="eyebrow text-muted-foreground">Ny bokning</p>
            <h2 className="truncate text-subheading text-forest">
              {name || "Sök eller skriv gästens namn"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-forest"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          {/* Gästsök */}
          <div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (!guestId) setName(e.target.value);
                }}
                placeholder="Sök gäst: namn, telefon eller e-post"
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary"
              />
            </div>
            {matches.length > 0 && (
              <ul className="mt-2 overflow-hidden rounded-xl border border-border">
                {matches.map((g) => (
                  <li key={g.id}>
                    <button
                      type="button"
                      onClick={() => pickGuest(g)}
                      className="flex w-full items-center gap-3 border-b border-border/60 bg-background px-3 py-2.5 text-left last:border-0 hover:bg-muted"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {initials(g.name)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-forest">{g.name}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {g.phone} · {g.visits} besök
                        </span>
                      </span>
                      {g.visits >= 5 && (
                        <span className="flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary">
                          <Star className="h-3 w-3" /> Stamgäst
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Vald profil */}
          {guest && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-forest">Återkommande gäst</p>
                <button
                  type="button"
                  onClick={clearGuest}
                  className="text-xs text-muted-foreground hover:text-forest"
                >
                  Koppla bort
                </button>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {guest.visits} besök · {guest.spend.toLocaleString("sv-SE")} kr · senast {guest.last}
              </p>
              {guest.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {guest.tags.map((t) => (
                    <span key={t} className="rounded-full bg-background px-2 py-0.5 text-[11px] text-forest">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Kontakt — alltid synliga rutor */}
          <div className="grid gap-2 sm:grid-cols-2">
            <ContactBox icon={<Phone className="h-4 w-4" />} label="Telefon">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                placeholder="+46 …"
                className="w-full bg-transparent text-sm text-forest outline-none"
              />
            </ContactBox>
            <ContactBox icon={<Mail className="h-4 w-4" />} label="E-post">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                inputMode="email"
                placeholder="namn@mail.se"
                className="w-full bg-transparent text-sm text-forest outline-none"
              />
            </ContactBox>
          </div>
          {!guest && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Gästens namn"
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          )}

          {/* Sällskap + tid */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border p-3">
              <p className="eyebrow text-muted-foreground">Antal gäster</p>
              <div className="mt-2 flex items-center justify-between">
                <Round onClick={() => setParty((p) => Math.max(1, p - 1))}>
                  <Minus className="h-4 w-4" />
                </Round>
                <span className="flex items-center gap-2 text-2xl font-medium text-forest">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  {party}
                </span>
                <Round onClick={() => setParty((p) => Math.min(60, p + 1))}>
                  <Plus className="h-4 w-4" />
                </Round>
              </div>
            </div>
            <div className="rounded-xl border border-border p-3">
              <p className="eyebrow text-muted-foreground">Tid</p>
              <div className="mt-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-transparent text-lg text-forest outline-none"
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {quickTimes.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTime(t)}
                    className={`rounded-full px-2 py-0.5 text-[11px] transition-colors ${
                      time === t ? "bg-primary/12 text-primary" : "text-muted-foreground hover:text-forest"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bordsval + lås */}
          <div className="rounded-xl border border-border p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="eyebrow text-muted-foreground">Välj {unit}</p>
              <span className="text-xs text-muted-foreground">
                {suggested.length} lediga för {party} pers
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setTable("");
                setLockedTable(false);
              }}
              className={`mt-2 flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                table === ""
                  ? "border-primary bg-primary/8 text-forest"
                  : "border-border text-muted-foreground hover:text-forest"
              }`}
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="min-w-0 flex-1">
                Låt Seytro placera automatiskt
                <span className="block text-xs text-muted-foreground">
                  AI optimerar {unit}splaceringen löpande
                </span>
              </span>
              {table === "" && <Check className="h-4 w-4 text-primary" />}
            </button>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {suggested.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setTable(u.label)}
                  className={`rounded-lg border px-2.5 py-1.5 text-xs transition-colors ${
                    table === u.label
                      ? "border-primary bg-primary/10 text-primary"
                      : u.status === "ledigt"
                        ? "border-border text-forest hover:bg-muted"
                        : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                  title={`${u.zone} · ${u.status}`}
                >
                  {u.label} · {u.seats}p
                  {u.status !== "ledigt" && (
                    <span className="ml-1 text-[10px] opacity-70">{u.status}</span>
                  )}
                </button>
              ))}
              {suggested.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Inga {unit} med plats för {party} gäster — AI söker kombination.
                </p>
              )}
            </div>

            <button
              type="button"
              disabled={!table}
              onClick={() => setLockedTable((v) => !v)}
              className={`mt-3 flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors disabled:opacity-50 ${
                lockedTable && table
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground"
              }`}
            >
              {lockedTable && table ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
              <span className="min-w-0 flex-1 text-left">
                {lockedTable && table ? `${unitWord} ${table} är låst` : `Lås ${unit}`}
                <span className="block text-xs text-muted-foreground">
                  AI får inte flytta bokningen vid optimering
                </span>
              </span>
            </button>
          </div>

          {/* Kanal + status */}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="eyebrow text-muted-foreground">Kanal</span>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as BookingSource)}
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
              >
                {["Telefon", "Webb", "Röstagent", "E-postconcierge", "Walk-in"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <div>
              <span className="eyebrow text-muted-foreground">Status</span>
              <div className="mt-1.5 flex gap-2">
                {(["väntar", "bekräftad"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm ${
                      status === s
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {s === "väntar" ? "Preliminär" : "Bekräftad"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Detaljer */}
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Företag (valfritt)"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
            />
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
            >
              <option value="">Tillfälle…</option>
              {["Middag", "Affärsmöte", "Födelsedag", "Årsdag", "Fest", "Turist"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Notering: önskemål, allergier, kommentar…"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
          />

          {/* Taggar (hopfällbart) */}
          <div className="rounded-xl border border-border p-3">
            <button
              type="button"
              onClick={() => setShowTags((v) => !v)}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="eyebrow text-muted-foreground">Taggar</span>
              <span className="text-xs text-muted-foreground">
                {tags.length ? `${tags.length} valda` : showTags ? "Dölj" : "Visa"}
              </span>
            </button>
            {tags.length > 0 && !showTags && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span key={t} className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary">
                    {t}
                  </span>
                ))}
              </div>
            )}
            {showTags && (
              <div className="mt-2 space-y-3">
                {tagGroups.map((g) => (
                  <div key={g.label}>
                    <p className="text-xs text-muted-foreground">{g.label}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {g.tags.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => toggleTag(t)}
                          className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                            tags.includes(t)
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-muted-foreground hover:text-forest"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PM direkt i bokningen */}
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-3">
            <button
              type="button"
              onClick={() => setPmOpen((v) => !v)}
              className="flex w-full items-start justify-between gap-3 text-left"
            >
              <span className="min-w-0">
                <span className="block text-xs font-medium text-primary">
                  Skapa PM direkt i bokningen
                </span>
                <span className="mt-0.5 block text-[11px] text-muted-foreground">
                  {party >= 8
                    ? `Sällskap på ${party} gäster — PM rekommenderas`
                    : "Fast meny, dryckespaket och speciella artiklar"}
                </span>
              </span>
              <span className="shrink-0 text-[11px] text-muted-foreground">
                {pmOpen ? "Dölj" : "Öppna"}
              </span>
            </button>

            {pmOpen && (
              <div className="mt-3 rounded-xl border border-border bg-card p-3">
                <PmComposer
                  compact
                  party={party}
                  templates={templates}
                  value={pmChoice}
                  onChange={setPmChoice}
                />
              </div>
            )}
          </div>


          <label className="flex items-start gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5"
            />
            Gästen samtycker till att spara uppgifter för erbjudanden och bättre service.
          </label>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2.5 text-sm text-muted-foreground"
          >
            Avbryt
          </button>
          <button
            type="button"
            onClick={save}
            className="min-w-0 flex-1 truncate rounded-lg bg-primary px-4 py-2.5 text-sm text-primary-foreground"
          >
            {table ? `Spara · ${unit} ${table}${lockedTable ? " (låst)" : ""}` : "Spara · AI placerar"}
          </button>
        </div>
      </aside>
    </div>
  );
}

function ContactBox({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-background px-3 py-2">
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Round({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-10 w-10 place-items-center rounded-full border border-border text-forest hover:bg-muted"
    >
      {children}
    </button>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}
