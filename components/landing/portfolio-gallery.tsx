'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { PortfolioItem, ServiceItem } from '@/lib/marketing-data';
import { filterPortfolioByService } from '@/lib/portfolio';
import { portfolioHeading } from '@/lib/landing-copy';
import { Eyebrow, Reveal, SectionTitle } from '@/components/landing/reveal';
import { cn } from '@/lib/utils';

/** Jumlah project yang tampil sebelum tombol "Lihat semua". */
const INITIAL_VISIBLE = 6;

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
  const [showAll, setShowAll] = useState(false);

  const chips = services
    .map((s) => ({ title: s.title, count: filterPortfolioByService(projects, s.title).length }))
    .filter((c) => c.count > 0);
  const filtered = filterPortfolioByService(projects, filter);
  const visible = showAll ? filtered : filtered.slice(0, INITIAL_VISIBLE);
  const hidden = filtered.length - visible.length;

  const select = (value: string | null) => {
    setFilter(value);
    setShowAll(false);
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

        <div className="mt-8 flex flex-wrap gap-2">
          <Chip active={filter === null} onClick={() => select(null)}>
            Semua ({projects.length})
          </Chip>
          {chips.map((c) => (
            <Chip key={c.title} active={filter === c.title} onClick={() => select(c.title)}>
              {c.title} ({c.count})
            </Chip>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-10 text-sm text-zinc-500">{portfolioHeading.empty}</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <article
                key={p.slug}
                className="flex flex-col overflow-hidden rounded-[28px] border border-line bg-surface-2"
              >
                <div className="relative aspect-[4/3] bg-[#232326]">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-end bg-[radial-gradient(circle_at_25%_20%,#3f3f46,#141416_70%)] p-5">
                      <span className="text-2xl font-extrabold leading-tight tracking-tight text-white/80">
                        {p.title}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col border-t border-line p-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-500">
                    {p.clientType}
                  </p>
                  <h3 className="mt-1.5 text-lg font-extrabold leading-snug tracking-tight text-white">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{p.description}</p>
                  <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
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

        {hidden > 0 && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="rounded-full border border-zinc-700 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/5"
            >
              Lihat semua project (+{hidden})
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
