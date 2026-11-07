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
