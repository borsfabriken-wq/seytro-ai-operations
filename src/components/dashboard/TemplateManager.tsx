import { useState } from "react";
import { Plus, Sparkles, Trash2, Wine } from "lucide-react";
import { toast } from "sonner";

import { kr } from "@/lib/pm";
import {
  buildTemplate,
  templateKinds,
  type MenuTemplate,
  type TemplateKind,
} from "@/lib/pm-templates";

type DraftLine = { name: string; desc: string; price: string };

const emptyLine = (): DraftLine => ({ name: "", desc: "", price: "" });

/**
 * Restaurangens mallbibliotek: menyer och dryckespaket som Seytro AI använder
 * när den bygger PM automatiskt för förbeställda sällskap.
 */
export function TemplateManager({
  templates,
  onAdd,
  onRemove,
}: {
  templates: MenuTemplate[];
  onAdd: (t: MenuTemplate) => void;
  onRemove: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState<TemplateKind>("meny");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [lines, setLines] = useState<DraftLine[]>([emptyLine()]);

  const reset = () => {
    setLabel("");
    setKind("meny");
    setPrice("");
    setDesc("");
    setLines([emptyLine()]);
    setOpen(false);
  };

  const save = () => {
    if (!label.trim()) {
      toast.error("Ge mallen ett namn.");
      return;
    }
    const filled = lines.filter((l) => l.name.trim());
    onAdd(
      buildTemplate({
        label: label.trim(),
        kind,
        price: Number(price) || 0,
        desc: desc.trim(),
        lines: filled.map((l) => ({
          name: l.name.trim(),
          ...(l.desc.trim() ? { desc: l.desc.trim() } : {}),
          ...(Number(l.price) ? { price: Number(l.price) } : {}),
        })),
      }),
    );
    toast.success("Mall sparad", {
      description: "Seytro AI kan nu bygga PM med den här mallen.",
    });
    reset();
  };

  const input =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-forest outline-none placeholder:text-muted-foreground focus:border-primary";

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="inline-flex items-center gap-2 text-base font-medium text-forest">
              <Wine className="h-4 w-4 text-primary" /> Mallar för menyer och dryck
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Lägg in era fasta menyer och dryckespaket — Seytro AI använder dem för att
              administrera och bygga PM åt förbeställda sällskap.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-forest px-4 py-2 text-sm text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Ny mall
          </button>
        </div>

        {open && (
          <div className="mt-5 space-y-4 rounded-xl border border-dashed border-border p-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="block text-xs text-muted-foreground">
                Namn
                <input
                  className={`mt-1 ${input}`}
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Meny 3 – fyra rätter"
                />
              </label>
              <label className="block text-xs text-muted-foreground">
                Typ
                <select
                  className={`mt-1 ${input}`}
                  value={kind}
                  onChange={(e) => setKind(e.target.value as TemplateKind)}
                >
                  {templateKinds.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs text-muted-foreground">
                Pris per gäst (kr)
                <input
                  className={`mt-1 ${input}`}
                  value={price}
                  inputMode="numeric"
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="895"
                />
              </label>
            </div>
            <label className="block text-xs text-muted-foreground">
              Beskrivning
              <input
                className={`mt-1 ${input}`}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Förrätt · fisk · kött · dessert"
              />
            </label>

            <div>
              <p className="text-xs text-muted-foreground">Rader (rätter eller glas)</p>
              <div className="mt-2 space-y-2">
                {lines.map((l, i) => (
                  <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1.4fr_7rem_auto]">
                    <input
                      className={input}
                      value={l.name}
                      onChange={(e) =>
                        setLines((prev) =>
                          prev.map((p, j) => (i === j ? { ...p, name: e.target.value } : p)),
                        )
                      }
                      placeholder="Rätt / dryck"
                    />
                    <input
                      className={input}
                      value={l.desc}
                      onChange={(e) =>
                        setLines((prev) =>
                          prev.map((p, j) => (i === j ? { ...p, desc: e.target.value } : p)),
                        )
                      }
                      placeholder="Beskrivning"
                    />
                    <input
                      className={input}
                      value={l.price}
                      inputMode="numeric"
                      onChange={(e) =>
                        setLines((prev) =>
                          prev.map((p, j) => (i === j ? { ...p, price: e.target.value } : p)),
                        )
                      }
                      placeholder="Pris"
                    />
                    <button
                      type="button"
                      onClick={() => setLines((prev) => prev.filter((_, j) => j !== i))}
                      className="justify-self-start p-2 text-muted-foreground hover:text-destructive"
                      aria-label="Ta bort rad"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setLines((prev) => [...prev, emptyLine()])}
                className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary"
              >
                <Plus className="h-3.5 w-3.5" /> Lägg till rad
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={save}
                className="rounded-full bg-forest px-4 py-2 text-sm text-primary-foreground"
              >
                Spara mall
              </button>
              <button
                type="button"
                onClick={reset}
                className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground"
              >
                Avbryt
              </button>
            </div>
          </div>
        )}
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((t) => (
          <article key={t.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-forest">{t.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {templateKinds.find((k) => k.id === t.kind)?.label}
                  {t.price ? ` · ${kr(t.price)} per gäst` : ""}
                </p>
              </div>
              {t.custom && (
                <button
                  type="button"
                  onClick={() => onRemove(t.id)}
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  aria-label="Ta bort mall"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            {t.desc && <p className="mt-2 text-xs text-muted-foreground">{t.desc}</p>}
            <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
              {t.sections.flatMap((s) => s.lines).slice(0, 5).map((l) => (
                <li key={l.id} className="truncate">
                  · {l.name}
                  {l.price ? ` (${kr(l.price)})` : ""}
                </li>
              ))}
            </ul>
            <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-primary">
              <Sparkles className="h-3 w-3" /> Används av Seytro AI
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
