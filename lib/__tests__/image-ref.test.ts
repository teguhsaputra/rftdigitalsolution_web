import { it, expect } from 'vitest';
import { imageRefSchema, requiredImageRefSchema } from '@/lib/image-ref';

it('accepts site paths and full URLs, rejects other hosts via // and junk', () => {
  for (const ok of ['/portfolio/x.webp', 'https://s3.example.com/b/x.png', 'http://localhost:9000/b/x.png', '']) {
    expect(imageRefSchema.safeParse(ok).success).toBe(true);
  }
  for (const bad of ['//evil.example/x.png', 'x.png', 'javascript:alert(1)']) {
    expect(imageRefSchema.safeParse(bad).success).toBe(false);
  }
});

it('required variant rejects empty with the upload hint', () => {
  const r = requiredImageRefSchema.safeParse('');
  expect(r.success).toBe(false);
  expect(r.error?.issues[0].message).toBe('Upload gambar terlebih dahulu');
  expect(requiredImageRefSchema.safeParse('/partners/a.webp').success).toBe(true);
});
