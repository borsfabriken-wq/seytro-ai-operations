import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, PageSection, ItemList } from "@/components/ContentPage";
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
    >
      <PageSection eyebrow="Vanliga frågor" title="De 8 frågor vi får oftast.">
        <ItemList
          items={[
            { label: "Uppsättning", title: "Hur lång tid tar det att komma igång?", text: "De flesta är igång på 5–10 arbetsdagar. Dag 1–2 kopplar vi bokningssystem och telefoni, dag 3–5 tränar vi agenten på er meny, era regler och er ton, därefter kör vi skarpt med er som medlyssnare." },
            { label: "Integrationer", title: "Vilka bokningssystem stöds?", text: "Caspeco, Superb, Trivec, OpenTable, Resy och Bookatable via direktintegration. Övriga system kopplas via vårt API eller via kalender- och mejlflöden." },
            { label: "Telefoni", title: "Måste vi byta telefonnummer?", text: "Nej. Ni behåller numret och vidarekopplar det till Seytro — antingen alltid, eller bara vid upptaget och efter x signaler." },
            { label: "Röstagent", title: "Hör gästen att det är en AI?", text: "Agenten presenterar sig alltid som Seytros digitala värd åt er restaurang. Ni väljer formuleringen ord för ord." },
            { label: "Eskalering", title: "Vad händer när agenten inte kan svara?", text: "Den lämnar över till personal enligt era regler: koppla vidare direkt, ta meddelande, eller skapa ett ärende som mejlas till er inbox med hela samtalsutskriften." },
            { label: "Mejl", title: "Kan agenten svara på mejl i vårt namn?", text: "Ja, från er egen domän och med er signatur. Ni kan välja utkastläge där personalen godkänner innan svaret skickas." },
            { label: "Data", title: "Var lagras gästdatan?", text: "Inom EU. Ni är personuppgiftsansvarig, vi är biträde, och vi tecknar DPA vid uppstart. Radering och export sker på begäran inom 24 timmar." },
            { label: "Support", title: "Hur snabbt får vi hjälp?", text: "Mejlsupport svarar inom 4 timmar vardagar 08–18. Driftkritiska ärenden har jour alla dagar 10–23." },
          ]}
        />
      </PageSection>
    </ContentPage>
  );
}
