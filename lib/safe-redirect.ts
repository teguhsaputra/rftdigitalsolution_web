/**
 * Path tujuan setelah login: hanya halaman di website ini.
 * Di-resolve dengan URL agar trik seperti "/\evil.com" atau "/<TAB>/evil.com" ikut tertolak.
 */
export function safeCallbackPath(raw: string | null | undefined, origin: string, fallback = '/admin'): string {
  if (!raw || !raw.startsWith('/')) return fallback;
  try {
    const url = new URL(raw, origin);
    if (url.origin !== new URL(origin).origin) return fallback;
    return url.pathname + url.search + url.hash;
  } catch {
    return fallback;
  }
}

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * Perlindungan CSRF untuk API admin: request yang mengubah data dari browser harus berasal
 * dari host yang sama (header Origin). Tanpa Origin = bukan dari browser → tidak membawa cookie korban.
 */
export function isSameOriginRequest(method: string, originHeader: string | null, hostHeader: string | null): boolean {
  if (SAFE_METHODS.has(method.toUpperCase())) return true;
  if (!originHeader) return true;
  try {
    return new URL(originHeader).host === hostHeader;
  } catch {
    return false;
  }
}
