import { HeroSection } from '@/components/landing/hero-section';
import { ServiceMarquee } from '@/components/landing/service-marquee';
import { PartnersMarquee } from '@/components/landing/partners-marquee';
import { StatementSection } from '@/components/landing/statement-section';
import { ServicesCarousel } from '@/components/landing/services-carousel';
import { PortfolioGallery } from '@/components/landing/portfolio-gallery';
import { ProcessSteps } from '@/components/landing/process-steps';
import { PricingCards } from '@/components/landing/pricing-cards';
import { AboutSection } from '@/components/landing/about-section';
import { CareersSection } from '@/components/landing/careers-section';
import { BlogPreview } from '@/components/landing/blog-preview';
import { FaqSection } from '@/components/landing/faq-section';
import { getBrandSettings } from '@/lib/brand-settings-db';
import { getPublishedPostSummaries } from '@/lib/blog-public';
import {
  getPublicAbout,
  getPublicCareers,
  getPublicPortfolio,
  getPublicServices,
  getPublicTrustedPartners,
} from '@/lib/public-content';

export default async function Home() {
  const [brand, services, projects, partners, about, careers, posts] = await Promise.all([
    getBrandSettings(),
    getPublicServices(),
    getPublicPortfolio(),
    getPublicTrustedPartners(),
    getPublicAbout(),
    getPublicCareers(),
    // Beranda tetap tampil walau database blog bermasalah.
    getPublishedPostSummaries({ take: 3 }).catch(() => []),
  ]);

  return (
    <>
      <HeroSection brand={brand} projects={projects} />
      <ServiceMarquee services={services} />
      <PartnersMarquee partners={partners} />
      <StatementSection />
      <ServicesCarousel services={services} />
      <PortfolioGallery projects={projects} services={services} />
      <ProcessSteps />
      <PricingCards services={services} brand={brand} />
      <AboutSection about={about} />
      <CareersSection careers={careers} brand={brand} />
      <BlogPreview posts={posts} />
      <FaqSection />
    </>
  );
}
