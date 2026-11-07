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
    const html = renderToString(<HeroSection brand={brand} projects={[]} />);
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
