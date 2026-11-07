'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { TrustedPartnerItem } from '@/lib/marketing-data';
import { Eyebrow } from '@/components/landing/reveal';
import { cn } from '@/lib/utils';

/** Minimal jumlah logo per salinan supaya pita selalu lebih panjang dari layar (loop tanpa celah). */
const MIN_PER_COPY = 24;

export function PartnersMarquee({ partners }: { partners: TrustedPartnerItem[] }) {
  const [active, setActive] = useState<string | null>(null);
  if (partners.length === 0) return null;

  const repeat = Math.max(1, Math.ceil(MIN_PER_COPY / partners.length));
  const row = Array.from({ length: repeat }, () => partners).flat();

  return (
    <section aria-label="Dipercaya oleh" className="py-12">
      <div className="mx-auto mb-6 flex max-w-6xl justify-center px-4">
        <Eyebrow>Dipercaya oleh</Eyebrow>
      </div>
      <p className="sr-only">{partners.map((p) => p.name).join(', ')}</p>
      <div
        aria-hidden
        className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]"
      >
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center gap-5 pr-5">
              {row.map((p, i) => {
                const isActive = active === p.name;
                return (
                  <li key={`${copy}-${i}`}>
                    {/* Hitam-putih seragam; warna asli saat disorot kursor atau ditap/diklik. */}
                    <button
                      type="button"
                      tabIndex={-1}
                      title={p.name}
                      onClick={() => setActive(isActive ? null : p.name)}
                      className={cn(
                        'grid h-[72px] w-[72px] place-items-center overflow-hidden rounded-2xl border border-line bg-surface transition duration-300',
                        isActive
                          ? 'opacity-100 grayscale-0'
                          : 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0'
                      )}
                    >
                      {p.imageUrl ? (
                        <Image
                          src={p.imageUrl}
                          alt=""
                          width={72}
                          height={72}
                          unoptimized
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="px-2 text-center text-[11px] font-bold leading-tight text-zinc-400">
                          {p.name}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
