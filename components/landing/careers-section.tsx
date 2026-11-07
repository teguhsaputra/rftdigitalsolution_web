'use client';

import { useState } from 'react';
import { ChevronDown, Mail } from 'lucide-react';
import type { BrandSettingsPublic } from '@/lib/brand-settings-db';
import type { CareerOpening } from '@/lib/marketing-data';
import { careersHeading } from '@/lib/landing-copy';
import { Eyebrow, Reveal, SectionTitle } from '@/components/landing/reveal';
import { cn } from '@/lib/utils';

export function CareersSection({
  careers,
  brand,
}: {
  careers: CareerOpening[];
  brand: BrandSettingsPublic;
}) {
  const [open, setOpen] = useState<string | null>(null);
  if (careers.length === 0) return null;

  return (
    <section id="karier" className="scroll-mt-24 px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <Eyebrow>{careersHeading.eyebrow}</Eyebrow>
          <SectionTitle
            title={careersHeading.title}
            accent={careersHeading.accent}
            titleEnd={careersHeading.titleEnd}
          />
        </Reveal>

        <ul className="mt-10 divide-y divide-line overflow-hidden rounded-[24px] border border-line bg-surface">
          {careers.map((job) => {
            const isOpen = open === job.slug;
            const panelId = `karier-${job.slug}`;
            return (
              <li key={job.slug}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : job.slug)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left hover:bg-white/[0.02]"
                >
                  <span>
                    <span className="block font-extrabold tracking-tight text-white">{job.title}</span>
                    <span className="mt-0.5 block text-sm text-zinc-500">
                      {job.location} · {job.type}
                    </span>
                  </span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 shrink-0 text-zinc-400 transition-transform motion-reduce:transition-none',
                      isOpen && 'rotate-180'
                    )}
                    aria-hidden
                  />
                </button>
                {isOpen && (
                  <div id={panelId} className="px-6 pb-6 text-sm leading-relaxed text-zinc-400">
                    <p>{job.description}</p>
                    <ul className="mt-3 list-disc space-y-1 pl-5">
                      {job.responsibilities.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                    <a
                      href={`mailto:${brand.contactEmail}?subject=${encodeURIComponent(`Lamaran ${job.title}`)}`}
                      className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-bold text-[#09090b] hover:bg-zinc-200"
                    >
                      <Mail className="h-4 w-4" aria-hidden />
                      {careersHeading.apply}
                    </a>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
