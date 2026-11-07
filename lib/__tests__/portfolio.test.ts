import { describe, it, expect } from 'vitest';
import { filterPortfolioByService } from '@/lib/portfolio';

describe('filterPortfolioByService', () => {
  const items = [{ services: [' pembuatan website '] }, { services: ['Branding'] }];

  it('matches service names ignoring case and surrounding spaces', () =>
    expect(filterPortfolioByService(items, 'Pembuatan Website')).toEqual([items[0]]));
  it('returns everything for the "Semua" filter (null)', () =>
    expect(filterPortfolioByService(items, null)).toEqual(items));
  it('returns nothing when no project uses the service', () =>
    expect(filterPortfolioByService(items, 'SEO Management')).toEqual([]));
});

import { mergeServiceOptions } from '@/lib/portfolio';

describe('mergeServiceOptions (admin checklist)', () => {
  it('maps legacy tags that differ only in case/spaces onto the canonical service title', () => {
    expect(mergeServiceOptions(['Pembuatan Website', 'Branding'], [' pembuatan website ', 'Lainnya'])).toEqual({
      options: ['Pembuatan Website', 'Branding', 'Lainnya'],
      selected: ['Pembuatan Website', 'Lainnya'],
    });
  });
});
