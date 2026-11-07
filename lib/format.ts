const rupiah = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });

/** "Mulai Rp2.500.000", atau "Hubungi kami" bila harga belum diisi. */
export function formatPriceFrom(priceFrom: number | null | undefined): string {
  if (!priceFrom || priceFrom <= 0) return 'Hubungi kami';
  return `Mulai Rp${rupiah.format(priceFrom)}`;
}
