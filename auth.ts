import NextAuth, { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { authenticateAdmin, refreshAdminToken } from './lib/admin-auth';
import { env } from './lib/env';

class InvalidLogin extends CredentialsSignin {
  code = 'invalid';
}
class LockedLogin extends CredentialsSignin {
  code = 'locked';
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  secret: env.AUTH_SECRET,
  providers: [
    Credentials({
      credentials: { email: { type: 'email' }, password: { type: 'password' } },
      async authorize(credentials) {
        const result = await authenticateAdmin(
          String(credentials?.email ?? ''),
          String(credentials?.password ?? '')
        );
        if (!result.ok) throw result.reason === 'locked' ? new LockedLogin() : new InvalidLogin();
        return result.user;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt(params) {
      const token = authConfig.callbacks.jwt(params);
      // Sesi lama: pastikan akun masih aktif (admin yang dinonaktifkan langsung keluar).
      return params.user ? token : refreshAdminToken(token);
    },
  },
});
