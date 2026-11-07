const key = (s: string) => s.trim().toLowerCase();

/** Filter portofolio per nama layanan; `null` = semua. */
export function filterPortfolioByService<T extends { services: string[] }>(
  items: T[],
  service: string | null
): T[] {
  if (service === null) return items;
  const wanted = key(service);
  return items.filter((item) => item.services.some((s) => key(s) === wanted));
}

/**
 * Opsi checklist admin: layanan yang ada + tag lama yang tidak cocok.
 * Tag lama yang hanya beda huruf besar/kecil atau spasi dipetakan ke judul layanan.
 */
export function mergeServiceOptions(
  serviceTitles: string[],
  existingTags: string[]
): { options: string[]; selected: string[] } {
  const byKey = new Map(serviceTitles.map((t) => [key(t), t]));
  const selected: string[] = [];
  const extra: string[] = [];
  for (const tag of existingTags) {
    const canonical = byKey.get(key(tag)) ?? tag.trim();
    if (!canonical || selected.includes(canonical)) continue;
    selected.push(canonical);
    if (!byKey.has(key(canonical)) && !extra.includes(canonical)) extra.push(canonical);
  }
  return { options: [...serviceTitles, ...extra], selected };
}
