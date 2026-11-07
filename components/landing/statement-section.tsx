import { statement } from '@/lib/landing-copy';
import { Reveal } from '@/components/landing/reveal';

/** Kalimat raksasa dengan cahaya bulat di belakangnya (gaya "NGAJAR ITU CAPEK"). */
export function StatementSection() {
  return (
    <section className="relative overflow-hidden px-4 py-28 text-center sm:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[min(560px,90vw)] w-[min(560px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/15 bg-[radial-gradient(circle,rgba(255,255,255,0.18),rgba(255,255,255,0.04)_45%,transparent_70%)]"
      />
      <Reveal className="relative">
        <p className="heading-display text-[clamp(2.2rem,8vw,6rem)] text-zinc-500">{statement.lineOne}</p>
        <p className="heading-display text-[clamp(2.2rem,8vw,6rem)] text-white [text-shadow:0_0_60px_rgba(255,255,255,0.35)]">
          {statement.lineTwo}
        </p>
        <p className="mt-6 text-[11px] font-bold tracking-[0.4em] text-zinc-400 sm:text-xs">{statement.sub}</p>
      </Reveal>
    </section>
  );
}
