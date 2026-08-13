import { useState } from "react";
import { Delete, X } from "lucide-react";
import type { Booking, BookingSource } from "@/lib/dashboard-data";

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

export function BookingDialog({
  open,
  unitWord,
  onClose,
  onSave,
}: {
  open: boolean;
  unitWord: string;
  onClose: () => void;
  onSave: (draft: NewBookingDraft) => void;
}) {
  const [party, setParty] = useState("2");
  const [time, setTime] = useState("19:00");
  const [name, setName] = useState("");
  const [source, setSource] = useState<BookingSource>("Telefon");
  const [status, setStatus] = useState<"väntar" | "bekräftad">("väntar");
  const [tags, setTags] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [pm, setPm] = useState("");

  if (!open) return null;

  const partyNumber = Number(party || "0");
  const showPm = partyNumber >= 8;

  const press = (key: string) => {
    if (key === "del") setParty((p) => p.slice(0, -1));
    else setParty((p) => (p === "0" ? key : (p + key).slice(0, 3)));
  };

  const toggleTag = (t: string) =>
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const save = () => {
    onSave({
      time,
      name: name.trim() || "Ny gäst",
      party: Math.max(1, partyNumber),
      table: "",
      status,
      source,
      note: [note.trim(), pm.trim()].filter(Boolean).join("\n\n") || undefined,
      tags,
      placed: false,
    });
    setParty("2");
    setName("");
    setTags([]);
    setNote("");
    setPm("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/40 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-3xl rounded-2xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-subheading text-forest">Ny bokning</h2>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-forest">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-6 p-5 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <p className="eyebrow text-muted-foreground">Antal gäster</p>
              <div className="mt-2 rounded-xl border border-border p-3">
                <p className="text-center text-3xl font-medium text-forest">{party || "0"}</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => press(k)}
                      className="rounded-lg border border-border py-2 text-sm text-forest hover:bg-muted"
                    >
                      {k}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => press("del")}
                    className="col-span-2 flex items-center justify-center gap-2 rounded-lg border border-border py-2 text-sm text-muted-foreground hover:bg-muted"
                  >
                    <Delete className="h-4 w-4" /> Rensa
                  </button>
                </div>
              </div>
            </div>

            <Field label="Tid">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
              />
            </Field>

            <Field label="Gäst">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Namn"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
              />
            </Field>

            <Field label="Kanal">
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as BookingSource)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
              >
                {["Telefon", "Webb", "Röstagent", "E-postconcierge", "Walk-in"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>

            <Field label="Status">
              <div className="flex gap-2">
                {(["väntar", "bekräftad"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm capitalize ${
                      status === s
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {s === "väntar" ? "Preliminär" : "Bekräftad"}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <div className="space-y-4">
            <div>
              <p className="eyebrow text-muted-foreground">Taggar</p>
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
            </div>

            <Field label="Notering">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Önskemål, allergier, kommentar…"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
              />
            </Field>

            {showPm && (
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-3">
                <p className="text-xs font-medium text-primary">
                  Sällskap på {partyNumber} gäster — skapa PM
                </p>
                <select
                  value=""
                  onChange={(e) => {
                    const tpl = pmTemplates.find((t) => t.label === e.target.value);
                    if (tpl) setPm(tpl.text);
                  }}
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
                >
                  <option value="">Välj mall…</option>
                  {pmTemplates.map((t) => (
                    <option key={t.label}>{t.label}</option>
                  ))}
                </select>
                <textarea
                  value={pm}
                  onChange={(e) => setPm(e.target.value)}
                  rows={6}
                  placeholder="PM för sällskapet…"
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground"
          >
            Avbryt
          </button>
          <button
            type="button"
            onClick={save}
            className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            Spara bokning ({unitWord.toLowerCase()} väljs sen)
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
