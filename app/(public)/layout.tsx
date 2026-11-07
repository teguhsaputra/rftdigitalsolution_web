import { AnnouncementBar } from '@/components/landing/announcement-bar';
import { SiteNavbar } from '@/components/landing/site-navbar';
import { FloatingCta } from '@/components/landing/floating-cta';
import { ClosingSection } from '@/components/landing/closing-section';
import { getBrandSettings } from '@/lib/brand-settings-db';
import { getPublicCareers } from '@/lib/public-content';

export const dynamic = 'force-dynamic';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [brand, careers] = await Promise.all([getBrandSettings(), getPublicCareers()]);
  return (
    <>
      <AnnouncementBar />
      <SiteNavbar brand={brand} hasCareers={careers.length > 0} />
      <main className="min-h-screen">{children}</main>
      <ClosingSection brand={brand} />
      <FloatingCta brand={brand} />
    </>
  );
}
