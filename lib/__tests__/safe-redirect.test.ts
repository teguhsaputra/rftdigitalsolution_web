import { it, expect } from 'vitest';
import { safeCallbackPath, isSameOriginRequest } from '@/lib/safe-redirect';

const origin = 'https://rftdigitalsolution.com';

it('keeps same-site paths and rejects anything that resolves to another host', () => {
  expect(safeCallbackPath('/admin/team?x=1', origin)).toBe('/admin/team?x=1');
  for (const bad of ['//evil.com', '/\\evil.com', '/\t/evil.com', 'https://evil.com/admin', 'javascript:alert(1)', null, '']) {
    expect(safeCallbackPath(bad, origin)).toBe('/admin');
  }
});

it('allows mutating admin API requests only from this site (CSRF guard)', () => {
  expect(isSameOriginRequest('POST', 'https://rftdigitalsolution.com', 'rftdigitalsolution.com')).toBe(true);
  expect(isSameOriginRequest('POST', 'https://blog.rftdigitalsolution.com', 'rftdigitalsolution.com')).toBe(false);
  expect(isSameOriginRequest('DELETE', 'https://evil.com', 'rftdigitalsolution.com')).toBe(false);
  expect(isSameOriginRequest('GET', 'https://evil.com', 'rftdigitalsolution.com')).toBe(true);
  // tanpa header Origin (bukan browser) → tidak ada cookie korban yang bisa disalahgunakan
  expect(isSameOriginRequest('POST', null, 'rftdigitalsolution.com')).toBe(true);
});
