'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

/** Muncul pelan saat discroll; tanpa animasi bila pengguna memilih reduced motion. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Eyebrow kecil huruf kapital dengan titik, dipakai di atas judul section. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-400">
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {children}
    </p>
  );
}

/** Judul section: teks tebal + kata aksen serif miring. */
export function SectionTitle({
  title,
  accent,
  titleEnd,
  className = '',
}: {
  title: string;
  accent: string;
  titleEnd?: string;
  className?: string;
}) {
  return (
    <h2
      className={`heading-display mt-3 max-w-3xl text-[clamp(2rem,5vw,3.4rem)] leading-[1.02] text-white ${className}`}
    >
      {title} <span className="font-serif-accent text-zinc-400">{accent}</span>
      {titleEnd ? ` ${titleEnd}` : null}
    </h2>
  );
}
