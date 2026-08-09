import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/ContentPage";
import { CalendarCheck, Users, Clock, Webhook, KeyRound, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/resurser/api")({
  head: () => ({
    meta: [
      { title: "API-dokumentation — Seytro" },
      { name: "description", content: "Integrera Seytro med era system: bokningar, gästdata, händelser och webhooks." },
      { property: "og:title", content: "API-dokumentation — Seytro" },
      { property: "og:description", content: "Integrera Seytro med era system: bokningar, gästdata, händelser och webhooks." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ApiPage,
});

const blocks = [
  { title: "REST och webhooks", text: "Läs och skriv över HTTPS med JSON. Prenumerera på händelser via webhooks för att hålla era system i synk utan pollning." },
  { title: "Tydliga behörigheter", text: "Varje nyckel har avgränsad åtkomst. Du styr exakt vilka data en integration får läsa och skriva." },
];

const cards = [
  { icon: CalendarCheck, title: "Bokningar", text: "Skapa, ändra och avboka från era egna gränssnitt med samma regler som i Seytro." },
  { icon: Users, title: "Gästprofiler", text: "Hämta preferenser och besökshistorik för att personalisera mötet i era system." },
  { icon: Clock, title: "Tillgänglighet", text: "Fråga efter lediga tider i realtid och visa dem var ni vill." },
  { icon: Webhook, title: "Händelser", text: "Få notiser när en bokning ändras, ett samtal avslutas eller ett ärende eskaleras." },
  { icon: KeyRound, title: "Autentisering", text: "API-nycklar med avgränsad räckvidd och möjlighet att rotera när som helst." },
  { icon: ShieldCheck, title: "Säkerhet", text: "All trafik krypteras. Loggar visar vem som gjort vad och när." },
];

function ApiPage() {
  return (
    <ContentPage
      eyebrow="Resurser"
      title="API-dokumentation"
      lead="Integrera Seytro med systemen ni redan använder."
      intro={["Seytro är byggt för att prata med resten av er tekniska miljö. Via API:et hämtar och skickar ni bokningar, gästprofiler, tillgänglighet och händelser i realtid.", "Dokumentationen riktar sig till utvecklare och tekniska partners. Behöver ni bara koppla ett standardsystem finns färdiga integrationer — då krävs ingen kod alls."]}
      sectionTitle="Ett API som följer förväntningarna."
      blocks={blocks}
      cardsTitle="Vad du kan bygga."
      cards={cards}
      ctaTitle="Behöver ni hjälp att komma igång?"
      ctaText="Vi sätter oss gärna med ert utvecklingsteam och går igenom flödena innan ni börjar bygga."
      ctaSubject="Teknisk genomgång av Seytros API"
      steps={["Läs igenom resurserna och händelsemodellen.", "Skapa en nyckel för testmiljön.", "Hör av dig när ni vill gå live."]}
    />
  );
}
