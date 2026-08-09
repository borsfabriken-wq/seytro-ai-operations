import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/ContentPage";
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
    />
  );
}
