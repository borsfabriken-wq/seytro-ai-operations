import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/ContentPage";
import { BarChart3, CalendarX, Users, Repeat, Coins, Sparkles } from "lucide-react";

export const Route = createFileRoute("/resurser/insikter")({
  head: () => ({
    meta: [
      { title: "Restauranginsikter — Seytro" },
      { name: "description", content: "Trender, analys och perspektiv på gästbeteende, bemanning och lönsamhet i restaurang- och hotellbranschen." },
      { property: "og:title", content: "Restauranginsikter — Seytro" },
      { property: "og:description", content: "Trender, analys och perspektiv på gästbeteende, bemanning och lönsamhet i restaurang- och hotellbranschen." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InsikterPage,
});

const blocks = [
  { title: "Mönster, inte magkänsla", text: "Vi tittar på hur bokningar, avhopp och förfrågningar rör sig över veckan och säsongen — och vad det betyder för bemanning." },
  { title: "Branschperspektiv", text: "Jämförelser mellan verksamhetstyper visar vad som är normalt och vad som är en möjlighet just hos er." },
];

const cards = [
  { icon: BarChart3, title: "Bokningsmönster", text: "När gästerna bokar, hur långt i förväg och vilka tider som fylls sist." },
  { icon: CalendarX, title: "No-shows", text: "Vad som driver uteblivna gäster och vilka åtgärder som faktiskt biter." },
  { icon: Users, title: "Bemanning", text: "Hur du planerar skift efter förväntat tryck istället för förra veckans känsla." },
  { icon: Repeat, title: "Gästlojalitet", text: "Vad som skiljer engångsbesökaren från stammisen — och när kontakten ska tas." },
  { icon: Coins, title: "Lönsamhet per sittning", text: "Hur placering, sittningstid och kapacitet påverkar kvällens resultat." },
  { icon: Sparkles, title: "AI i gästmötet", text: "Vad tekniken klarar idag, vad den inte gör, och var gränsen bör gå." },
];

function InsikterPage() {
  return (
    <ContentPage
      eyebrow="Resurser"
      title="Restauranginsikter"
      lead="Trender och analys för dig som driver gästupplevelse."
      intro={["Vi sitter nära data från tusentals gästmöten. Det ger perspektiv på vad som faktiskt förändras i branschen: när gästerna bokar, hur långt i förväg, vilka kvällar som är sårbara och vad som får någon att komma tillbaka.", "Insikterna publiceras löpande och är fria att läsa. Vi håller dem korta, konkreta och användbara på måndagsmötet."]}
      sectionTitle="Data som går att agera på."
      blocks={blocks}
      cardsTitle="Vad vi skriver om."
      cards={cards}
      ctaTitle="Få insikterna i inkorgen"
      ctaText="Vi skickar en sammanfattning när något nytt publiceras. Inget brus, ingen försäljning."
      ctaSubject="Prenumerera på Seytros restauranginsikter"
      steps={["Läs den senaste analysen.", "Jämför siffrorna med er egen verksamhet.", "Prenumerera för att få nästa direkt."]}
    />
  );
}
