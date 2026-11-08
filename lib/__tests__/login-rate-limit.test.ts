import { describe, expect, it, vi } from 'vitest';
import {
  LOGIN_IP_MAX_ATTEMPTS,
  LOGIN_IP_WINDOW_SECONDS,
  checkLoginRateLimit,
  clientIpFromHeaders,
  type RateLimitStore,
} from '../login-rate-limit';

function memoryStore() {
  const counts = new Map<string, number>();
  const store: RateLimitStore = {
    hit: vi.fn(async (key: string) => {
      const n = (counts.get(key) ?? 0) + 1;
      counts.set(key, n);
      return n;
    }),
  };
  return store;
}

describe('checkLoginRateLimit', () => {
  it(`allows ${LOGIN_IP_MAX_ATTEMPTS} attempts per IP, then blocks`, async () => {
    const store = memoryStore();
    for (let i = 0; i < LOGIN_IP_MAX_ATTEMPTS; i++) {
      expect(await checkLoginRateLimit('203.0.113.7', store)).toBe(true);
    }
    expect(await checkLoginRateLimit('203.0.113.7', store)).toBe(false);
  });

  it('counts each IP separately under a login namespace with the window TTL', async () => {
    const store = memoryStore();
    for (let i = 0; i < LOGIN_IP_MAX_ATTEMPTS; i++) await checkLoginRateLimit('203.0.113.7', store);
    expect(await checkLoginRateLimit('198.51.100.2', store)).toBe(true);
    expect(store.hit).toHaveBeenCalledWith('login:ip:198.51.100.2', LOGIN_IP_WINDOW_SECONDS);
  });

  it('allows without counting when the IP or the store is unknown', async () => {
    const store = memoryStore();
    expect(await checkLoginRateLimit(null, store)).toBe(true);
    expect(await checkLoginRateLimit('203.0.113.7', null)).toBe(true);
    expect(store.hit).not.toHaveBeenCalled();
  });

  it('fails open when the store errors', async () => {
    const store: RateLimitStore = { hit: () => Promise.reject(new Error('redis down')) };
    expect(await checkLoginRateLimit('203.0.113.7', store)).toBe(true);
  });

  it('fails open when the store does not answer in time', async () => {
    const store: RateLimitStore = { hit: () => new Promise(() => {}) };
    expect(await checkLoginRateLimit('203.0.113.7', store, 20)).toBe(true);
  });
});

describe('clientIpFromHeaders', () => {
  it('reads X-Real-IP (set by the reverse proxy)', () => {
    expect(clientIpFromHeaders(new Headers({ 'x-real-ip': ' 203.0.113.7 ' }))).toBe('203.0.113.7');
    expect(clientIpFromHeaders(new Headers({ 'x-real-ip': '2001:db8::1' }))).toBe('2001:db8::1');
  });

  it('ignores missing or malformed values and client-controlled X-Forwarded-For', () => {
    expect(clientIpFromHeaders(new Headers())).toBeNull();
    expect(clientIpFromHeaders(new Headers({ 'x-real-ip': 'evil, 1.2.3.4' }))).toBeNull();
    expect(clientIpFromHeaders(new Headers({ 'x-forwarded-for': '1.2.3.4' }))).toBeNull();
  });
});
