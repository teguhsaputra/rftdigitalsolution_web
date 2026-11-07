'use client';

import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import type { ServiceItem } from '@/lib/marketing-data';
import { servicesHeading } from '@/lib/landing-copy';
import { Eyebrow, Reveal, SectionTitle } from '@/components/landing/reveal';
import { cn } from '@/lib/utils';

/** Section Layanan: grid kartu; tombol + membuka poin detail tiap layanan. */
export function ServicesCarousel({ services }: { services: ServiceItem[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="layanan" className="scroll-mt-24 px-4 py-20">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 md:flex-row md:items-end">
        <Reveal>
          <Eyebrow>{servicesHeading.eyebrow}</Eyebrow>
          <SectionTitle
            title={servicesHeading.title}
            accent={servicesHeading.accent}
            titleEnd={servicesHeading.titleEnd}
          />
        </Reveal>
        <p className="max-w-[260px] text-sm leading-relaxed text-zinc-500">{servicesHeading.hint}</p>
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => {
          const isOpen = open === s.slug;
          const detailId = `layanan-detail-${s.slug}`;
          return (
            <article
              key={s.slug}
              className="relative flex min-h-[260px] flex-col rounded-[24px] border border-line bg-surface p-6"
            >
              <span className="text-xs font-bold text-zinc-600">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-3 text-xl font-extrabold tracking-tight text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{s.summary}</p>
              <ul
                id={detailId}
                aria-hidden={!isOpen}
                className={cn(
                  'mt-4 space-y-2 overflow-hidden text-sm text-zinc-300 transition-all duration-300 motion-reduce:transition-none',
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                )}
              >
                {s.details.map((d) => (
                  <li key={d} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-white" aria-hidden />
                    {d}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : s.slug)}
                aria-expanded={isOpen}
                aria-controls={detailId}
                aria-label={isOpen ? `Tutup detail ${s.title}` : `Lihat detail ${s.title}`}
                className="mt-auto ml-auto grid h-10 w-10 place-items-center rounded-full bg-white text-[#09090b] transition-transform hover:scale-105"
              >
                <Plus
                  className={cn('h-5 w-5 transition-transform motion-reduce:transition-none', isOpen && 'rotate-45')}
                />
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
