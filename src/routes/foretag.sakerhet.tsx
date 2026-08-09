import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, PageSection, ItemList } from "@/components/ContentPage";
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
    >
      <PageSection eyebrow="Efterlevnad" title="Ramverk och certifieringar.">
        <ItemList
          items={[
            { label: "GDPR", title: "Personuppgiftsbiträdesavtal vid uppstart", text: "Ni är personuppgiftsansvarig, vi är biträde. Register över behandlingar och underbiträden delas på begäran." },
            { label: "Datalagring", title: "All data lagras inom EU", text: "Drift och backup ligger i europeiska datacenter. Ingen gästdata överförs till tredje land." },
            { label: "ISO 27001", title: "Ledningssystem under certifiering", text: "Vi arbetar enligt kontrollerna och genomför certifieringen under 2026." },
            { label: "Kryptering", title: "TLS 1.3 i transit, AES-256 i vila", text: "Nycklar roteras automatiskt och hanteras separat från applikationen." },
            { label: "Åtkomst", title: "Rollstyrd behörighet och 2FA", text: "Minsta möjliga behörighet internt, loggad åtkomst och obligatorisk tvåfaktor för alla konton." },
            { label: "Test", title: "Årlig penetrationstest", text: "Extern part testar plattformen minst en gång per år. Sammanfattning delas med kunder på begäran." },
          ]}
        />
      </PageSection>

      <PageSection eyebrow="Er kontroll" title="Vad ni kan göra med er data." tinted>
        <ItemList
          items={[
            { title: "Export när ni vill", text: "Full export av gäster, bokningar och konversationer i maskinläsbart format inom 24 timmar." },
            { title: "Radering på begäran", text: "Enskild gäst eller hela kontot raderas permanent, inklusive backup inom 30 dagar." },
            { title: "Lagringstider ni sätter", text: "Bestäm hur länge samtalsutskrifter och inspelningar sparas — från 0 dagar och uppåt." },
            { title: "Incidenthantering", text: "Vi meddelar er inom 24 timmar vid misstänkt incident, med åtgärdsplan och tidslinje." },
          ]}
        />
      </PageSection>
    </ContentPage>
  );
}
