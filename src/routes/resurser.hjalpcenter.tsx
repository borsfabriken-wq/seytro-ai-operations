import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/ContentPage";
import { Settings, Plug, PhoneCall, Mail, ShieldCheck, LifeBuoy } from "lucide-react";

export const Route = createFileRoute("/resurser/hjalpcenter")({
  head: () => ({
    meta: [
      { title: "Hjälpcenter — Seytro" },
      { name: "description", content: "Svar på de vanligaste frågorna om Seytro: uppsättning, integrationer, röstagenten, mejlflöden och support." },
      { property: "og:title", content: "Hjälpcenter — Seytro" },
      { property: "og:description", content: "Svar på de vanligaste frågorna om Seytro: uppsättning, integrationer, röstagenten, mejlflöden och support." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HjalpcenterPage,
});

const blocks = [
  { title: "Sök först, fråga sen", text: "Skriv en fråga i klarspråk så hittar sökningen rätt artikel. De flesta ärenden löser sig på under en minut." },
  { title: "Mänsklig support i ryggen", text: "Löser artikeln inte problemet är vi ett mejl bort. Supporten ser din uppsättning och kan svara direkt utan långa förklaringar." },
];

const cards = [
  { icon: Settings, title: "Uppsättning och konto", text: "Hur du lägger till användare, byter öppettider och justerar vad agenten får lova gästen." },
  { icon: Plug, title: "Integrationer", text: "Guider för de vanligaste bokningssystemen, telefonileverantörerna och mejlkontona." },
  { icon: PhoneCall, title: "Röstagenten", text: "Vad agenten svarar på, hur den låter och hur du styr tonen i din verksamhets röst." },
  { icon: Mail, title: "E-postconcierge", text: "Mallar, signaturer, autosvar och hur trådar överlämnas till personalen." },
  { icon: ShieldCheck, title: "Data och säkerhet", text: "Var datan lagras, vem som kommer åt den och hur du exporterar eller raderar." },
  { icon: LifeBuoy, title: "Support", text: "Svarstider, hur du når oss akut och hur du rapporterar ett fel." },
];

function HjalpcenterPage() {
  return (
    <ContentPage
      eyebrow="Resurser"
      title="Hjälpcenter"
      lead="Svar på det du undrar över — samlat på ett ställe."
      intro={["Hjälpcentret är vår samlade kunskapsbank. Här hittar du korta, konkreta svar på det som dyker upp i vardagen: hur du ändrar bokningsregler, hur röstagenten eskalerar till personalen, hur du kopplar ett nytt bokningssystem.", "Artiklarna är skrivna för dig som står i restaurangen eller receptionen — inte för utvecklare. Behöver du ändå gå djupare finns tekniska detaljer i API-dokumentationen."]}
      sectionTitle="Hjälp när du behöver den, inte när supporten öppnar."
      blocks={blocks}
      cardsTitle="Det vi får flest frågor om."
      cards={cards}
      ctaTitle="Hittar du inte svaret?"
      ctaText="Skicka en rad till oss så återkommer vi samma dag. Vi hellre svarar en gång för mycket än låter dig sitta fast."
      ctaSubject="Fråga till Seytros hjälpcenter"
      steps={["Sök i hjälpcentret på det du undrar över.", "Kolla guiden för ditt bokningssystem.", "Mejla oss om något fortfarande skaver."]}
    />
  );
}
