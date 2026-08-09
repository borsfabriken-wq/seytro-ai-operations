import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/ContentPage";
import { Rocket, PhoneCall, Mail, LayoutGrid, CalendarCheck, Megaphone } from "lucide-react";

export const Route = createFileRoute("/resurser/guider")({
  head: () => ({
    meta: [
      { title: "Guider — Seytro" },
      { name: "description", content: "Steg-för-steg-guider för att komma igång med Seytro: från första samtalet till full drift i sal och reception." },
      { property: "og:title", content: "Guider — Seytro" },
      { property: "og:description", content: "Steg-för-steg-guider för att komma igång med Seytro: från första samtalet till full drift i sal och reception." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GuiderPage,
});

const blocks = [
  { title: "En sak i taget", text: "Varje guide löser ett moment. Du kan stanna när som helst och plocka upp tråden nästa dag utan att tappa något." },
  { title: "Byggd på riktiga uppsättningar", text: "Guiderna bygger på hur restauranger och hotell faktiskt kör Seytro — inte på ett teoretiskt idealfall." },
];

const cards = [
  { icon: Rocket, title: "Kom igång på en vecka", text: "En realistisk plan för första veckan: vad du gör dag för dag och vem som behöver vara med." },
  { icon: PhoneCall, title: "Sätt upp röstagenten", text: "Öppettider, tonläge, vanliga frågor och när agenten ska lämna över till personalen." },
  { icon: Mail, title: "Bygg mejlflödet", text: "Autosvar, bokningsbekräftelser och hur du håller inkorgen tom utan att tappa gäster." },
  { icon: LayoutGrid, title: "Rita salsplanen", text: "Så ritar du in bord, sektioner och kapacitet så placeringen blir rätt från start." },
  { icon: CalendarCheck, title: "Bokningsregler som håller", text: "Framförhållning, sittningstider, sällskapsstorlekar och undantag för högsäsong." },
  { icon: Megaphone, title: "Din första kampanj", text: "Välj segment, skriv budskapet och mät vad det gav i faktiska bokningar." },
];

function GuiderPage() {
  return (
    <ContentPage
      eyebrow="Resurser"
      title="Guider"
      lead="Från första samtalet till full drift — steg för steg."
      intro={["Våra guider är gjorda för att följas i verkligheten, mellan lunch och middag. Varje guide tar dig genom ett avgränsat moment: koppla telefonin, sätta bokningsreglerna, bygga salsplanen, dra igång första kampanjen.", "Ingen guide tar mer än en kvart att gå igenom. Du behöver ingen teknisk bakgrund — bara vetskap om hur ni jobbar idag."]}
      sectionTitle="Kortare vägen till att det faktiskt sitter."
      blocks={blocks}
      cardsTitle="Guider som tar dig framåt."
      cards={cards}
      ctaTitle="Vill du ha en genomgång live?"
      ctaText="Vi går igenom uppsättningen tillsammans, anpassad efter er verksamhet. Boka en halvtimme så gör vi det mesta på plats."
      ctaSubject="Boka genomgång av Seytro"
      steps={["Välj den guide som matchar var ni står.", "Följ stegen med er egen data.", "Hör av dig om något behöver skräddarsys."]}
    />
  );
}
