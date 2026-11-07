'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Suspense, useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { AlertTriangle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BRAND_MARK_FALLBACK_SRC, BRAND_SHORT_NAME } from '@/lib/brand';
import { LOCK_MINUTES } from '@/lib/admin-auth-constants';

/** Hanya izinkan kembali ke halaman di website ini (cegah open redirect). */
function safeCallbackUrl(raw: string | null): string {
  if (raw && raw.startsWith('/') && !raw.startsWith('//')) return raw;
  return '/admin';
}

const messages: Record<string, string> = {
  invalid: 'Email atau password salah.',
  locked: `Terlalu banyak percobaan gagal. Akun dikunci sementara ${LOCK_MINUTES} menit.`,
  default: 'Login gagal. Coba lagi beberapa saat lagi.',
};

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = safeCallbackUrl(searchParams.get('callbackUrl'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    searchParams.get('error') ? messages[searchParams.get('code') ?? ''] ?? messages.default : ''
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await signIn('credentials', { email, password, redirect: false });
      if (!res || res.error) {
        setError(messages[res?.code ?? ''] ?? messages.default);
        setLoading(false);
        return;
      }
      window.location.assign(callbackUrl);
    } catch {
      setError('Tidak bisa terhubung ke server. Periksa koneksi lalu coba lagi.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {error}
        </div>
      )}
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={loading || !email || !password}>
        <Lock className="mr-2 h-4 w-4" aria-hidden />
        {loading ? 'Memeriksa…' : 'Masuk'}
      </Button>
      <p className="text-center text-xs text-zinc-500">
        Lupa password? Minta admin lain untuk mereset dari menu Tim Admin.
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-[28px] border border-line bg-surface p-8">
        <div className="mb-8 text-center">
          <Image
            src={BRAND_MARK_FALLBACK_SRC}
            alt=""
            width={48}
            height={48}
            className="mx-auto h-12 w-12 rounded-xl border border-line"
          />
          <h1 className="heading-display mt-5 text-3xl text-white">Masuk ke Admin</h1>
          <p className="mt-2 text-sm text-zinc-400">{BRAND_SHORT_NAME}</p>
        </div>
        <Suspense fallback={<p className="text-center text-sm text-zinc-500">Memuat…</p>}>
          <LoginForm />
        </Suspense>
        <Link href="/" className="mt-6 block text-center text-xs text-zinc-500 hover:text-white">
          ← Kembali ke website
        </Link>
      </div>
    </main>
  );
}
