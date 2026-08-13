import type { Venue } from "@/lib/dashboard-data";

/** Vilken typ av konto som är inloggat. */
export type AccountPlan = "restaurang" | "hotell" | "hybrid";

const KEY = "seytro-account";

export const accountPlans: {
  id: AccountPlan;
  label: string;
  org: string;
  description: string;
  venues: Venue[];
}[] = [
  {
    id: "restaurang",
    label: "Restaurang",
    org: "Brasserie Astrid",
    description: "Salsplan, bokningar, PM och gästregister.",
    venues: ["restaurang"],
  },
  {
    id: "hotell",
    label: "Hotell",
    org: "Hotell Astrid",
    description: "Ankomster, avresor, rumsstatus och housekeeping.",
    venues: ["hotell"],
  },
  {
    id: "hybrid",
    label: "Hotell med restaurang",
    org: "Astrid Hospitality",
    description: "Hybridvy där du växlar mellan hotell- och restaurangdrift.",
    venues: ["hotell", "restaurang"],
  },
];

export function venuesForPlan(plan: AccountPlan): Venue[] {
  return accountPlans.find((p) => p.id === plan)?.venues ?? ["restaurang"];
}

export function readAccountPlan(): AccountPlan {
  if (typeof window === "undefined") return "hybrid";
  const stored = window.localStorage.getItem(KEY);
  return stored === "restaurang" || stored === "hotell" || stored === "hybrid"
    ? stored
    : "hybrid";
}

export function writeAccountPlan(plan: AccountPlan) {
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, plan);
}
