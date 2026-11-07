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
