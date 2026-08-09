import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/ContentPage";
import { Code, Palette, Handshake, LifeBuoy, Megaphone, Briefcase } from "lucide-react";

export const Route = createFileRoute("/foretag/karriar")({
  head: () => ({
    meta: [
      { title: "Karriär hos Seytro" },
      { name: "description", content: "Joina teamet som bygger den operativa plattformen för restauranger och hotell. Se hur vi jobbar och vilka vi söker." },
      { property: "og:title", content: "Karriär hos Seytro" },
      { property: "og:description", content: "Joina teamet som bygger den operativa plattformen för restauranger och hotell. Se hur vi jobbar och vilka vi söker." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: KarriarPage,
});

const blocks = [
  { title: "Nära verkligheten", text: "Alla i teamet besöker kunder. Du ser hur ditt arbete fungerar i en full sal en fredagkväll — inte bara i ett diagram." },
  { title: "Högt tempo, låg dramatik", text: "Vi släpper ofta och pratar rakt. Beslut fattas snabbt och görs om när verkligheten säger något annat." },
];

const cards = [
  { icon: Code, title: "Produkt och teknik", text: "Fullstack, röst-AI och dataarbete i en modern stack med korta beslutsvägar." },
  { icon: Palette, title: "Design", text: "Gränssnitt som ska fungera under press, med händer fulla och gäster i kö." },
  { icon: Handshake, title: "Sälj", text: "Bygg relationer med restauranggrupper och hotell som vill förändra sin drift." },
  { icon: LifeBuoy, title: "Kundframgång", text: "Se till att varje uppsättning landar rätt och att kunden får ut effekten." },
  { icon: Megaphone, title: "Marknad", text: "Berätta historien om vad tekniken gör för gästfriheten." },
  { icon: Briefcase, title: "Drift och affär", text: "Processer, uppföljning och struktur som håller när vi växer." },
];

function KarriarPage() {
  return (
    <ContentPage
      eyebrow="Företag"
      title="Karriär"
      lead="Bygg något som märks i varje gästmöte."
      intro={["Vi är ett litet team med stor yta. Här får du äga hela problem — från första samtalet med en restaurangchef till funktionen som går live samma månad.", "Vi söker människor som är nyfikna på branschen, noggranna med hantverket och trygga i att jobba nära kunden. Erfarenhet från restaurang eller hotell är en merit, inget krav."]}
      sectionTitle="Så jobbar vi."
      blocks={blocks}
      cardsTitle="Områden vi växer inom."
      cards={cards}
      ctaTitle="Ser du ingen roll som passar?"
      ctaText="Skicka en spontanansökan. Vi läser allt och hör av oss när något matchar."
      ctaSubject="Spontanansökan till Seytro"
      steps={["Läs om hur vi jobbar och vad vi bygger.", "Välj ett område där du gör störst skillnad.", "Skicka några rader om dig själv."]}
    />
  );
}
