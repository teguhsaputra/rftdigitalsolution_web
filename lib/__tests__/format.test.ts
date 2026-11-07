import { it, expect } from 'vitest';
import { formatPriceFrom } from '@/lib/format';

it('formats rupiah', () => expect(formatPriceFrom(2500000)).toBe('Mulai Rp2.500.000'));
it('null/0 → Hubungi kami', () => {
  expect(formatPriceFrom(null)).toBe('Hubungi kami');
  expect(formatPriceFrom(0)).toBe('Hubungi kami');
});
