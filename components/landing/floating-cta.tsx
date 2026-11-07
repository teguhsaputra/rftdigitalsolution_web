'use client';

import { useEffect, useState } from 'react';
import type { BrandSettingsPublic } from '@/lib/brand-settings-db';
import { floatingCta } from '@/lib/landing-copy';
import { ContactButton } from '@/components/landing/contact-button';
import { cn } from '@/lib/utils';

/** Pil CTA di pojok kanan bawah; muncul setelah melewati hero. */
export function FloatingCta({ brand }: { brand: BrandSettingsPublic }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        'fixed bottom-4 right-4 z-40 flex items-center gap-3 rounded-full border border-white/10 bg-[#18181b]/90 py-1.5 pl-4 pr-1.5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.9)] backdrop-blur-md transition-all duration-300 motion-reduce:transition-none',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      )}
    >
      <span className="hidden leading-tight sm:block">
        <span className="block text-[13px] font-bold text-white">{floatingCta.title}</span>
        <span className="block text-[11px] text-zinc-500">{floatingCta.sub}</span>
      </span>
      <ContactButton
        brand={brand}
        label={floatingCta.button}
        variant="compact"
        className={visible ? '' : 'pointer-events-none'}
      />
    </div>
  );
}
