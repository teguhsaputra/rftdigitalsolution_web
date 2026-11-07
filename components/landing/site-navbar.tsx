'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useUIStore } from '@/store/useUIStore';
import type { BrandSettingsPublic } from '@/lib/brand-settings-db';
import { BRAND_LOGO_ALT, BRAND_SHORT_NAME, BRAND_TAGLINE } from '@/lib/brand';
import { navLinks } from '@/lib/landing-copy';
import { ContactButton } from '@/components/landing/contact-button';

export function SiteNavbar({
  brand,
  hasCareers = true,
}: {
  brand: BrandSettingsPublic;
  hasCareers?: boolean;
}) {
  const { isMobileMenuOpen, closeMobileMenu, openMobileMenu } = useUIStore();
  const links = navLinks.filter((l) => hasCareers || !('id' in l && l.id === 'karier'));

  return (
    <header className="pointer-events-none sticky top-3 z-50 px-4">
      <nav
        aria-label="Navigasi utama"
        className="pointer-events-auto mx-auto flex w-full max-w-[860px] items-center justify-between gap-3 rounded-full border border-white/10 bg-[#18181b]/75 py-1.5 pl-2 pr-1.5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md"
      >
        <Link href="/" className="flex min-w-0 items-center gap-2.5" onClick={closeMobileMenu}>
          <Image
            src={brand.logoMarkUrl}
            alt={BRAND_LOGO_ALT}
            width={34}
            height={34}
            unoptimized
            className="h-[34px] w-[34px] shrink-0 rounded-[10px] border border-line bg-black object-cover"
          />
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-extrabold tracking-tight text-white">
              {BRAND_SHORT_NAME}
            </span>
            <span className="hidden truncate text-[10px] text-zinc-500 sm:block">{BRAND_TAGLINE}</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-5 text-[13px] font-medium text-zinc-400 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="transition-colors hover:text-white">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-1">
          <ContactButton brand={brand} label="Chat WhatsApp" shortLabel="Chat WA" variant="compact" />
          <button
            type="button"
            onClick={openMobileMenu}
            aria-label="Buka menu"
            className="grid h-9 w-9 place-items-center rounded-full text-zinc-300 hover:bg-white/5 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      <Sheet open={isMobileMenuOpen} onOpenChange={(o) => (o ? openMobileMenu() : closeMobileMenu())}>
        <SheetContent side="right" className="border-line bg-[#09090b] p-6">
          <SheetTitle className="text-left text-sm font-extrabold">{BRAND_SHORT_NAME}</SheetTitle>
          <ul className="mt-6 space-y-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={closeMobileMenu}
                  className="block rounded-xl px-3 py-3 text-lg font-bold tracking-tight text-zinc-200 hover:bg-white/5"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <ContactButton brand={brand} label="Chat WhatsApp" className="mt-6 w-full" />
        </SheetContent>
      </Sheet>
    </header>
  );
}
