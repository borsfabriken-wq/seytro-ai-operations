import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, PageSection, ItemList } from "@/components/ContentPage";
import { Mail, CalendarCheck, LifeBuoy, Handshake, Newspaper, MapPin } from "lucide-react";

export const Route = createFileRoute("/foretag/kontakt")({
  head: () => ({
    meta: [
      { title: "Kontakta Seytro" },
      { name: "description", content: "Prata med oss om demo, uppsättning, support eller partnerskap. Vi svarar samma dag." },
      { property: "og:title", content: "Kontakta Seytro" },
      { property: "og:description", content: "Prata med oss om demo, uppsättning, support eller partnerskap. Vi svarar samma dag." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: KontaktPage,
});

const blocks = [
  { title: "Demo och uppsättning", text: "Vi visar plattformen med er verksamhet som utgångspunkt och går igenom vad som krävs för att komma igång." },
  { title: "Support för befintliga kunder", text: "Redan igång? Kontakta supporten direkt så ser vi din uppsättning och kan hjälpa utan omvägar." },
];

const cards = [
  { icon: Mail, title: "Allmänna frågor", text: "hej@seytro.com — vi läser allt och svarar normalt inom några timmar." },
  { icon: CalendarCheck, title: "Boka demo", text: "En halvtimme där vi går igenom plattformen utifrån er verksamhet." },
  { icon: LifeBuoy, title: "Support", text: "Frågor om en pågående uppsättning eller något som inte fungerar som det ska." },
  { icon: Handshake, title: "Partnerskap", text: "Systemleverantörer och byråer som vill integrera eller samarbeta." },
  { icon: Newspaper, title: "Press", text: "Förfrågningar om intervjuer, material och bakgrund." },
  { icon: MapPin, title: "Var vi finns", text: "Vi är baserade i Stockholm och jobbar med verksamheter i hela Norden." },
];

function KontaktPage() {
  return (
    <ContentPage
      eyebrow="Företag"
      title="Kontakt"
      lead="Prata med oss — vi svarar samma dag."
      intro={["Oavsett om du vill se plattformen i skarpt läge, har en teknisk fråga eller bara vill bolla hur ni skulle kunna jobba annorlunda: hör av dig. Vi svarar snabbt och utan säljmanus.", "Det snabbaste sättet är ett mejl till hej@seytro.com. Beskriv kort er verksamhet så återkommer vi med ett förslag på nästa steg."]}
      sectionTitle="Hitta rätt väg in."
      blocks={blocks}
      cardsTitle="Vad gäller det?"
      cards={cards}
      ctaTitle="Redo att ta första samtalet?"
      ctaText="Skriv några rader om er verksamhet så återkommer vi med tider som passar."
      ctaSubject="Kontakt med Seytro"
      steps={["Beskriv kort er verksamhet och er utmaning.", "Vi föreslår ett upplägg och en tid.", "Vi kör en demo med er data som utgångspunkt."]}
    >
      <PageSection eyebrow="Kontaktuppgifter" title="Nå oss direkt.">
        <ItemList
          items={[
            { label: "Mejl", title: "hej@seytro.com", text: "Allmänna frågor, demo och offert. Vi svarar normalt samma arbetsdag.", href: "mailto:hej@seytro.com" },
            { label: "Support", title: "support@seytro.com", text: "För befintliga kunder. Svar inom 4 timmar vardagar 08–18, jour för driftkritiska ärenden 10–23 alla dagar.", href: "mailto:support@seytro.com" },
            { label: "Partner", title: "partner@seytro.com", text: "Systemleverantörer, byråer och konsulter som vill integrera eller samarbeta.", href: "mailto:partner@seytro.com" },
            { label: "Press", title: "press@seytro.com", text: "Intervjuer, bakgrund och bildmaterial.", href: "mailto:press@seytro.com" },
            { label: "Adress", title: "Seytro AB, Stockholm", text: "Vi tar emot besök efter överenskommelse och åker gärna ut till er restaurang i stället." },
            { label: "Öppettider", title: "Vardagar 08–18", text: "Utanför kontorstid går driftkritiska ärenden till jour." },
          ]}
        />
      </PageSection>
    </ContentPage>
  );
}
