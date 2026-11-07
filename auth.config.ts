import type { NextAuthConfig } from 'next-auth';
import { SESSION_MAX_AGE_SECONDS } from './lib/admin-auth-constants';

export { SESSION_MAX_AGE_SECONDS };

/**
 * Konfigurasi dasar Auth.js (sesi JWT, halaman login, mapping token ↔ session).
 * Provider email + password dan pengecekan ulang akun ada di `auth.ts`.
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
        token.sv = user.sessionVersion;
        token.loginAt = Math.floor(Date.now() / 1000);
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
