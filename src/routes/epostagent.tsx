import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  Mail,
  Inbox,
  Tag,
  User,
  Users,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/epostagent")({
  head: () => ({
    meta: [
      { title: "E-postagent — Seytro" },
      {
        name: "description",
        content:
          "Seytros E-postagent svarar på mejl på sekunder — hanterar stora sällskap, set menus, specialkost och bokningsförfrågningar i restaurangens egen ton.",
      },
      { property: "og:title", content: "E-postagent — Seytro" },
      {
        property: "og:description",
        content:
          "Ert viktigaste bokningsflöde, hanterat. AI svarar på mejlen så ingen gäst glider iväg till en annan restaurang.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailAgentPage,
});

const benefits = [
  {
    icon: Clock,
    title: "Svar på sekunder",
    text: "Gäster får svar på minuter, inte timmar. Större förfrågningar hanteras innan de hinner leta vidare.",
  },
  {
    icon: Sparkles,
    title: "Djup kunskap",
    text: "Agenten känner till menyer, specialkost, regler och salslayout — och svarar med er bästa servitörs säkerhet.",
  },
  {
    icon: Mail,
    title: "Ton som passar er",
    text: "Varje svar speglar restaurangens personlighet och servicestil, från avslappnad till formell.",
  },
  {
    icon: Tag,
    title: "Smart sortering",
    text: "Mejlen kategoriseras och skickas till rätt person när de behöver en mänsklig touch.",
  },
  {
    icon: Users,
    title: "Stora sällskap",
    text: "Set menu-diskussioner, minsta förbrukning, bordsplacering för 15, 20 eller fler — hanterat från start till mål.",
  },
  {
    icon: FileText,
    title: "Full spårbarhet",
    text: "Varje mejlkonversation loggas och blir sökbar, så ni aldrig tappar bort detaljer.",
  },
];

function EmailAgentPage() {
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />

      <section className="relative min-h-[70svh] sm:min-h-[80svh] overflow-hidden bg-forest-deep text-primary-foreground">
        <div className="site-container relative flex min-h-[70svh] sm:min-h-[80svh] flex-col justify-end pb-16 pt-32 sm:pb-24 sm:pt-40">
          <p className="mb-8 max-w-xl text-sm uppercase tracking-[0.28em] text-primary-foreground/60">
            Produkt
          </p>
          <h1 className="max-w-4xl text-5xl leading-[1.02] sm:text-7xl lg:text-8xl">
            E-postagent
          </h1>
          <p className="fade-up mt-8 max-w-2xl text-2xl leading-snug text-primary-foreground/90 sm:text-3xl">
            Era viktigaste bokningar, hanterade.
          </p>
          <p className="fade-up mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
            Stora sällskap, set menus, specialkost. Varje mejl får ett snabbt och genomtänkt svar
            så att ingen gäst glider vidare till någon annan.
          </p>
          <div className="fade-up mt-10 flex flex-wrap items-center gap-4">
            <a
              href="mailto:hej@seytro.com?subject=Boka%20demo%20av%20E-postagent"
              className="rounded-full bg-primary-foreground px-8 py-4 text-sm font-medium text-forest-deep transition-opacity hover:opacity-90"
            >
              Boka demo
            </a>
            <Link
              to="/"
              hash="pelare"
              className="rounded-full border border-primary-foreground/40 px-8 py-4 text-sm text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Se hela plattformen
            </Link>
          </div>
        </div>
      </section>

      <section className="site-container section-y">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Översikt</p>
        <h2 className="mt-6 max-w-3xl text-3xl sm:text-[2.6rem]">
          De bokningar som betyder mest är ofta de svåraste att hinna med.
        </h2>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Ett sällskap på tjugo som frågar om set menu. En företagskund med specialkost för halva
          bordet. En återkommande gäst som vill ha sitt vanliga privata rum. Det är mejlen som
          ligger kvar i inkorgen timme efter timme medan intäkten går någon annanstans.
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Seytros E-postagent svarar direkt. Den känner era menyer, bokningsregler, salslayout och
          er servicestil. När en stor förfrågan kommer klockan 21 en tisdag går svaret ut på
          minuter, inte nästa morgon — då har gästen redan bokat hos någon annan.
        </p>
      </section>

      <section className="bg-muted/50">
        <div className="site-container section-y">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Så fungerar det</p>
          <h2 className="mt-6 max-w-3xl text-3xl sm:text-[2.6rem]">
            Varje mejl tolkas, besvaras och hamnar på rätt ställe.
          </h2>

          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Svar i er ton</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Agenten läser varje inkommande meddelande, förstår avsikten och formulerar ett svar
                som låter som ert hus. Den kan diskutera set menus, upprätthålla regler för
                privatmiddagar, bekräfta specialkost utifrån er faktiska meny och berätta exakt var
                gästen kommer att sitta.
              </p>
            </div>
            <div className="border-l-2 border-forest pl-6">
              <h3 className="text-xl font-medium">Taggat och eskalerat</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Mejlen sorteras automatiskt — bokningsförfrågningar, allmänna frågor,
                leverantörsmejl, pressförfrågningar. När något behöver en mänsklig hand vidarebefordras
                det till rätt person med full kontext.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container section-y">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Nyckelfördelar</p>
        <h2 className="mt-6 max-w-2xl text-3xl sm:text-[2.6rem]">
          Så hjälper E-postagenten er att växa.
        </h2>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-raised"
            >
              <div className="grid h-12 w-12 place-items-center rounded-full bg-forest/10">
                <Icon className="h-5 w-5 text-forest" strokeWidth={1.5} />
              </div>
              <h3 className="mt-6 text-lg font-medium">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-forest-deep text-primary-foreground">
        <div className="site-container section-y">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-primary-foreground/60">
                Kom igång
              </p>
              <h2 className="mt-6 text-3xl sm:text-[2.6rem]">
                Koppla inkorgen — så börjar agenten svara.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
                Anslut restaurangens mejl och E-postagenten börjar bearbeta meddelanden direkt.
                Ställ in svarspreferenser, konfigurera era regler och låt Seytro se till att era
                värdefullaste förfrågningar får den uppmärksamhet de förtjänar.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="mailto:hej@seytro.com?subject=Boka%20demo%20av%20E-postagent"
                  className="inline-flex items-center gap-2 rounded-full bg-primary-foreground px-8 py-4 text-sm font-medium text-forest-deep transition-opacity hover:opacity-90"
                >
                  Boka demo
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  to="/"
                  className="rounded-full border border-primary-foreground/40 px-8 py-4 text-sm text-primary-foreground transition-colors hover:bg-primary-foreground/10"
                >
                  Tillbaka till startsidan
                </Link>
              </div>
            </div>
            <div className="rounded-2xl bg-primary-foreground/5 p-8 sm:p-12">
              <ol className="space-y-8">
                {[
                  "Koppla er restaurangmejl till Seytro.",
                  "Ställ in svarston, regler och eskalering.",
                  "Låt agenten börja svara — dygnet runt.",
                ].map((step, i) => (
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
