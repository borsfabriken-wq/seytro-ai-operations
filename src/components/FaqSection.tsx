import { useState } from "react";

const faqs = [
  {
    question: "Vad gör röstagenten när alla linjer är upptagna?",
    answer:
      "Den svarar direkt istället för att gästen möts av upptagetton. Röstagenten tar bokningen, svarar på frågor om öppettider, meny, allergier eller rumstyper, och skickar en bekräftelse. Behöver gästen prata med en människa kopplas samtalet vidare med hela sammanhanget medskickat.",
  },
  {
    question: "Hur hanterar e-postconciergen inkorgen?",
    answer:
      "Den läser varje inkommande mejl, avgör vad det handlar om och svarar i er ton — bokningsförfrågningar, ändringar, gruppbokningar och standardfrågor. Allt som är känsligt, avvikande eller kommersiellt viktigt lyfts till er med ett färdigt svarsförslag.",
  },
  {
    question: "Hur vet systemet var gästen ska placeras?",
    answer:
      "Bordsplacering och rumsplacering utgår från era egna regler: sällskapets storlek, tidsluckor, turnering, zoner, städstatus och gästens preferenser. Ni styr reglerna, plattformen gör pusslet — och ni kan alltid flytta manuellt i salsplanen.",
  },
  {
    question: "Fungerar Seytro ihop med vårt bokningssystem och vår telefoni?",
    answer:
      "Ja. Seytro läggs som ett lager ovanpå det ni redan använder — bokningssystem, växel, mejl, kassa och gästregister. Ingen migrering, inget systembyte, och datan fortsätter leva där den ligger idag.",
  },
  {
    question: "Vad kostar det och hur snabbt märks effekten?",
    answer:
      "Ni betalar per verksamhet utifrån volym på samtal och mejl. De flesta ser effekten redan första månaden: färre obesvarade förfrågningar, kortare handläggningstid i inkorgen och färre no-shows tack vare automatiska påminnelser.",
  },
  {
    question: "Hur ser gästinsikt, analys och kampanjer ut i praktiken?",
    answer:
      "Varje besök bygger på gästprofilen — preferenser, allergier, historik och noteringar. Analysen visar beläggning, intäkt per pass och vilka kanaler som levererar, och kampanjmodulen låter er skicka segmenterade utskick som fyller just de svaga passen.",
  },
  {
    question: "Vad händer när AI:n är osäker?",
    answer:
      "Då gissar den inte. Seytro eskalerar till er personal med hela konversationen samlad, så att en människa kan ta över direkt. Ni sätter själva var gränsen går för vad plattformen får hantera på egen hand.",
  },
  {
    question: "Var lagras gästdatan och vilka språk stöds?",
    answer:
      "Datan hanteras säkert och i enlighet med GDPR, och delas aldrig med tredje part utan ert medgivande. Plattformen arbetar på svenska och engelska i tal och skrift, med möjlighet att lägga till fler språk.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="bg-background text-foreground">
      <div className="site-container grid gap-12 section-y lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Frågor</p>
          <h2 className="mt-5 text-3xl sm:text-[2.6rem]">
            Allt ni undrar över, samlat på ett ställe.
          </h2>
          <p className="mt-5 max-w-sm text-muted-foreground">
            Hittar ni inte svaret? {" "}
            <a
              href="mailto:hej@seytro.com"
              className="text-forest underline underline-offset-4 transition-colors hover:text-forest-deep"
            >
              Mejla oss
            </a>{" "}
            så svarar vi så snart vi kan.
          </p>
        </div>

        <div className="lg:col-span-8">
          <div className="divide-y divide-border border-t border-border">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={faq.question} className="py-6">
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    className="flex w-full items-start justify-between gap-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-lg font-medium sm:text-xl">{faq.question}</span>
                    <span className="relative mt-1.5 grid h-5 w-5 shrink-0 place-items-center">
                      <span className="absolute h-0.5 w-4 rounded-full bg-forest-deep transition-transform duration-300" />
                      <span
                        className={`absolute h-4 w-0.5 rounded-full bg-forest-deep transition-transform duration-300 ${
                          isOpen ? "rotate-90" : "rotate-0"
                        }`}
                      />
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pt-4 text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
