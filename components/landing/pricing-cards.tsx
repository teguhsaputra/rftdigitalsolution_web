import { Check } from 'lucide-react';
import type { BrandSettingsPublic } from '@/lib/brand-settings-db';
import type { ServiceItem } from '@/lib/marketing-data';
import { formatPriceFrom } from '@/lib/format';
import { pricingHeading } from '@/lib/landing-copy';
import { ContactButton } from '@/components/landing/contact-button';
import { Eyebrow, Reveal, SectionTitle } from '@/components/landing/reveal';

export function PricingCards({
  services,
  brand,
}: {
  services: ServiceItem[];
  brand: BrandSettingsPublic;
}) {
  return (
    <section id="harga" className="scroll-mt-24 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Eyebrow>{pricingHeading.eyebrow}</Eyebrow>
          <SectionTitle title={pricingHeading.title} accent={pricingHeading.accent} />
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const price = formatPriceFrom(s.priceFrom);
            const hasPrice = price.startsWith('Mulai');
            return (
              <Reveal key={s.slug} delay={(i % 3) * 0.06} className="h-full">
                <article className="flex h-full flex-col rounded-[28px] border border-line bg-surface p-7">
                  <h3 className="text-lg font-extrabold tracking-tight text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{s.summary}</p>
                  <p className="mt-6">
                    {hasPrice ? (
                      <>
                        <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                          Mulai dari
                        </span>
                        <span className="heading-display text-[2.4rem] text-white">
                          {price.replace('Mulai ', '')}
                        </span>
                      </>
                    ) : (
                      <span className="heading-display text-[2rem] text-white">{price}</span>
                    )}
                  </p>
                  <ul className="mt-6 space-y-2.5 text-sm text-zinc-300">
                    {s.details.slice(0, 4).map((d) => (
                      <li key={d} className="flex gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-white" aria-hidden />
                        {d}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-7">
                    <ContactButton
                      brand={brand}
                      topic={s.title}
                      label={pricingHeading.cta}
                      variant="outline"
                      className="w-full"
                    />
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
        <p className="mt-6 text-center text-xs text-zinc-500">{pricingHeading.footnote}</p>
      </div>
    </section>
  );
}
