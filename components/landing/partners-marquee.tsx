import Image from 'next/image';
import type { TrustedPartnerItem } from '@/lib/marketing-data';
import { Eyebrow } from '@/components/landing/reveal';

export function PartnersMarquee({ partners }: { partners: TrustedPartnerItem[] }) {
  if (partners.length === 0) return null;
  const row = partners.length < 8 ? [...partners, ...partners] : partners;

  return (
    <section aria-label="Dipercaya oleh" className="py-12">
      <div className="mx-auto mb-6 flex max-w-6xl justify-center px-4">
        <Eyebrow>Dipercaya oleh</Eyebrow>
      </div>
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center gap-5 pr-5" aria-hidden={copy === 1}>
              {row.map((p, i) => (
                <li key={`${copy}-${i}`} className="flex items-center">
                  {p.imageUrl ? (
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      title={p.name}
                      width={72}
                      height={72}
                      unoptimized
                      className="h-[72px] w-[72px] rounded-2xl border border-line bg-surface object-contain opacity-80 transition-opacity hover:opacity-100"
                    />
                  ) : (
                    <span className="text-lg font-extrabold tracking-tight text-zinc-600">{p.name}</span>
                  )}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
