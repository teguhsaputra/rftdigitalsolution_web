'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { PortfolioItem, ServiceItem } from '@/lib/marketing-data';
import { filterPortfolioByService } from '@/lib/portfolio';
import { portfolioHeading } from '@/lib/landing-copy';
import { Eyebrow, Reveal, SectionTitle } from '@/components/landing/reveal';
import { ProgressBar, useScrollProgress } from '@/components/landing/services-carousel';
import { cn } from '@/lib/utils';

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'shrink-0 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors',
        active
          ? 'border-white bg-white text-[#09090b]'
          : 'border-line bg-surface text-zinc-300 hover:border-zinc-600'
      )}
    >
      {children}
    </button>
  );
}

export function PortfolioGallery({
  projects,
  services,
}: {
  projects: PortfolioItem[];
  services: ServiceItem[];
}) {
  const [filter, setFilter] = useState<string | null>(null);
  const { ref, progress, onScroll } = useScrollProgress();

  const chips = services
    .map((s) => ({ title: s.title, count: filterPortfolioByService(projects, s.title).length }))
    .filter((c) => c.count > 0);
  const visible = filterPortfolioByService(projects, filter);

  const select = (value: string | null) => {
    setFilter(value);
    ref.current?.scrollTo({ left: 0 });
  };

  return (
    <section id="portofolio" className="scroll-mt-24 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Eyebrow>{portfolioHeading.eyebrow}</Eyebrow>
          <SectionTitle
            title={portfolioHeading.title}
            accent={portfolioHeading.accent}
            titleEnd={portfolioHeading.titleEnd}
          />
        </Reveal>

        <div className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4">
          <Chip active={filter === null} onClick={() => select(null)}>
            Semua ({projects.length})
          </Chip>
          {chips.map((c) => (
            <Chip key={c.title} active={filter === c.title} onClick={() => select(c.title)}>
              {c.title}
            </Chip>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="mx-auto mt-10 max-w-6xl text-sm text-zinc-500">{portfolioHeading.empty}</p>
      ) : (
        <div
          ref={ref}
          onScroll={onScroll}
          className="no-scrollbar mx-auto mt-8 flex max-w-6xl snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
        >
          {visible.map((p) => (
            <article
              key={p.slug}
              className="w-[78vw] max-w-[320px] shrink-0 snap-start overflow-hidden rounded-[28px] border-[3px] border-zinc-800 bg-surface-2"
            >
              <div className="relative aspect-[4/3] bg-[#232326]">
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="320px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-end bg-[radial-gradient(circle_at_25%_20%,#3f3f46,#141416_70%)] p-5">
                    <span className="text-2xl font-extrabold leading-tight tracking-tight text-white/80">
                      {p.title}
                    </span>
                  </div>
                )}
              </div>
              <div className="border-t border-line p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-500">
                  {p.clientType}
                </p>
                <h3 className="mt-1.5 text-lg font-extrabold leading-snug tracking-tight text-white">
                  {p.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-400">{p.description}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {p.services.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-line px-2.5 py-1 text-[11px] font-semibold text-zinc-300"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      )}
      {visible.length > 0 && <ProgressBar progress={progress} />}
    </section>
  );
}
