import { NextResponse } from 'next/server';
import { auth } from './auth';
import { isSameOriginRequest } from './lib/safe-redirect';

/**
 * Proxy (Next 16, runtime Node.js) untuk /admin dan API admin.
 * Memakai `auth()` lengkap: setiap request admin mengecek ulang bahwa akun masih aktif dan
 * password belum diganti — termasuk navigasi di dalam admin (bukan hanya saat reload halaman).
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api/')) {
    // CSRF: request yang mengubah data harus berasal dari website ini sendiri.
    if (!isSameOriginRequest(req.method, req.headers.get('origin'), req.headers.get('host'))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.next();
  }

  if (!req.auth) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  if (req.auth.user?.role !== 'admin') {
    return NextResponse.redirect(new URL('/forbidden', req.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*', '/api/upload/:path*'],
};
