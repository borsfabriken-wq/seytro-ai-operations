import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, Hotel, Plus, Sparkles, UtensilsCrossed } from "lucide-react";

import { accountPlans, writeAccountPlan, type AccountPlan } from "@/lib/account";
import { readSetup, type VenueSetup } from "@/lib/onboarding";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Logga in — Seytro" },
      {
        name: "description",
        content:
          "Logga in på Seytro och kom direkt till din drift: restaurang, hotell eller hybridvy för hotell med restaurang.",
      },
      { property: "og:title", content: "Logga in — Seytro" },
      {
        property: "og:description",
        content: "Kom direkt till din drift i Seytro: restaurang, hotell eller hybrid.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

const icons: Record<AccountPlan, typeof Hotel> = {
  restaurang: UtensilsCrossed,
  hotell: Hotel,
  hybrid: Building2,
  custom: Sparkles,
};

function LoginPage() {
  const navigate = useNavigate();
  const [ownSetup, setOwnSetup] = useState<VenueSetup | null>(null);

  useEffect(() => setOwnSetup(readSetup()), []);

  const signIn = (plan: AccountPlan, venue?: string) => {
    writeAccountPlan(plan);
    window.localStorage.setItem(
      "seytro-venue",
      venue ?? (plan === "restaurang" ? "restaurang" : "hotell"),
    );
    navigate({ to: "/dashboard" });
  };

  return (
    <main className="min-h-[100svh] bg-muted/40 px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="text-sm text-muted-foreground hover:text-forest">
          ← Till startsidan
        </Link>
        <h1 className="mt-6 text-3xl sm:text-4xl">Logga in</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Välj ditt konto. Vyn anpassas efter verksamheten — bara restaurang, bara hotell,
          eller en hybridvy när hotellet har restaurang.
        </p>

        {ownSetup && (
          <div className="mt-8">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Din verksamhet
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
                <Sparkles className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{ownSetup.org || "Namnlös verksamhet"}</span>
                <span className="block text-sm text-muted-foreground">
                  {ownSetup.tables.length} bord · {ownSetup.zones.length} zoner · egen uppsättning
                </span>
              </span>
              <Link
                to="/onboarding"
                className="rounded-xl border border-border bg-background px-4 py-2 text-sm"
              >
                Redigera
              </Link>
              <button
                type="button"
                onClick={() =>
                  signIn("custom", ownSetup.type === "hotell" ? "hotell" : "restaurang")
                }
                className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Öppna drift
              </button>
            </div>
          </div>
        )}

        <p className="mt-8 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Demokonton
        </p>
        <div className="mt-2 grid gap-4">
          {accountPlans.map((plan) => {
            const Icon = icons[plan.id];
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => signIn(plan.id)}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-background p-5 text-left transition-colors hover:border-forest/40"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-forest/8 text-forest">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{plan.org}</span>
                  <span className="block text-sm text-muted-foreground">
                    {plan.label} · {plan.description}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </button>
            );
          })}
        </div>

        <Link
          to="/onboarding"
          className="group mt-4 flex items-center gap-4 rounded-2xl border border-dashed border-border bg-background p-5 transition-colors hover:border-primary/50"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <Plus className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-medium">Onboarda en ny restaurang</span>
            <span className="block text-sm text-muted-foreground">
              Bygg allt från grunden — öppettider, zoner, bordskarta, bokningsregler och AI-kanaler.
            </span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </main>
  );
}
