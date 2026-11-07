import type { ServiceItem } from '@/lib/marketing-data';

function Band({
  items,
  className,
  animation,
}: {
  items: string[];
  className: string;
  animation: string;
}) {
  // Diulang supaya pita cukup panjang lalu digandakan untuk loop mulus (-50%).
  const row = Array.from({ length: 4 }, () => items).flat();
  return (
    <div className={`overflow-hidden py-3.5 ${className}`}>
      <div className={`flex w-max ${animation}`}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {row.map((t, i) => (
              <span key={`${copy}-${i}`} className="flex items-center">
                <span className="px-6 text-[13px] font-extrabold uppercase tracking-[0.1em]">{t}</span>
                <span className="text-accent-orange">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Dua pita miring berisi nama layanan, bergerak berlawanan arah. */
export function ServiceMarquee({ services }: { services: ServiceItem[] }) {
  const titles = services.map((s) => s.title);
  if (titles.length === 0) return null;
  const half = Math.ceil(titles.length / 2);
  const second = [...titles.slice(half), ...titles.slice(0, half)];

  return (
    <section aria-label="Layanan RFT" className="relative z-10 overflow-hidden py-10 [&>div]:-mx-6">
      <Band
        items={titles}
        animation="animate-marquee"
        className="relative z-10 -rotate-2 bg-white text-[#09090b] shadow-[0_20px_40px_-20px_rgba(0,0,0,0.9)]"
      />
      <Band
        items={second}
        animation="animate-marquee-reverse"
        className="-mt-4 rotate-[1.5deg] border-y border-line bg-surface-2 text-zinc-200"
      />
    </section>
  );
}
