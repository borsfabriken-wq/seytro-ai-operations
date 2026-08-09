import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, PageSection, ItemList } from "@/components/ContentPage";
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
    >
      <PageSection eyebrow="Produktnyheter" title="Vad vi släppt den senaste tiden.">
        <ItemList
          items={[
            { label: "Aug 2026", title: "Salsplan med drag-and-drop", text: "Flytta bord direkt i planen och se hur beläggningen påverkas i realtid. Ändringar synkas till bokningssystemet." },
            { label: "Jul 2026", title: "Röstagent på 20 språk", text: "Agenten känner av gästens språk i första meningen och byter automatiskt, inklusive finska, polska och arabiska." },
            { label: "Jun 2026", title: "Utkastläge för e-postconcierge", text: "Låt agenten skriva svaret och personalen trycka skicka. Bra första steg för verksamheter med hög servicenivå." },
            { label: "Maj 2026", title: "Gästinsikt: besöksfrekvens och favoritbord", text: "Automatiska segment för nya, återkommande och tappade gäster — utan manuell listhantering." },
            { label: "Apr 2026", title: "Bokningsregler per sittning", text: "Sätt olika regler för lunch, tidig och sen sittning: minsta sällskap, tidsbegränsning och släpptid." },
            { label: "Mar 2026", title: "Öppet API i beta", text: "Läs och skriv bokningar, gäster och tillgänglighet direkt mot Seytro." },
          ]}
        />
      </PageSection>
    </ContentPage>
  );
}
