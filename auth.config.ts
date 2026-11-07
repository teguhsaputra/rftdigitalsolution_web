import type { NextAuthConfig } from 'next-auth';

/** Masa berlaku sesi login admin (detik). */
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12; // 12 jam

/**
 * Konfigurasi dasar Auth.js tanpa akses database — aman dipakai di middleware.
 * Provider email + password ada di `auth.ts`.
 */
export const authConfig = {
  // Docker / reverse proxy: hindari error UntrustedHost di /api/auth/*.
  trustHost: true,
  session: { strategy: 'jwt', maxAge: SESSION_MAX_AGE_SECONDS },
  jwt: { maxAge: SESSION_MAX_AGE_SECONDS },
  pages: { signIn: '/login', error: '/login' },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.name = token.name ?? null;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
