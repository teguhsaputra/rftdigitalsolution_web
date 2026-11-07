import { prisma } from '@/lib/prisma';
import {
  aboutContent,
  coreServices,
  portfolioProjects,
  trustedPartners,
  type PortfolioItem,
  type ServiceItem,
  type TrustedPartnerItem,
} from '@/lib/marketing-data';
import { normalizePublicUrlForBrowser } from '@/lib/s3';

export const ABOUT_PAGE_ID = 'default';

export type AboutPublic = {
  headline: string;
  intro: string;
  body: string[];
  values: { title: string; text: string }[];
};

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === 'string');
}

function asValueArray(v: unknown): { title: string; text: string }[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((item) => {
      if (typeof item !== 'object' || item === null) return null;
      const o = item as Record<string, unknown>;
      if (typeof o.title !== 'string' || typeof o.text !== 'string') return null;
      return { title: o.title, text: o.text };
    })
    .filter((x): x is { title: string; text: string } => x !== null);
}

export async function getPublicServices(): Promise<ServiceItem[]> {
  try {
    const rows = await prisma.service.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
    });
    if (rows.length === 0) return coreServices;
    return rows.map((r) => ({
      slug: r.slug,
      title: r.title,
      titleEn: r.titleEn,
      summary: r.summary,
      details: asStringArray(r.details),
      priceFrom: r.priceFrom,
    }));
  } catch {
    return coreServices;
  }
}

export async function getPublicPortfolio(): Promise<PortfolioItem[]> {
  try {
    const rows = await prisma.portfolioProject.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
    });
    if (rows.length === 0) return portfolioProjects;
    return rows.map((r) => ({
      slug: r.slug,
      title: r.title,
      clientType: r.clientType,
      focus: r.focus,
      description: r.description,
      image: r.image ? normalizePublicUrlForBrowser(r.image) : null,
      services: asStringArray(r.services),
    }));
  } catch {
    return portfolioProjects;
  }
}

export async function getPublicAbout(): Promise<AboutPublic> {
  const fallback: AboutPublic = {
    headline: aboutContent.headline,
    intro: aboutContent.intro,
    body: [...aboutContent.body],
    values: aboutContent.values.map((v) => ({ ...v })),
  };
  try {
    const row = await prisma.aboutPage.findUnique({ where: { id: ABOUT_PAGE_ID } });
    if (!row) return fallback;
    return {
      headline: row.headline,
      intro: row.intro,
      body: asStringArray(row.body),
      values: asValueArray(row.values),
    };
  } catch {
    return fallback;
  }
}

export async function getPublicTrustedPartners(): Promise<TrustedPartnerItem[]> {
  try {
    const rows = await prisma.trustedPartner.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
    if (rows.length === 0) return trustedPartners;
    return rows.map((r) => ({ name: r.name, imageUrl: normalizePublicUrlForBrowser(r.imageUrl) }));
  } catch {
    return trustedPartners;
  }
}

/** Judul semua layanan (termasuk draft) untuk checklist di editor portofolio admin. */
export async function getServiceTitleOptions(): Promise<string[]> {
  try {
    const rows = await prisma.service.findMany({
      select: { title: true },
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
    });
    if (rows.length > 0) return rows.map((r) => r.title);
  } catch {
    // DB belum siap — pakai daftar bawaan.
  }
  return coreServices.map((s) => s.title);
}
