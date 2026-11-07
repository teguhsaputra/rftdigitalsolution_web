import { it, expect } from 'vitest';
import nextConfig from '../../next.config';

it('permanently redirects the old pages to one-page anchors', async () => {
  const redirects = await nextConfig.redirects!();
  expect(redirects).toEqual(
    expect.arrayContaining([
      { source: '/about', destination: '/#tentang', permanent: true },
      { source: '/services', destination: '/#layanan', permanent: true },
      { source: '/projects', destination: '/#portofolio', permanent: true },
      { source: '/career', destination: '/#karier', permanent: true },
      { source: '/contact', destination: '/#kontak', permanent: true },
    ])
  );
});
