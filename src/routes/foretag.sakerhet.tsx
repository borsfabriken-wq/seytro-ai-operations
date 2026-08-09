import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/ContentPage";
import { Lock, KeyRound, Server, ScrollText, Trash2, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/foretag/sakerhet")({
  head: () => ({
    meta: [
      { title: "Säkerhet — Seytro" },
      { name: "description", content: "Så skyddar Seytro gästdata: kryptering, åtkomstkontroll, lagring inom EU och full spårbarhet." },
      { property: "og:title", content: "Säkerhet — Seytro" },
      { property: "og:description", content: "Så skyddar Seytro gästdata: kryptering, åtkomstkontroll, lagring inom EU och full spårbarhet." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SakerhetPage,
});

const blocks = [
  { title: "Så lite data som möjligt", text: "Vi samlar bara det som behövs för att leverera tjänsten. Det som inte behövs sparas inte." },
  { title: "Ni äger datan", text: "Er gästdata är er. Vi säljer den aldrig vidare och använder den inte till något ni inte godkänt." },
];

const cards = [
  { icon: Lock, title: "Kryptering", text: "All trafik krypteras i transit och lagrad data krypteras i vila." },
  { icon: KeyRound, title: "Åtkomstkontroll", text: "Roller och behörigheter styr vem som ser vad. Åtkomst ges enligt minsta nödvändiga princip." },
  { icon: Server, title: "Lagring inom EU", text: "Data lagras hos leverantörer inom EU med tydliga databehandlaravtal." },
  { icon: ScrollText, title: "Spårbarhet", text: "Loggar visar vem som gjort vad och när, så att avvikelser kan följas upp." },
  { icon: Trash2, title: "Radering och export", text: "Ni kan när som helst exportera eller radera gästdata, även på enskild gästnivå." },
  { icon: ShieldCheck, title: "GDPR", text: "Vi arbetar enligt GDPR och hjälper er uppfylla era skyldigheter som personuppgiftsansvarig." },
];

function SakerhetPage() {
  return (
    <ContentPage
      eyebrow="Företag"
      title="Säkerhet"
      lead="Så skyddar vi era och gästernas data."
      intro={["Ett samtal till restaurangen innehåller ofta känslig information: namn, telefonnummer, allergier, önskemål. Att hantera det ansvarsfullt är en förutsättning för att vi ska få finnas i gästmötet.", "Vi bygger med dataskydd som utgångspunkt, inte som efterhandslapp. Ni äger er data, vet var den finns och kan ta ut eller radera den när ni vill."]}
      sectionTitle="Grundprinciperna."
      blocks={blocks}
      cardsTitle="Skydd i praktiken."
      cards={cards}
      ctaTitle="Har ni frågor från er säkerhetsavdelning?"
      ctaText="Vi svarar gärna på säkerhetsformulär och går igenom vår uppsättning tillsammans med ert team."
      ctaSubject="Säkerhetsfrågor till Seytro"
      steps={["Skicka era frågor eller ert säkerhetsformulär.", "Vi går igenom uppsättning och avtal.", "Ni får underlaget ni behöver internt."]}
    />
  );
}
