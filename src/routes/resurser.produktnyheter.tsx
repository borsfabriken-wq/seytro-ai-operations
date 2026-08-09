import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/ContentPage";
import { PhoneCall, Mail, LayoutGrid, BarChart3, Megaphone, Plug } from "lucide-react";

export const Route = createFileRoute("/resurser/produktnyheter")({
  head: () => ({
    meta: [
      { title: "Produktnyheter — Seytro" },
      { name: "description", content: "Det senaste från Seytro: nya funktioner, förbättringar och förändringar i plattformen." },
      { property: "og:title", content: "Produktnyheter — Seytro" },
      { property: "og:description", content: "Det senaste från Seytro: nya funktioner, förbättringar och förändringar i plattformen." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProduktnyheterPage,
});

const blocks = [
  { title: "Löpande förbättringar", text: "Röstagenten, mejlflödena och analysen finslipas kontinuerligt. Du behöver inte uppdatera något — det är på plats när du loggar in." },
  { title: "Byggt på er feedback", text: "Merparten av det vi släpper kommer från önskemål från restauranger och hotell som kör Seytro dagligen." },
];

const cards = [
  { icon: PhoneCall, title: "Röstagent", text: "Naturligare samtal, snabbare svar och bättre hantering av avbrott och bakgrundsljud." },
  { icon: Mail, title: "E-postconcierge", text: "Smartare trådhantering och tydligare överlämning till personalen." },
  { icon: LayoutGrid, title: "Salsplan", text: "Mer flexibel bordshantering och tydligare vy över kvällens flöde." },
  { icon: BarChart3, title: "Analys", text: "Fler nyckeltal, jämförelser över tid och exporterbara rapporter." },
  { icon: Megaphone, title: "Kampanjer", text: "Bättre segmentering och uppföljning av vad varje utskick faktiskt gav." },
  { icon: Plug, title: "Integrationer", text: "Fler bokningssystem, kassasystem och telefonileverantörer." },
];

function ProduktnyheterPage() {
  return (
    <ContentPage
      eyebrow="Resurser"
      title="Produktnyheter"
      lead="Det senaste från Seytro."
      intro={["Vi släpper förbättringar löpande. Här samlar vi vad som är nytt, vad som blivit bättre och vad som förändras — i klarspråk, med fokus på vad det betyder i din vardag.", "Större förändringar aviseras i god tid och påverkar aldrig en pågående service utan förvarning."]}
      sectionTitle="Utveckling som märks i salen."
      blocks={blocks}
      cardsTitle="Områden vi utvecklar just nu."
      cards={cards}
      ctaTitle="Vill du påverka vad vi bygger?"
      ctaText="Vi pratar hellre med er tidigt än gissar. Hör av dig med det som saknas i er vardag."
      ctaSubject="Feedback och produktönskemål till Seytro"
      steps={["Läs vad som är nytt sedan sist.", "Testa förbättringarna i din uppsättning.", "Skicka in det du vill se härnäst."]}
    />
  );
}
