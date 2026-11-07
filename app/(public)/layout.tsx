import { AnnouncementBar } from '@/components/landing/announcement-bar';
import { SiteNavbar } from '@/components/landing/site-navbar';
import { FloatingCta } from '@/components/landing/floating-cta';
import { ClosingSection } from '@/components/landing/closing-section';
import { getBrandSettings } from '@/lib/brand-settings-db';

export const dynamic = 'force-dynamic';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const brand = await getBrandSettings();
  return (
    <>
      <AnnouncementBar />
      <SiteNavbar brand={brand} />
      <main className="min-h-screen">{children}</main>
      <ClosingSection brand={brand} />
      <FloatingCta brand={brand} />
    </>
  );
}
