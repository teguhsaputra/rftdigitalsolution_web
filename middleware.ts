import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from './auth.config';

// Instance ringan tanpa database: hanya membaca cookie sesi.
// Pemeriksaan akun aktif dilakukan di layout admin & API (lewat `auth()` di auth.ts).
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    if (!req.auth) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (req.auth.user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/forbidden', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
