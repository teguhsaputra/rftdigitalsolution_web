import { ArrowRight, MessageCircle } from 'lucide-react';
import type { BrandSettingsPublic } from '@/lib/brand-settings-db';
import { getContactHref } from '@/lib/whatsapp';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'outline' | 'compact';

const styles: Record<Variant, string> = {
  primary:
    'bg-white text-[#09090b] hover:bg-zinc-200 px-6 py-3.5 text-sm shadow-[0_10px_40px_-12px_rgba(255,255,255,0.45)]',
  outline: 'border border-zinc-700 text-white hover:bg-white/5 px-6 py-3.5 text-sm',
  compact: 'bg-white text-[#09090b] hover:bg-zinc-200 px-4 py-2 text-[13px]',
};

/** Tombol kontak utama: WhatsApp (tanpa email). Bila nomor WA belum diatur, menuju #kontak. */
export function ContactButton({
  brand,
  topic,
  label,
  shortLabel,
  variant = 'primary',
  arrow = false,
  className,
}: {
  brand: BrandSettingsPublic;
  topic?: string;
  label: string;
  /** Label lebih pendek untuk layar < 640px. */
  shortLabel?: string;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
}) {
  const href = getContactHref({ ...brand, topic });
  const external = href.startsWith('http');

  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
        styles[variant],
        className
      )}
    >
      {variant !== 'compact' && <MessageCircle className="h-4 w-4" aria-hidden />}
      {shortLabel ? (
        <>
          <span className="sm:hidden">{shortLabel}</span>
          <span className="hidden sm:inline">{label}</span>
        </>
      ) : (
        label
      )}
      {arrow && <ArrowRight className="h-4 w-4" aria-hidden />}
    </a>
  );
}
