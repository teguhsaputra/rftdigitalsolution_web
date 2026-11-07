import { HeroSection } from '@/components/landing/hero-section';
import { ServiceMarquee } from '@/components/landing/service-marquee';
import { PartnersMarquee } from '@/components/landing/partners-marquee';
import { StatementSection } from '@/components/landing/statement-section';
import { ServicesCarousel } from '@/components/landing/services-carousel';
import { PortfolioGallery } from '@/components/landing/portfolio-gallery';
import { ProcessSteps } from '@/components/landing/process-steps';
import { PricingCards } from '@/components/landing/pricing-cards';
import { getBrandSettings } from '@/lib/brand-settings-db';
import {
  getPublicPortfolio,
  getPublicServices,
  getPublicTrustedPartners,
} from '@/lib/public-content';

export default async function Home() {
  const [brand, services, projects, partners] = await Promise.all([
    getBrandSettings(),
    getPublicServices(),
    getPublicPortfolio(),
    getPublicTrustedPartners(),
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
    </>
  );
}
