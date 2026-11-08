import Image from 'next/image';
import Link from 'next/link';
import type { BrandSettingsPublic } from '@/lib/brand-settings-db';
import { BRAND_LOGO_ALT, BRAND_NAME } from '@/lib/brand';
import { closing } from '@/lib/landing-copy';
import { ContactButton } from '@/components/landing/contact-button';

const footerLinks = [
  { href: '/#layanan', label: 'Layanan' },
  { href: '/#harga', label: 'Harga' },
  { href: '/blog', label: 'Blog' },
  { href: '/privacy', label: 'Kebijakan Privasi' },
  { href: '/terms', label: 'Syarat' },
];

/** Section penutup + footer (id="kontak"). */
export function ClosingSection({ brand }: { brand: BrandSettingsPublic }) {
  const year = new Date().getFullYear();

  return (
    <footer
      id="kontak"
      className="relative mx-2 mt-24 scroll-mt-24 overflow-hidden rounded-t-[32px] border border-b-0 border-line bg-[radial-gradient(ellipse_at_50%_15%,#1f1f23_0%,#09090b_65%)] px-5 pb-10 pt-16 text-center sm:mx-4 sm:pt-20"
    >
      <Image
        src={brand.logoUrl}
        alt={BRAND_LOGO_ALT}
        width={150}
        height={150}
        unoptimized
        className="mx-auto h-[120px] w-[120px] rounded-3xl object-cover sm:h-[150px] sm:w-[150px]"
      />
      <p className="mx-auto mt-6 max-w-md text-sm text-zinc-400">{closing.lead}</p>
      <h2 className="heading-display mx-auto mt-4 max-w-3xl text-[clamp(2.1rem,6vw,3.75rem)] text-white">
        {closing.lineOne} <span className="font-serif-accent text-zinc-400">{closing.accent}</span>
        {closing.lineEnd}
      </h2>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ContactButton brand={brand} label={closing.primaryCta} arrow />
      </div>
      <p className="mt-4 text-xs text-zinc-500">{closing.note}</p>

      <div className="mx-auto mt-16 flex max-w-5xl flex-col items-center justify-between gap-4 border-t border-line pt-6 text-xs text-zinc-500 sm:flex-row">
        <span>
          © {year} {BRAND_NAME}
        </span>
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          {footerLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
