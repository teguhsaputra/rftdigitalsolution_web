import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';

vi.mock('@/lib/prisma', () => ({ prisma: {} }));

import { Reveal } from '@/components/landing/reveal';
import { HeroSection } from '@/components/landing/hero-section';
import { FloatingCta } from '@/components/landing/floating-cta';
import { resolveBrandSettings } from '@/lib/brand-settings-db';

const brand = resolveBrandSettings({ whatsappNumber: '6281234567890' });

describe('server-rendered landing markup', () => {
  it('Reveal never ships content hidden by inline styles (reduced-motion / no-JS safe)', () => {
    const html = renderToString(<Reveal>halo</Reveal>);
    expect(html).toContain('halo');
    expect(html).not.toMatch(/opacity:\s*0/);
  });

  it('hero headline and CTA are visible without JavaScript', () => {
    const html = renderToString(<HeroSection brand={brand} projects={[]} partners={[]} />);
    expect(html).toContain('wa.me/6281234567890');
    expect(html).not.toMatch(/opacity:\s*0/);
    expect(html).not.toContain('reveal');
  });

  it('floating CTA starts inert so keyboard focus cannot land on it while hidden', () => {
    const html = renderToString(<FloatingCta brand={brand} />);
    expect(html).toMatch(/<div[^>]*\binert\b/);
  });
});

import { ServicesCarousel } from '@/components/landing/services-carousel';

it('collapsed service details are hidden from screen readers and linked to their toggle', () => {
  const services = [{ slug: 'web', title: 'Web', titleEn: 'Web', summary: 's', details: ['d1'], priceFrom: null }];
  const html = renderToString(<ServicesCarousel services={services} />);
  expect(html).toMatch(/<ul[^>]*id="layanan-detail-web"[^>]*aria-hidden="true"|<ul[^>]*aria-hidden="true"[^>]*id="layanan-detail-web"/);
  expect(html).toContain('aria-controls="layanan-detail-web"');
});

it('hero trust chip names real partners instead of a fake chat notification', () => {
  const partners = ['A', 'B', 'C', 'D'].map((name) => ({ name, imageUrl: null }));
  const html = renderToString(<HeroSection brand={brand} projects={[]} partners={partners} />);
  expect(html).toContain('Dipercaya 4+ klien');
  expect(html).toContain('A, B, C, dan lainnya');
  expect(html).not.toContain('Pesan baru masuk');
});

it('partner marquee repeats logos so one loop is wider than the screen (no gap)', async () => {
  const { PartnersMarquee } = await import('@/components/landing/partners-marquee');
  const partners = Array.from({ length: 10 }, (_, i) => ({ name: `P${i}`, imageUrl: `/p${i}.webp` }));
  const html = renderToString(<PartnersMarquee partners={partners} />);
  // 2 salinan × minimal 24 logo
  expect((html.match(/<button/g) ?? []).length).toBeGreaterThanOrEqual(48);
  expect(html).toContain('grayscale');
});

it('services are laid out in a grid (nothing clipped, no hidden horizontal scroll)', () => {
  const services = ['Web', 'Mobile', 'SEO', 'Brand', 'Sosmed'].map((t) => ({
    slug: t.toLowerCase(), title: t, titleEn: t, summary: 's', details: ['d'], priceFrom: null,
  }));
  const html = renderToString(<ServicesCarousel services={services} />);
  expect(html).not.toContain('overflow-x-auto');
  expect(html).toContain('lg:grid-cols-3');
  expect(html).not.toMatch(/Geser/);
  for (const s of services) expect(html).toContain(`>${s.title}<`);
});

it('navbar has no Karier link', async () => {
  const { SiteNavbar } = await import('@/components/landing/site-navbar');
  const html = renderToString(<SiteNavbar brand={brand} />);
  expect(html).not.toContain('#karier');
  expect(html).toContain('/#portofolio');
});

it('image URL field accepts site-relative paths (browser validation must not block admin forms)', async () => {
  const { ImageUpload } = await import('@/components/image-upload');
  const html = renderToString(<ImageUpload value="/portfolio/x.webp" onChange={() => {}} />);
  expect(html).toContain('value="/portfolio/x.webp"');
  expect(html).not.toContain('type="url"');
});
