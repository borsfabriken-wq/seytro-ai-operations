/**
 * Delad lagring för PM som skapas utanför PM-vyn, t.ex. direkt i samband
 * med en manuell bokning. Sparas lokalt så att PM-vyn kan visa dem.
 */
import { useSyncExternalStore } from "react";

import type { PmDoc } from "@/lib/pm";

const KEY = "seytro-pm-docs";

let docs: PmDoc[] = [];
let loaded = false;
const subscribers = new Set<() => void>();

const load = () => {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) docs = JSON.parse(raw) as PmDoc[];
  } catch {
    /* ignorera trasig lagring */
  }
};

const persist = () => {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(docs));
  } catch {
    /* ignorera */
  }
  subscribers.forEach((fn) => fn());
};

export function addPmDoc(doc: PmDoc) {
  load();
  docs = [doc, ...docs];
  persist();
}

export function updatePmDoc(doc: PmDoc) {
  load();
  docs = docs.map((d) => (d.id === doc.id ? doc : d));
  persist();
}

export function removePmDoc(id: string) {
  load();
  docs = docs.filter((d) => d.id !== id);
  persist();
}

const EMPTY: PmDoc[] = [];

export function usePmDocs() {
  return useSyncExternalStore(
    (fn) => {
      subscribers.add(fn);
      return () => subscribers.delete(fn);
    },
    () => {
      load();
      return docs;
    },
    () => EMPTY,
  );
}
