import { describe, it, expect } from 'vitest';
import { normalizeWhatsAppNumber, buildWhatsAppUrl, getContactHref } from '@/lib/whatsapp';

describe('normalizeWhatsAppNumber', () => {
  it.each([
    ['0812-3456-7890', '6281234567890'],
    ['+62 812 3456 7890', '6281234567890'],
    ['6281234567890', '6281234567890'],
  ])('%s → %s', (raw, out) => expect(normalizeWhatsAppNumber(raw)).toBe(out));

  it('rejects empty/short', () => {
    expect(normalizeWhatsAppNumber('')).toBeNull();
    expect(normalizeWhatsAppNumber(null)).toBeNull();
    expect(normalizeWhatsAppNumber('0812')).toBeNull();
  });
});

describe('buildWhatsAppUrl', () => {
  it('encodes message', () =>
    expect(buildWhatsAppUrl('6281234567890', 'Halo RFT & tim')).toBe(
      'https://wa.me/6281234567890?text=Halo%20RFT%20%26%20tim'
    ));
  it('omits empty message', () =>
    expect(buildWhatsAppUrl('6281234567890', '')).toBe('https://wa.me/6281234567890'));
});

describe('getContactHref', () => {
  it('uses WA with topic as a follow-up sentence', () =>
    expect(
      getContactHref({ whatsappNumber: '0812-3456-7890', whatsappMessage: 'Halo RFT', topic: 'Branding' })
    ).toBe(buildWhatsAppUrl('6281234567890', 'Halo RFT. Saya mau tanya paket Branding.')));
  it('does not double the period after the base message', () =>
    expect(
      getContactHref({ whatsappNumber: '6281234567890', whatsappMessage: 'Halo RFT, mau konsultasi.', topic: 'SEO' })
    ).toBe(buildWhatsAppUrl('6281234567890', 'Halo RFT, mau konsultasi. Saya mau tanya paket SEO.')));
  it('falls back to email', () =>
    expect(getContactHref({ whatsappNumber: '', contactEmail: 'hi@rft.id' })).toBe('mailto:hi@rft.id'));
  it('falls back to #kontak', () => expect(getContactHref({})).toBe('#kontak'));
});

describe('normalizeWhatsAppNumber — formats that used to produce broken links', () => {
  it('adds the country code when the leading 0 is omitted', () =>
    expect(normalizeWhatsAppNumber('812-3456-7890')).toBe('6281234567890'));
  it('drops the 0 written after +62', () =>
    expect(normalizeWhatsAppNumber('+62 0812 3456 7890')).toBe('6281234567890'));
});
