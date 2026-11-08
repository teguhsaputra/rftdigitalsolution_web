import { describe, it, expect, vi } from 'vitest';
import type { PrismaClient } from '@prisma/client';
import { seedMarketingContent } from '../../prisma/seed-marketing-content';
import { legacyPortfolioSlugs, portfolioProjects, trustedPartners } from '@/lib/marketing-data';

function fakePrisma(existingPartnerNames: string[]) {
  const upsert = vi.fn().mockResolvedValue({});
  const updateMany = vi.fn().mockResolvedValue({ count: 0 });
  const prisma = {
    brandSettings: { upsert, updateMany },
    aboutPage: { upsert },
    service: { upsert },
    portfolioProject: { upsert, updateMany },
    trustedPartner: {
      findFirst: vi.fn(async ({ where }: { where: { name: string } }) =>
        existingPartnerNames.includes(where.name) ? { id: 'x' } : null
      ),
      create: vi.fn().mockResolvedValue({}),
    },
  };
  return { prisma, upsert, updateMany };
}

describe('seedMarketingContent', () => {
  it('creates only the partners that do not exist yet (keeps admin edits)', async () => {
    const { prisma } = fakePrisma(['Reliprove']);
    await seedMarketingContent(prisma as unknown as PrismaClient);
    const created = prisma.trustedPartner.create.mock.calls.map((c) => c[0].data.name);
    expect(created).toHaveLength(trustedPartners.length - 1);
    expect(created).not.toContain('Reliprove');
  });

  it('does not seed career openings (careers feature removed)', async () => {
    const { prisma } = fakePrisma([]);
    await expect(seedMarketingContent(prisma as unknown as PrismaClient)).resolves.not.toThrow();
  });

  it('hides the old fictional sample projects', async () => {
    const { prisma } = fakePrisma([]);
    await seedMarketingContent(prisma as unknown as PrismaClient);
    expect(prisma.portfolioProject.updateMany).toHaveBeenCalledWith({
      where: { slug: { in: legacyPortfolioSlugs } },
      data: { published: false },
    });
  });

  it('creates portfolio projects with their images, without overwriting an existing image', async () => {
    const { prisma } = fakePrisma([]);
    await seedMarketingContent(prisma as unknown as PrismaClient);
    const calls = prisma.portfolioProject.upsert.mock.calls.map((c) => c[0]);
    const first = calls.find((c) => c.where.slug === portfolioProjects[0].slug);
    expect(first.create.image).toBe(portfolioProjects[0].image);
    expect(first.update).not.toHaveProperty('image');
    expect(prisma.portfolioProject.updateMany).toHaveBeenCalledWith({
      where: { slug: portfolioProjects[0].slug, image: null },
      data: { image: portfolioProjects[0].image },
    });
  });
});
