import { Minus, Plus, Printer, Trash2 } from "lucide-react";
import { templateKinds, type MenuTemplate } from "@/lib/pm-templates";
import {
  kr,
  lineTotal,
  pmStatusStyles,
  pmTotal,
  sectionTotal,
  splitTotal,
  uid,
  type PmDoc,
  type PmLine,
  type PmSection,
} from "@/lib/pm";

/**
 * Visar ett PM som köket och salen kan läsa rakt av: menyfördelning,
 * rätter per sektion, dryck, kassaunderlag och fakturauppgifter.
 * Med `onChange` blir arket redigerbart (antal, ta bort, lägg till mall).
 */
export function PmSheet({
  doc,
  onChange,
  templates = [],
}: {
  doc: PmDoc;
  onChange?: (next: PmDoc) => void;
  templates?: MenuTemplate[];
}) {
  const editable = Boolean(onChange);

  const setLine = (sectionId: string | "split", lineId: string, patch: Partial<PmLine>) => {
    if (!onChange) return;
    if (sectionId === "split") {
      onChange({
        ...doc,
        split: doc.split.map((l) => (l.id === lineId ? { ...l, ...patch } : l)),
      });
      return;
    }
    onChange({
      ...doc,
      sections: doc.sections.map((s) =>
        s.id === sectionId
          ? { ...s, lines: s.lines.map((l) => (l.id === lineId ? { ...l, ...patch } : l)) }
          : s,
      ),
    });
  };

  const removeLine = (sectionId: string | "split", lineId: string) => {
    if (!onChange) return;
    if (sectionId === "split") {
      onChange({ ...doc, split: doc.split.filter((l) => l.id !== lineId) });
      return;
    }
    onChange({
      ...doc,
      sections: doc.sections
        .map((s) => (s.id === sectionId ? { ...s, lines: s.lines.filter((l) => l.id !== lineId) } : s))
        .filter((s) => s.lines.length > 0),
    });
  };

  const addTemplate = (templateId: string) => {
    if (!onChange) return;
    const tpl = templates.find((t) => t.id === templateId);
    if (!tpl) return;
    const sections: PmSection[] = tpl.sections.map((s) => ({
      ...s,
      id: uid("s"),
      lines: s.lines.map((l) => ({ ...l, id: uid(), qty: l.qty || doc.party })),
    }));
    const split =
      tpl.price && tpl.kind === "meny"
        ? [...doc.split, { id: uid("sp"), qty: doc.party, name: tpl.label, price: tpl.price }]
        : doc.split;
    onChange({ ...doc, split, sections: [...doc.sections, ...sections] });
  };

  const total = pmTotal(doc);

  return (
    <div id="pm-print" className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow text-muted-foreground">PM · förbeställning</p>
          <h2 className="text-subheading text-forest">{doc.title}</h2>
          <p className="text-caption text-muted-foreground">
            {doc.date} · {doc.time} · {doc.party} personer
            {doc.contact ? ` · ${doc.contact}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs ${pmStatusStyles[doc.status]}`}>
            {doc.status}
          </span>
          <button
            type="button"
            onClick={() => window.print()}
            data-print-hide
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-forest"
          >
            <Printer className="h-3.5 w-3.5" /> Skriv ut till köket
          </button>
        </div>
      </div>

      {doc.allergies && (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-700">
          Allergier och önskemål: {doc.allergies}
        </p>
      )}

      {/* Menyfördelning */}
      <Block title="Menyfördelning" amount={splitTotal(doc)}>
        {doc.split.map((l) => (
          <LineRow
            key={l.id}
            line={l}
            editable={editable}
            onQty={(qty) => setLine("split", l.id, { qty })}
            onRemove={() => removeLine("split", l.id)}
          />
        ))}
      </Block>

      {doc.sections.map((s) => (
        <Block key={s.id} title={s.title} amount={sectionTotal(s)} note={s.note}>
          {s.lines.map((l) => (
            <LineRow
              key={l.id}
              line={l}
              editable={editable}
              onQty={(qty) => setLine(s.id, l.id, { qty })}
              onRemove={() => removeLine(s.id, l.id)}
            />
          ))}
        </Block>
      ))}

      {editable && (
        <div data-print-hide className="rounded-xl border border-dashed border-border p-3">
          <p className="eyebrow text-muted-foreground">Lägg till från dina mallar</p>
          {templateKinds.map((kind) => {
            const list = templates.filter((t) => t.kind === kind.id);
            if (list.length === 0) return null;
            return (
              <div key={kind.id} className="mt-3">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {kind.label}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {list.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => addTemplate(t.id)}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary hover:text-primary"
                      title={t.desc}
                    >
                      <Plus className="mr-1 inline h-3 w-3" />
                      {t.label}
                      {t.price ? ` · ${kr(t.price)}` : ""}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Kassa */}
      <div className="rounded-xl bg-muted/50 p-4">
        <p className="eyebrow text-muted-foreground">Kassa / underlag</p>
        <ul className="mt-2 space-y-1 text-sm">
          <SumRow label="Menyer" value={splitTotal(doc)} />
          {doc.sections.map((s) => (
            <SumRow key={s.id} label={s.title} value={sectionTotal(s)} />
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="text-sm font-medium text-forest">Totalt pris</span>
          <span className="text-lg font-medium text-forest">{kr(total)}</span>
        </div>
      </div>

      {doc.invoice && (
        <div className="rounded-xl border border-border p-4 text-sm">
          <p className="eyebrow text-muted-foreground">Fakturauppgifter</p>
          <p className="mt-2 font-medium text-forest">{doc.invoice.recipient}</p>
          {doc.invoice.address.map((a) => (
            <p key={a} className="text-muted-foreground">
              {a}
            </p>
          ))}
          <dl className="mt-3 grid gap-x-6 gap-y-1 text-xs text-muted-foreground sm:grid-cols-2">
            {doc.invoice.gln && <Meta label="GLN" value={doc.invoice.gln} />}
            {doc.invoice.van && <Meta label="VAN-leverantör" value={doc.invoice.van} />}
            {doc.invoice.peppol && <Meta label="Peppol-ID" value={doc.invoice.peppol} />}
            {doc.invoice.email && <Meta label="PDF-faktura" value={doc.invoice.email} />}
            {doc.invoice.reference && <Meta label="Referens" value={doc.invoice.reference} />}
          </dl>
        </div>
      )}
    </div>
  );
}

function Block({
  title,
  amount,
  note,
  children,
}: {
  title: string;
  amount: number;
  note?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-forest">{title}</h3>
        {amount > 0 && <span className="text-xs text-muted-foreground">{kr(amount)}</span>}
      </div>
      <ul className="divide-y divide-border/60">{children}</ul>
      {note && <p className="px-4 py-2 text-xs text-muted-foreground">{note}</p>}
    </section>
  );
}

function LineRow({
  line,
  editable,
  onQty,
  onRemove,
}: {
  line: PmLine;
  editable: boolean;
  onQty: (qty: number) => void;
  onRemove: () => void;
}) {
  return (
    <li className="flex items-start gap-3 px-4 py-2.5">
      {editable ? (
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onQty(Math.max(0, line.qty - 1))}
            className="rounded border border-border p-1 text-muted-foreground hover:text-forest"
            aria-label="Minska antal"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-7 text-center text-sm font-medium text-forest">{line.qty}</span>
          <button
            type="button"
            onClick={() => onQty(line.qty + 1)}
            className="rounded border border-border p-1 text-muted-foreground hover:text-forest"
            aria-label="Öka antal"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <span className="w-10 shrink-0 text-sm font-medium text-forest">{line.qty} ×</span>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm text-forest">{line.name}</p>
        {line.desc && <p className="text-xs text-muted-foreground">{line.desc}</p>}
      </div>
      <div className="shrink-0 text-right">
        {line.price ? (
          <>
            <p className="text-sm text-forest">{kr(lineTotal(line))}</p>
            <p className="text-[11px] text-muted-foreground">à {kr(line.price)}</p>
          </>
        ) : (
          <p className="text-[11px] text-muted-foreground">ingår i meny</p>
        )}
      </div>
      {editable && (
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 text-muted-foreground hover:text-destructive"
          aria-label="Ta bort rad"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </li>
  );
}

function SumRow({ label, value }: { label: string; value: number }) {
  if (!value) return null;
  return (
    <li className="flex items-center justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="text-forest">{kr(value)}</span>
    </li>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="shrink-0">{label}:</dt>
      <dd className="break-all text-forest">{value}</dd>
    </div>
  );
}
