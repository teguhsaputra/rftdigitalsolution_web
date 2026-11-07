import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/prisma', () => ({ prisma: {} }));

import { resolveBrandSettings } from '@/lib/brand-settings-db';
import { DEFAULT_CONTACT_EMAIL, DEFAULT_WHATSAPP_MESSAGE } from '@/lib/brand';

describe('resolveBrandSettings', () => {
  it('uses fallbacks when there is no row', () => {
    expect(resolveBrandSettings(null)).toEqual({
      logoUrl: '/brand-logo.webp',
      logoMarkUrl: '/brand-mark.webp',
      whatsappNumber: null,
      whatsappMessage: DEFAULT_WHATSAPP_MESSAGE,
      contactEmail: DEFAULT_CONTACT_EMAIL,
    });
  });

  it('treats the legacy seeded svg and empty values as unset', () => {
    expect(resolveBrandSettings({ logoUrl: '/brand-logo.svg' }).logoUrl).toBe('/brand-logo.webp');
    expect(resolveBrandSettings({ logoUrl: '' }).logoUrl).toBe('/brand-logo.webp');
    expect(resolveBrandSettings({ logoMarkUrl: '  ' }).logoMarkUrl).toBe('/brand-mark.webp');
  });

  it('rewrites the internal minio host for the browser', () => {
    expect(resolveBrandSettings({ logoUrl: 'http://minio:9000/b/x.png' }).logoUrl).toBe(
      'http://localhost:9000/b/x.png'
    );
  });

  it('defaults empty email/message and keeps the stored number', () => {
    const r = resolveBrandSettings({ whatsappNumber: '6281234567890', contactEmail: '', whatsappMessage: '' });
    expect(r.contactEmail).toBe(DEFAULT_CONTACT_EMAIL);
    expect(r.whatsappMessage).toBe(DEFAULT_WHATSAPP_MESSAGE);
    expect(r.whatsappNumber).toBe('6281234567890');
  });
});

import { toBrandFormValues } from '@/lib/brand-settings-db';

describe('toBrandFormValues (admin form)', () => {
  it('shows unset and legacy values as empty so defaults are never written back', () => {
    expect(toBrandFormValues({ logoUrl: '/brand-logo.svg', whatsappMessage: null })).toEqual({
      logoUrl: '',
      logoMarkUrl: '',
      whatsappNumber: '',
      whatsappMessage: '',
      contactEmail: '',
    });
    expect(toBrandFormValues(null).contactEmail).toBe('');
  });

  it('keeps stored values exactly as saved (no minio→localhost rewrite)', () => {
    const v = toBrandFormValues({ logoUrl: 'http://minio:9000/b/x.png', contactEmail: 'hi@rft.id' });
    expect(v.logoUrl).toBe('http://minio:9000/b/x.png');
    expect(v.contactEmail).toBe('hi@rft.id');
  });
});
