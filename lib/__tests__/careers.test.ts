import { describe, it, expect, vi } from 'vitest';

const { findMany } = vi.hoisted(() => ({ findMany: vi.fn() }));
vi.mock('@/lib/prisma', () => ({ prisma: { careerOpening: { findMany } } }));

import { getPublicCareers } from '@/lib/public-content';

describe('getPublicCareers', () => {
  it('returns no openings when the admin has none published (section hides)', async () => {
    findMany.mockResolvedValueOnce([]);
    expect(await getPublicCareers()).toEqual([]);
  });

  it('shows no openings (never sample jobs) when the database is unreachable', async () => {
    findMany.mockRejectedValueOnce(new Error('db down'));
    const result = await getPublicCareers();
    expect(result).toEqual([]);
  });
});
