import { FAQS } from "@/data/content";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { NumberedLabel } from "@/components/site/Editorial";

export default function FAQ() {
  return (
    <section className="py-24 bg-background">
      <div className="container-prose max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <NumberedLabel number="05">FAQ</NumberedLabel>
          <h2 className="font-serif text-3xl md:text-4xl text-primary leading-snug mt-4 mb-6">
            자주 묻는 질문
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {FAQS.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white border border-border rounded-xl px-6 data-[state=open]:shadow-sm transition-shadow"
            >
              <AccordionTrigger className="text-left font-bold text-primary hover:no-underline py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 leading-relaxed text-base pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
