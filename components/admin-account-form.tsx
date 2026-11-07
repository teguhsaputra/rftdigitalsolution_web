'use client';

import { useState, type FormEvent } from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MIN_PASSWORD_LENGTH } from '@/lib/password-rules';

export function AdminAccountForm({ name, email }: { name: string; email: string }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  const mismatch = confirm.length > 0 && confirm !== next;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (mismatch) return;
    setBusy(true);
    setMessage(null);
    const res = await fetch('/api/admin/account/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: current, newPassword: next }),
    });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setMessage({ type: 'error', text: json.error || 'Gagal mengganti password' });
      return;
    }
    setMessage({ type: 'ok', text: 'Password berhasil diganti. Silakan login lagi dengan password baru…' });
    // Semua sesi (termasuk yang ini) sudah tidak berlaku setelah ganti password.
    await signOut({ redirect: false });
    window.location.replace('/login');
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Ganti password</CardTitle>
        <CardDescription>
          Login sebagai {name} ({email}).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-1.5">
            <Label htmlFor="current">Password lama</Label>
            <Input
              id="current"
              type="password"
              autoComplete="current-password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="next">Password baru (minimal {MIN_PASSWORD_LENGTH} karakter)</Label>
            <Input
              id="next"
              type="password"
              autoComplete="new-password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="confirm">Ulangi password baru</Label>
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              aria-invalid={mismatch}
            />
            {mismatch && <p className="text-sm text-destructive">Password baru tidak sama.</p>}
          </div>
          {message && (
            <p role="status" className={message.type === 'ok' ? 'text-sm' : 'text-sm text-destructive'}>
              {message.text}
            </p>
          )}
          <Button
            type="submit"
            disabled={busy || !current || next.length < MIN_PASSWORD_LENGTH || mismatch || !confirm}
          >
            Simpan password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
