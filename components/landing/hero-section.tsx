import Image from 'next/image';
import { ArrowDown, MessageCircle, ShieldCheck } from 'lucide-react';
import type { BrandSettingsPublic } from '@/lib/brand-settings-db';
import type { PortfolioItem } from '@/lib/marketing-data';
import { hero } from '@/lib/landing-copy';
import { ContactButton } from '@/components/landing/contact-button';

/** Posisi kartu mengambang (kiri-kanan judul). Dua yang luar diburamkan. */
const floatSlots = [
  'left-[3%] top-[8%] -rotate-[8deg]',
  'right-[3%] top-[14%] rotate-[7deg]',
  'left-[8%] bottom-[6%] rotate-[5deg] blur-[2px] opacity-50',
  'right-[9%] bottom-[2%] -rotate-[6deg] blur-[2px] opacity-50',
];

function FloatingCard({ project, slot }: { project: PortfolioItem; slot: string }) {
  return (
    <div
      aria-hidden
      className={`absolute hidden w-[150px] overflow-hidden rounded-[22px] border-[3px] border-zinc-700 bg-surface-2 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)] md:block xl:w-[170px] ${slot}`}
    >
      <div className="flex items-center justify-between px-3 pt-2 text-[9px] font-semibold text-zinc-400">
        <span>09.41</span>
        <span className="h-1.5 w-10 rounded-full bg-black" />
        <span>5G</span>
      </div>
      <div className="relative mx-2 mt-2 aspect-[4/5] overflow-hidden rounded-xl bg-[#232326]">
        {project.image ? (
          <Image
            src={project.image}
            alt=""
            fill
            unoptimized
            className="object-cover"
            sizes="170px"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#3f3f46,#141416_70%)]" />
        )}
      </div>
      <div className="px-3 pb-3 pt-2">
        <p className="line-clamp-2 text-[11px] font-bold leading-tight text-white">
          {project.title}
        </p>
        <p className="mt-0.5 truncate text-[9px] text-zinc-500">{project.clientType}</p>
      </div>
    </div>
  );
}

export function HeroSection({
  brand,
  projects,
}: {
  brand: BrandSettingsPublic;
  projects: PortfolioItem[];
}) {
  const floating = projects.slice(0, floatSlots.length);

  return (
    <section
      id="beranda"
      className="relative -mt-16 overflow-hidden px-4 pb-20 pt-32 text-center sm:pt-36 lg:min-h-[760px]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[46%] h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_62%)]"
      />
      {floating.map((p, i) => (
        <FloatingCard key={p.slug} project={p} slot={floatSlots[i]} />
      ))}

      <div className="relative mx-auto max-w-4xl motion-safe:animate-[hero-in_0.7s_cubic-bezier(0.22,1,0.36,1)_both]">
        <div className="mx-auto mb-8 flex w-fit max-w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-left backdrop-blur">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-[#09090b]">
            <MessageCircle className="h-4 w-4" aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="flex items-center gap-2 text-xs font-bold text-white">
              {hero.notification.title}
              <span className="font-medium text-zinc-500">{hero.notification.time}</span>
            </span>
            <span className="block truncate text-[11px] text-zinc-400">
              {hero.notification.text}
            </span>
          </span>
        </div>
        <h1 className="heading-display text-[clamp(2.75rem,8.5vw,6rem)] text-white">
          <span className="text-zinc-300">{hero.lineMuted}</span>
          <br />
          <span className="text-strike-orange text-zinc-500">{hero.lineStruck}</span>
          <br />
          {hero.lineMain} <span className="font-serif-accent">{hero.lineAccent}</span>.
        </h1>
        <p className="mx-auto mt-7 max-w-xl text-base font-bold text-white sm:text-lg">
          {hero.lead}
        </p>
        <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-zinc-400">
          {hero.body}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ContactButton brand={brand} label={hero.primaryCta} arrow />
          <a
            href="#portofolio"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-700 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/5"
          >
            <ArrowDown className="h-4 w-4" aria-hidden />
            {hero.secondaryCta}
          </a>
        </div>
        <p className="mx-auto mt-5 flex max-w-md items-center justify-center gap-2 text-xs text-zinc-500">
          <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden />
          {hero.reassurance}
        </p>
      </div>
    </section>
  );
}
