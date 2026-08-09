import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, PageSection, ItemList } from "@/components/ContentPage";
import { Heart, Compass, Users, Sparkles, ShieldCheck, Rocket } from "lucide-react";

export const Route = createFileRoute("/foretag/om-oss")({
  head: () => ({
    meta: [
      { title: "Om Seytro — vår vision" },
      { name: "description", content: "Seytro bygger den operativa plattformen för restauranger och hotell. Läs om vår vision, vårt team och varför vi finns." },
      { property: "og:title", content: "Om Seytro — vår vision" },
      { property: "og:description", content: "Seytro bygger den operativa plattformen för restauranger och hotell. Läs om vår vision, vårt team och varför vi finns." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OmOssPage,
});

const blocks = [
  { title: "Gästen först, alltid", text: "Ingen funktion får göra gästupplevelsen kallare. Automatiken ska kännas som god service, inte som en telefonkö." },
  { title: "Byggt med branschen", text: "Vi utvecklar tillsammans med restauranger och hotell som kör systemet varje dag. Verkligheten i salen styr prioriteringarna." },
];

const cards = [
  { icon: Heart, title: "Gästfrihet", text: "Tekniken finns för att förstärka värdskapet — aldrig för att ersätta det." },
  { icon: Compass, title: "Tydlighet", text: "Inga dolda mekanismer. Du ska alltid förstå vad systemet gör och varför." },
  { icon: Users, title: "Nära våra kunder", text: "Vi jobbar sida vid sida med teamen som använder Seytro, från uppsättning till vardag." },
  { icon: Sparkles, title: "Hantverk", text: "Vi hellre gör färre saker riktigt bra än många saker halvvägs." },
  { icon: ShieldCheck, title: "Ansvar", text: "Gästdata är ett förtroende. Vi behandlar det därefter." },
  { icon: Rocket, title: "Långsiktighet", text: "Vi bygger för att finnas kvar — i produkten, i relationerna och i branschen." },
];

function OmOssPage() {
  return (
    <ContentPage
      eyebrow="Företag"
      title="Om Seytro"
      lead="Vi bygger tekniken som låter gästfriheten ta plats."
      intro={["Seytro startade i en enkel observation: den bästa personalen i branschen lägger en orimlig del av sin tid på telefon, mejl och bokningsadministration — arbete som håller dem borta från gästen.", "Vi bygger en operativ plattform som tar hand om det repetitiva och lämnar över det mänskliga till människorna. Röstagent, e-postconcierge, bordsplacering och gästinsikt i samma system, byggt för hur en restaurang och ett hotell faktiskt fungerar."]}
      sectionTitle="Så tänker vi."
      blocks={blocks}
      cardsTitle="Det vi står för."
      cards={cards}
      ctaTitle="Vill du veta mer om oss?"
      ctaText="Vi berättar gärna hur vi tänker, var vi är på väg och vad det skulle betyda för er verksamhet."
      ctaSubject="Hej Seytro — jag vill veta mer"
      steps={["Läs om vår vision och vårt sätt att bygga.", "Se hur plattformen hänger ihop.", "Hör av dig så pratar vi."]}
    >
      <PageSection eyebrow="Historik" title="Så här långt har vi kommit.">
        <ItemList
          items={[
            { label: "2024", title: "Idén föds i en full matsal", text: "Efter för många missade samtal en fredagskväll började vi bygga en agent som kunde ta dem." },
            { label: "2025", title: "Första skarpa driften", text: "Tre restauranger i Stockholm körde röstagenten under hela höstsäsongen." },
            { label: "2026", title: "Hela plattformen", text: "Gästkommunikation, restaurangdrift och gästtillväxt i ett — nu även för hotell." },
          ]}
        />
      </PageSection>

      <PageSection eyebrow="Team" title="Människorna bakom Seytro." tinted>
        <ItemList
          items={[
            { title: "Carl Milio Andrée — Grundare", text: "Driver produkt och kundrelationer. Sitter helst i en matsal och lyssnar på hur samtalen faktiskt låter." },
            { title: "Produkt och design", text: "Bygger gränssnitt som ska gå att förstå mitt i en service, inte på ett kontor." },
            { title: "Teknik", text: "Röst, språkmodeller och integrationer mot bokningssystem och telefoni." },
            { title: "Kundframgång", text: "Sätter upp, tränar agenten och följer upp siffrorna varje månad tillsammans med er." },
          ]}
        />
      </PageSection>
    </ContentPage>
  );
}
