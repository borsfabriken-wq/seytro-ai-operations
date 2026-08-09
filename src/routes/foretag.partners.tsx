import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/ContentPage";
import { Plug, GraduationCap, Handshake, Megaphone, LifeBuoy, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/foretag/partners")({
  head: () => ({
    meta: [
      { title: "Partners — Seytro" },
      { name: "description", content: "Samarbeta med Seytro. För bokningssystem, kassaleverantörer, byråer och konsulter inom restaurang och hotell." },
      { property: "og:title", content: "Partners — Seytro" },
      { property: "og:description", content: "Samarbeta med Seytro. För bokningssystem, kassaleverantörer, byråer och konsulter inom restaurang och hotell." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PartnersPage,
});

const blocks = [
  { title: "Teknologipartner", text: "Bygg en integration mot vårt API så att er produkt och Seytro delar bokningar, tillgänglighet och gästdata i realtid." },
  { title: "Implementationspartner", text: "Ni kan branschen och kunderna. Vi står för plattformen, utbildningen och supporten i bakgrunden." },
];

const cards = [
  { icon: Plug, title: "Teknisk integration", text: "Dokumenterat API, testmiljö och en kontaktperson under hela bygget." },
  { icon: GraduationCap, title: "Utbildning", text: "Genomgång av plattformen så ert team kan sätta upp och supporta självständigt." },
  { icon: Handshake, title: "Gemensam affär", text: "Vi tar med er i affärer där er kompetens gör skillnad." },
  { icon: Megaphone, title: "Synlighet", text: "Presentation av ert erbjudande mot vår kundbas." },
  { icon: LifeBuoy, title: "Prioriterad support", text: "Snabb väg in när något behöver lösas hos en gemensam kund." },
  { icon: BarChart3, title: "Uppföljning", text: "Transparent bild av hur samarbetet utvecklas över tid." },
];

function PartnersPage() {
  return (
    <ContentPage
      eyebrow="Företag"
      title="Partners"
      lead="Tillsammans växer vi."
      intro={["Seytro sitter mitt i restaurangens och hotellets tekniska miljö. Ju bättre vi pratar med bokningssystem, kassor och telefoni, desto mer värde får den gemensamma kunden.", "Vi samarbetar med systemleverantörer som vill integrera, och med byråer och konsulter som implementerar teknik åt restauranger och hotell."]}
      sectionTitle="Två sätt att samarbeta."
      blocks={blocks}
      cardsTitle="Vad du får som partner."
      cards={cards}
      ctaTitle="Vill ni bli partner?"
      ctaText="Berätta vad ni gör idag och vilka ni jobbar med, så hittar vi rätt form för samarbetet."
      ctaSubject="Partnerskap med Seytro"
      steps={["Berätta om er verksamhet och era kunder.", "Vi går igenom tekniska och kommersiella förutsättningar.", "Vi sätter en plan för första gemensamma kunden."]}
    />
  );
}
