import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { PmSheet } from "@/components/dashboard/PmSheet";
import { pmDocs, type PmDoc } from "@/lib/pm";

/** Röd bok-ikon som markerar att bokningen har en förbeställning (PM). */
export function PmBookIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M4 4.5A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6.5A2.5 2.5 0 0 0 4 21.5V4.5Z"
        fill="#c0392b"
      />
      <path d="M8 2v17" stroke="#fff" strokeWidth="1.2" opacity="0.7" />
      <path d="M11.5 6.5h5M11.5 9.5h5" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/** Öppnar hela PM:et i en ruta ovanpå vyn. */
export function PmModal({ pmId, onClose }: { pmId: string | null; onClose: () => void }) {
  const [doc, setDoc] = useState<PmDoc | null>(null);

  useEffect(() => {
    setDoc(pmId ? (pmDocs.find((d) => d.id === pmId) ?? null) : null);
  }, [pmId]);

  useEffect(() => {
    if (!pmId) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pmId, onClose]);

  if (!pmId || !doc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-forest/40 p-4 backdrop-blur-sm sm:p-8">
      <button type="button" aria-label="Stäng" className="fixed inset-0 cursor-default" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl rounded-3xl border border-border bg-card shadow-overlay">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <p className="eyebrow text-muted-foreground">PM #{doc.id}</p>
            <p className="truncate text-forest">
              {doc.title} · {doc.party} pers · {doc.date} {doc.time}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto p-5">
          <PmSheet doc={doc} onChange={setDoc} />
        </div>
      </div>
    </div>
  );
}
