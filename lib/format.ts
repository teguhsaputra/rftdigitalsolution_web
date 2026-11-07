import { z } from 'zod';

/** Batas kolom Postgres `Int`. */
export const MAX_PRICE = 2_147_483_647;

/** Validasi `priceFrom` di API admin layanan. */
export const priceFromSchema = z
  .number()
  .int()
  .positive()
  .max(MAX_PRICE, 'Harga terlalu besar')
  .nullable();

const rupiah = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });

/** "Mulai Rp2.500.000", atau "Hubungi kami" bila harga belum diisi. */
export function formatPriceFrom(priceFrom: number | null | undefined): string {
  if (!priceFrom || priceFrom <= 0) return 'Hubungi kami';
  return `Mulai Rp${rupiah.format(priceFrom)}`;
}

/** Teks harga dari form admin ("2.500.000", "Rp 1,500,000") → angka; kosong/0 → null. */
export function parsePriceInput(text: string | null | undefined): number | null {
  // Abaikan desimal gaya Indonesia (",00") lalu ambil digit saja.
  const digits = (text ?? '').replace(/,\d{1,2}\s*$/, '').replace(/\D/g, '');
  const n = digits ? Number.parseInt(digits, 10) : 0;
  return n > 0 ? n : null;
}
