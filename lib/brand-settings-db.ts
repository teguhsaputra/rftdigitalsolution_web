import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { normalizePublicUrlForBrowser } from '@/lib/s3';
import {
  BRAND_LOGO_FALLBACK_SRC,
  BRAND_MARK_FALLBACK_SRC,
  BRAND_SETTINGS_ID,
  DEFAULT_WHATSAPP_MESSAGE,
  LEGACY_LOGO_SRCS,
} from '@/lib/brand';

export type BrandSettingsPublic = {
  logoUrl: string;
  logoMarkUrl: string;
  whatsappNumber: string | null;
  whatsappMessage: string;
};

type BrandSettingsInput = {
  logoUrl?: string | null;
  logoMarkUrl?: string | null;
  whatsappNumber?: string | null;
  whatsappMessage?: string | null;
};

function clean(v: string | null | undefined): string | null {
  const t = v?.trim();
  return t ? t : null;
}

function imageOr(v: string | null | undefined, fallback: string): string {
  const t = clean(v);
  if (!t || LEGACY_LOGO_SRCS.includes(t)) return fallback;
  return normalizePublicUrlForBrowser(t);
}

/** Pure: gabungkan baris DB (boleh null) dengan default brand. */
export function resolveBrandSettings(row: BrandSettingsInput | null): BrandSettingsPublic {
  return {
    logoUrl: imageOr(row?.logoUrl, BRAND_LOGO_FALLBACK_SRC),
    logoMarkUrl: imageOr(row?.logoMarkUrl, BRAND_MARK_FALLBACK_SRC),
    whatsappNumber: clean(row?.whatsappNumber),
    whatsappMessage: clean(row?.whatsappMessage) ?? DEFAULT_WHATSAPP_MESSAGE,
  };
}

/** Nilai mentah untuk form admin: '' = belum diatur (pakai bawaan); tidak ada fallback yang ikut tersimpan. */
export type BrandFormValues = {
  logoUrl: string;
  logoMarkUrl: string;
  whatsappNumber: string;
  whatsappMessage: string;
};

export function toBrandFormValues(row: BrandSettingsInput | null): BrandFormValues {
  const raw = (v: string | null | undefined) => clean(v) ?? '';
  const image = (v: string | null | undefined) => {
    const t = raw(v);
    return LEGACY_LOGO_SRCS.includes(t) ? '' : t;
  };
  return {
    logoUrl: image(row?.logoUrl),
    logoMarkUrl: image(row?.logoMarkUrl),
    whatsappNumber: raw(row?.whatsappNumber),
    whatsappMessage: raw(row?.whatsappMessage),
  };
}

export async function getBrandFormValues(): Promise<BrandFormValues> {
  const row = await prisma.brandSettings.findUnique({ where: { id: BRAND_SETTINGS_ID } });
  return toBrandFormValues(row);
}

/** Di-cache per request (layout + halaman memakai data yang sama). */
export const getBrandSettings = cache(
  async function getBrandSettings(): Promise<BrandSettingsPublic> {
    try {
      const row = await prisma.brandSettings.findUnique({ where: { id: BRAND_SETTINGS_ID } });
      return resolveBrandSettings(row);
    } catch {
      return resolveBrandSettings(null);
    }
  },
);

/** Simpan field yang dikirim; string kosong disimpan sebagai null. */
export async function upsertBrandSettings(data: BrandSettingsInput): Promise<void> {
  const fields: BrandSettingsInput = {};
  for (const key of Object.keys(data) as (keyof BrandSettingsInput)[]) {
    if (data[key] !== undefined) fields[key] = clean(data[key]);
  }
  await prisma.brandSettings.upsert({
    where: { id: BRAND_SETTINGS_ID },
    create: { id: BRAND_SETTINGS_ID, ...fields },
    update: fields,
  });
}
