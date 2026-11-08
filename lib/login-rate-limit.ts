import { isIP } from 'node:net';
import { getRedisClient, isRedisConfigured } from './redis';
import { LOGIN_IP_MAX_ATTEMPTS, LOGIN_IP_WINDOW_SECONDS } from './login-rate-limit-constants';

// Semua percobaan login dihitung per IP, berhasil maupun gagal.
export { LOGIN_IP_MAX_ATTEMPTS, LOGIN_IP_WINDOW_SECONDS };
const STORE_TIMEOUT_MS = 500;

export type RateLimitStore = {
  /** Tambah hitungan `key` dan kembalikan nilainya; TTL dipasang saat key pertama kali dibuat. */
  hit(key: string, windowSeconds: number): Promise<number>;
};

/**
 * IP pengunjung dari header X-Real-IP. Caddy selalu menimpa header ini dengan {client_ip}
 * (CF-Connecting-IP hanya dipercaya bila request datang dari IP Cloudflare), jadi nilainya
 * tidak bisa dipalsukan pengunjung. X-Forwarded-For sengaja tidak dipakai.
 */
export function clientIpFromHeaders(headers: Headers): string | null {
  const ip = headers.get('x-real-ip')?.trim();
  return ip && isIP(ip) ? ip : null;
}

/**
 * true = boleh mencoba login. Gagal-terbuka: tanpa IP, tanpa Redis, Redis error atau lambat
 * → tetap diizinkan (penguncian akun 5x gagal di lib/admin-auth.ts tetap berlaku).
 */
export async function checkLoginRateLimit(
  ip: string | null,
  store: RateLimitStore | null,
  timeoutMs = STORE_TIMEOUT_MS
): Promise<boolean> {
  if (!ip || !store) return true;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const count = await Promise.race([
      store.hit(`login:ip:${ip}`, LOGIN_IP_WINDOW_SECONDS),
      new Promise<null>((resolve) => {
        timer = setTimeout(() => resolve(null), timeoutMs);
      }),
    ]);
    return count === null || count <= LOGIN_IP_MAX_ATTEMPTS;
  } catch (error) {
    console.error('Login rate limit unavailable:', error);
    return true;
  } finally {
    clearTimeout(timer);
  }
}

/** Store Redis (INCR + EXPIRE NX dalam satu MULTI); null bila Redis tidak dikonfigurasi. */
export function redisRateLimitStore(): RateLimitStore | null {
  if (!isRedisConfigured()) return null;
  return {
    async hit(key, windowSeconds) {
      const result = await getRedisClient().multi().incr(key).expire(key, windowSeconds, 'NX').exec();
      const [err, count] = result?.[0] ?? [new Error('empty MULTI result'), null];
      if (err) throw err;
      return Number(count);
    },
  };
}
