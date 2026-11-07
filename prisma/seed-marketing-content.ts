import type { PrismaClient } from '@prisma/client';
import {
  aboutContent,
  careerOpenings,
  coreServices,
  legacyPortfolioSlugs,
  portfolioProjects,
  trustedPartners,
} from '../lib/marketing-data';
import { ABOUT_PAGE_ID } from '../lib/public-content';
import { BRAND_SETTINGS_ID, DEFAULT_WHATSAPP_MESSAGE, LEGACY_LOGO_SRCS } from '../lib/brand';

/**
 * Seed / upsert: About (satu dokumen), Layanan, Portfolio, Mitra, Karier.
 * Dipakai oleh `prisma/seed.ts` dan skrip `npm run db:seed:marketing`.
 */
export async function seedMarketingContent(prisma: PrismaClient) {
  await prisma.brandSettings.upsert({
    where: { id: BRAND_SETTINGS_ID },
    create: { id: BRAND_SETTINGS_ID, logoUrl: null, whatsappMessage: DEFAULT_WHATSAPP_MESSAGE },
    update: {},
  });
  // Seed lama menyimpan logo /brand-logo.svg — kosongkan supaya logo baru (fallback) yang tampil.
  await prisma.brandSettings.updateMany({
    where: { id: BRAND_SETTINGS_ID, logoUrl: { in: LEGACY_LOGO_SRCS } },
    data: { logoUrl: null },
  });

  await prisma.aboutPage.upsert({
    where: { id: ABOUT_PAGE_ID },
    create: {
      id: ABOUT_PAGE_ID,
      headline: aboutContent.headline,
      intro: aboutContent.intro,
      body: aboutContent.body,
      values: aboutContent.values,
    },
    update: {
      headline: aboutContent.headline,
      intro: aboutContent.intro,
      body: aboutContent.body,
      values: aboutContent.values,
    },
  });

  let sort = 0;
  for (const s of coreServices) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      create: {
        slug: s.slug,
        title: s.title,
        titleEn: s.titleEn,
        summary: s.summary,
        details: s.details,
        priceFrom: s.priceFrom,
        sortOrder: sort++,
        published: true,
      },
      update: {
        title: s.title,
        titleEn: s.titleEn,
        summary: s.summary,
        details: s.details,
        sortOrder: sort - 1,
        published: true,
      },
    });
  }

  sort = 0;
  for (const p of portfolioProjects) {
    await prisma.portfolioProject.upsert({
      where: { slug: p.slug },
      create: {
        slug: p.slug,
        title: p.title,
        clientType: p.clientType,
        focus: p.focus,
        description: p.description,
        image: p.image ?? null,
        services: p.services,
        sortOrder: sort++,
        published: true,
      },
      update: {
        title: p.title,
        clientType: p.clientType,
        focus: p.focus,
        description: p.description,
        services: p.services,
        sortOrder: sort - 1,
        published: true,
      },
    });
    // Isi gambar hanya bila belum ada (jangan timpa gambar yang diunggah lewat admin).
    if (p.image) {
      await prisma.portfolioProject.updateMany({
        where: { slug: p.slug, image: null },
        data: { image: p.image },
      });
    }
  }
  // Contoh project lama (fiktif) disembunyikan, tidak dihapus.
  await prisma.portfolioProject.updateMany({
    where: { slug: { in: legacyPortfolioSlugs } },
    data: { published: false },
  });

  // Mitra: buat yang belum ada saja, supaya perubahan dari admin tidak tertimpa.
  sort = 0;
  for (const partner of trustedPartners) {
    const existing = await prisma.trustedPartner.findFirst({ where: { name: partner.name } });
    if (!existing && partner.imageUrl) {
      await prisma.trustedPartner.create({
        data: { name: partner.name, imageUrl: partner.imageUrl, sortOrder: sort, published: true },
      });
    }
    sort++;
  }

  sort = 0;
  for (const c of careerOpenings) {
    await prisma.careerOpening.upsert({
      where: { slug: c.slug },
      create: {
        slug: c.slug,
        title: c.title,
        location: c.location,
        type: c.type,
        description: c.description,
        responsibilities: c.responsibilities,
        sortOrder: sort++,
        published: true,
      },
      update: {
        title: c.title,
        location: c.location,
        type: c.type,
        description: c.description,
        responsibilities: c.responsibilities,
        sortOrder: sort - 1,
        published: true,
      },
    });
  }
}
