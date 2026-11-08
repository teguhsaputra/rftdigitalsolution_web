import { describe, it, expect } from 'vitest';
import { brandSettingsUpdateSchema } from '@/lib/brand-settings-schema';

describe('brandSettingsUpdateSchema', () => {
  it('saves WA without any logo, normalizes the number and drops a contact email', () => {
    const r = brandSettingsUpdateSchema.parse({ whatsappNumber: '0812-3456-7890', contactEmail: 'hi@rft.id' });
    expect(r).toEqual({ whatsappNumber: '6281234567890' });
  });

  it('accepts empty strings, relative paths and full URLs for logos', () => {
    expect(brandSettingsUpdateSchema.safeParse({ logoUrl: '' }).success).toBe(true);
    expect(brandSettingsUpdateSchema.safeParse({ logoUrl: '/brand-logo.webp' }).success).toBe(true);
    expect(brandSettingsUpdateSchema.safeParse({ logoMarkUrl: 'https://s3.example.com/b/x.png' }).success).toBe(true);
    expect(brandSettingsUpdateSchema.safeParse({ logoUrl: 'not a url' }).success).toBe(false);
  });

  it('rejects an invalid WhatsApp number with an Indonesian message', () => {
    const r = brandSettingsUpdateSchema.safeParse({ whatsappNumber: 'abc' });
    expect(r.success).toBe(false);
    expect(r.error?.issues[0].message).toBe('Nomor WhatsApp tidak valid');
  });

  it('keeps an empty WhatsApp number as empty (clears it)', () => {
    expect(brandSettingsUpdateSchema.parse({ whatsappNumber: '' })).toEqual({ whatsappNumber: '' });
  });

});

it('rejects protocol-relative logo URLs that point to another host', () => {
  expect(brandSettingsUpdateSchema.safeParse({ logoUrl: '//evil.example/x.png' }).success).toBe(false);
});
