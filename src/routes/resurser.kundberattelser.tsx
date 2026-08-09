import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/ContentPage";
import { PhoneCall, Clock, TrendingUp, Users, Globe, Star } from "lucide-react";

export const Route = createFileRoute("/resurser/kundberattelser")({
  head: () => ({
    meta: [
      { title: "Kundberättelser — Seytro" },
      { name: "description", content: "Så använder restauranger och hotell Seytro i praktiken — och vad det gav i tid, bokningar och gästnöjdhet." },
      { property: "og:title", content: "Kundberättelser — Seytro" },
      { property: "og:description", content: "Så använder restauranger och hotell Seytro i praktiken — och vad det gav i tid, bokningar och gästnöjdhet." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: KundberattelserPage,
});

const blocks = [
  { title: "Från missade samtal till fulla sittningar", text: "Flera verksamheter startar i samma problem: telefonen ringer när ingen kan svara. Efter uppsättning besvaras varje samtal — och en stor del blir bokningar." },
  { title: "Mer tid i salen", text: "När mejl och bokningsändringar sköts automatiskt flyttas personalens tid dit den gör mest nytta: till gästen som står framför dem." },
];

const cards = [
  { icon: PhoneCall, title: "Alla samtal besvaras", text: "Ingen gäst möts av upptagetton, inte ens under lunchrushen eller på måndagsmorgonen." },
  { icon: Clock, title: "Timmar tillbaka varje vecka", text: "Administrationen kring bokningar krymper markant redan första månaden." },
  { icon: TrendingUp, title: "Fler återkommande gäster", text: "Med gästinsikt och riktade kampanjer blir förstagångsgästen en stammis oftare." },
  { icon: Users, title: "Lugnare team", text: "Personalen slipper springa mellan telefon och bord — arbetsdagen blir mer förutsägbar." },
  { icon: Globe, title: "Gäster från hela världen", text: "Flerspråkig service gör att internationella gäster får samma bemötande som lokala." },
  { icon: Star, title: "Bättre omdömen", text: "Snabba, träffsäkra svar syns i gästernas betyg och kommentarer." },
];

function KundberattelserPage() {
  return (
    <ContentPage
      eyebrow="Resurser"
      title="Kundberättelser"
      lead="Så växer andra med Seytro."
      intro={["De bästa argumenten kommer inte från oss utan från restaurangerna och hotellen som kör Seytro varje dag. Här delar de vad som förändrades: hur många samtal som faktiskt besvaras, hur mycket administrativ tid som frigjordes och vad det gjorde med gästupplevelsen.", "Berättelserna är konkreta. Vi redovisar vad som fungerade, vad som tog tid och vad de skulle gjort annorlunda."]}
      sectionTitle="Verkliga verksamheter, verkliga siffror."
      blocks={blocks}
      cardsTitle="Teman som återkommer."
      cards={cards}
      ctaTitle="Vill du bli nästa berättelse?"
      ctaText="Berätta hur ni jobbar idag så visar vi vad som är rimligt att förvänta sig i just er verksamhet."
      ctaSubject="Kundberättelse och demo av Seytro"
      steps={["Läs berättelsen från en verksamhet som liknar er.", "Jämför med hur ni jobbar idag.", "Boka en demo och sätt egna mål."]}
    />
  );
}
