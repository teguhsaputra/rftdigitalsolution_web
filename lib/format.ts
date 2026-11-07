const rupiah = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });

/** "Mulai Rp2.500.000", atau "Hubungi kami" bila harga belum diisi. */
export function formatPriceFrom(priceFrom: number | null | undefined): string {
  if (!priceFrom || priceFrom <= 0) return 'Hubungi kami';
  return `Mulai Rp${rupiah.format(priceFrom)}`;
}

/** Teks harga dari form admin ("2.500.000", "Rp 1,500,000") → angka; kosong/0 → null. */
export function parsePriceInput(text: string | null | undefined): number | null {
  const digits = (text ?? '').replace(/\D/g, '');
  const n = digits ? Number.parseInt(digits, 10) : 0;
  return n > 0 ? n : null;
}
