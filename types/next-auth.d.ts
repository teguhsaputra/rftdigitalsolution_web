import 'next-auth';

declare module 'next-auth' {
  interface User {
    role?: string;
    sessionVersion?: number;
  }

  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      role?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    /** sessionVersion akun saat login */
    sv?: number;
    /** waktu login (detik epoch) */
    loginAt?: number;
  }
}
