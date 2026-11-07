import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { faqHeading, faqs } from '@/lib/landing-copy';
import { Reveal } from '@/components/landing/reveal';

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-24 px-4 py-20">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <h2 className="heading-display text-[clamp(2.2rem,5.5vw,3.8rem)] leading-[1] text-white">
            {faqHeading.title}
            <br />
            <span className="font-serif-accent text-zinc-400">{faqHeading.accent}</span>
          </h2>
        </Reveal>
        <Accordion type="single" collapsible className="rounded-[24px] border border-line bg-surface px-6">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`faq-${i}`} className="border-line">
              <AccordionTrigger className="py-5 text-left text-base font-bold text-white hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-[15px] leading-relaxed text-zinc-400">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
