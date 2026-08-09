import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, PageSection, ItemList } from "@/components/ContentPage";
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
    >
      <PageSection eyebrow="Lediga tjänster" title="Roller vi rekryterar till just nu.">
        <ItemList
          items={[
            { label: "Stockholm", title: "Fullstackutvecklare (React / TypeScript)", text: "Bygg gränssnitten för salsplan, bokningsregler och analys. Du gillar att jobba nära kund och släppa ofta." },
            { label: "Stockholm", title: "AI-ingenjör, röst", text: "Latens, avbrottshantering och naturligt tal på 20 språk. Erfarenhet av realtidsljud är ett stort plus." },
            { label: "Stockholm", title: "Customer Success Manager", text: "Du har jobbat i restaurangbranschen och kan översätta drift till uppsättning. Du äger kundens första 90 dagar." },
            { label: "Stockholm", title: "Account Executive", text: "Prata med restauranggrupper och hotellkedjor. Konsultativ försäljning, korta säljcykler, mycket besök på plats." },
            { label: "Öppen", title: "Spontanansökan", text: "Ser du inte din roll? Skriv och berätta vad du skulle göra hos oss." },
          ]}
        />
      </PageSection>

      <PageSection eyebrow="Så jobbar vi" title="Villkor och vardag." tinted>
        <ItemList
          items={[
            { title: "Kontor i Stockholm, tre dagar i veckan", text: "Vi tror på att sitta tillsammans, men styr själva över resten av veckan." },
            { title: "Optionsprogram för alla", text: "Alla anställda får del av bolaget." },
            { title: "Ute hos kund varje månad", text: "Alla — även utvecklare — besöker restauranger och lyssnar på riktiga samtal." },
          ]}
        />
      </PageSection>
    </ContentPage>
  );
}
