import { it, expect } from 'vitest';
import { formatPriceFrom } from '@/lib/format';

it('formats rupiah', () => expect(formatPriceFrom(2500000)).toBe('Mulai Rp2.500.000'));
it('null/0 → Hubungi kami', () => {
  expect(formatPriceFrom(null)).toBe('Hubungi kami');
  expect(formatPriceFrom(0)).toBe('Hubungi kami');
});

import { parsePriceInput } from '@/lib/format';

it('parses admin price text', () => {
  expect(parsePriceInput('2.500.000')).toBe(2500000);
  expect(parsePriceInput('Rp 1,500,000')).toBe(1500000);
  expect(parsePriceInput('')).toBeNull();
  expect(parsePriceInput('0')).toBeNull();
});

import { MAX_PRICE, priceFromSchema } from '@/lib/format';

it('ignores the decimal part of an Indonesian-formatted price', () => {
  expect(parsePriceInput('2.500.000,00')).toBe(2500000);
  expect(parsePriceInput('Rp 1.500.000,50')).toBe(1500000);
});

it('rejects prices that do not fit the database column with a readable message', () => {
  expect(priceFromSchema.safeParse(MAX_PRICE).success).toBe(true);
  const r = priceFromSchema.safeParse(MAX_PRICE + 1);
  expect(r.success).toBe(false);
  expect(r.error?.issues[0].message).toBe('Harga terlalu besar');
  expect(priceFromSchema.safeParse(null).success).toBe(true);
});
