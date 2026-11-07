'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Muncul pelan saat discroll. Markup server & client identik (tanpa inline style);
 * status tersembunyi hanya dipasang lewat CSS bila JS aktif (`html.js`) dan pengguna
 * tidak memilih reduced motion — lihat `.reveal` di globals.css.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      // Browser lama: langsung tampilkan.
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -80px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn('reveal', shown && 'is-visible', className)}
      style={delay ? ({ '--reveal-delay': `${delay}s` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
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
