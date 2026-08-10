import { useState } from "react";

const faqs = [
  {
    question: "Ersätter Seytro vårt bokningssystem?",
    answer:
      "Nej — Seytro är byggt för att komplettera era befintliga system, inte ersätta dem. Ni behöver inte välja bort det ni redan har för att använda Seytro.",
  },
  {
    question: "Vet gästerna att de pratar med AI?",
    answer:
      "Ja, vi är transparenta med det. Samtidigt är målet att interaktionen ska kännas lika smidig och personlig som om er egen personal svarade.",
  },
  {
    question: "Vad händer med ovanliga eller känsliga förfrågningar?",
    answer:
      "Seytro känner igen när något ligger utanför vad AI:n ska hantera själv och eskalerar då direkt till er personal, istället för att gissa.",
  },
  {
    question: "Hur lång tid tar implementeringen?",
    answer:
      "Varje verksamhet går igenom en onboarding där plattformen anpassas efter era tjänster, era boknings- och bemanningsflöden och er ton — tidsåtgången beror på hur mycket anpassning som behövs, men vi jobbar för en så smidig start som möjligt.",
  },
  {
    question: "Var lagras vår gästdata?",
    answer:
      "Er data hanteras säkert och i enlighet med gällande dataskyddslagstiftning. Vi delar aldrig gästdata med tredje part utan ert medgivande.",
  },
  {
    question: "Fungerar det på svenska och engelska?",
    answer:
      "Ja, Seytro hanterar både svenska och engelska (fler språk kan läggas till vid behov), så ni kan möta internationella gäster lika naturligt som lokala.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="bg-background text-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-28 sm:px-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Frågor</p>
          <h2 className="mt-5 text-3xl leading-tight sm:text-4xl">
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
