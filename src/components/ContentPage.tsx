import { Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArrowRight, type LucideIcon } from "lucide-react";

export type ContentBlock = { title: string; text: string };
export type ContentCard = { icon: LucideIcon; title: string; text: string };

export function ContentPage({
  eyebrow,
  title,
  lead,
  intro,
  sectionTitle,
  blocks,
  cardsEyebrow = "Nyckelpunkter",
  cardsTitle,
  cards,
  ctaTitle,
  ctaText,
  ctaSubject,
  steps,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  intro: string[];
  sectionTitle: string;
  blocks: ContentBlock[];
  cardsEyebrow?: string;
  cardsTitle: string;
  cards: ContentCard[];
  ctaTitle: string;
  ctaText: string;
  ctaSubject: string;
  steps: string[];
}) {
  const mailto = `mailto:hej@seytro.com?subject=${encodeURIComponent(ctaSubject)}`;

  return (
    <div className="bg-background text-foreground">
      <SiteHeader />

      <section className="relative min-h-[80vh] overflow-hidden bg-forest-deep text-primary-foreground">
        <div className="relative mx-auto flex min-h-[80vh] max-w-7xl flex-col justify-end px-6 pb-24 pt-40 sm:px-10">
          <p className="mb-8 max-w-xl text-sm uppercase tracking-[0.28em] text-primary-foreground/60">
            {eyebrow}
          </p>
          <h1 className="max-w-4xl text-5xl leading-[1.02] sm:text-7xl lg:text-8xl">{title}</h1>
          <p className="fade-up mt-8 max-w-2xl text-2xl leading-snug text-primary-foreground/90 sm:text-3xl">
            {lead}
          </p>
          <div className="fade-up mt-10 flex flex-wrap items-center gap-4">
            <a
              href={mailto}
              className="rounded-full bg-primary-foreground px-8 py-4 text-sm font-medium text-forest-deep transition-opacity hover:opacity-90"
            >
              Boka demo
            </a>
            <Link
              to="/"
              className="rounded-full border border-primary-foreground/40 px-8 py-4 text-sm text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Tillbaka till startsidan
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-28 sm:px-10">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Översikt</p>
        {intro.map((p, i) => (
          <p
            key={p}
            className={`max-w-2xl leading-relaxed text-muted-foreground ${
              i === 0 ? "mt-8 text-lg" : "mt-6 text-lg"
            }`}
          >
            {p}
          </p>
        ))}
      </section>

      <section className="bg-muted/50">
        <div className="mx-auto max-w-7xl px-6 py-28 sm:px-10">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Så fungerar det</p>
          <h2 className="mt-6 max-w-3xl text-3xl leading-tight sm:text-4xl">{sectionTitle}</h2>

          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            {blocks.map((b) => (
              <div key={b.title} className="border-l-2 border-forest pl-6">
                <h3 className="text-xl font-medium">{b.title}</h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-28 sm:px-10">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">{cardsEyebrow}</p>
        <h2 className="mt-6 max-w-2xl text-3xl leading-tight sm:text-4xl">{cardsTitle}</h2>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ icon: Icon, title: t, text }) => (
            <div
              key={t}
              className="rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-lg"
            >
              <div className="grid h-12 w-12 place-items-center rounded-full bg-forest/10">
                <Icon className="h-5 w-5 text-forest" strokeWidth={1.5} />
              </div>
              <h3 className="mt-6 text-lg font-medium">{t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-forest-deep text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 py-28 sm:px-10">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-primary-foreground/60">
                Kom igång
              </p>
              <h2 className="mt-6 text-3xl leading-tight sm:text-4xl">{ctaTitle}</h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
                {ctaText}
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href={mailto}
                  className="inline-flex items-center gap-2 rounded-full bg-primary-foreground px-8 py-4 text-sm font-medium text-forest-deep transition-opacity hover:opacity-90"
                >
                  Hör av dig
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div className="rounded-2xl bg-primary-foreground/5 p-8 sm:p-12">
              <ol className="space-y-8">
                {steps.map((step, i) => (
                  <li key={step} className="flex items-start gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary-foreground/30 text-sm font-medium">
                      {i + 1}
                    </span>
                    <span className="pt-1 text-lg leading-relaxed text-primary-foreground/90">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
