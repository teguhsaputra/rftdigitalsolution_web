'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MIN_PASSWORD_LENGTH } from '@/lib/password-rules';

export type AdminRow = {
  id: string;
  name: string;
  email: string;
  active: boolean;
  lastLoginAt: string | null;
  lockedUntil: string | null;
};

const dateFmt = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

async function send(url: string, method: string, body: unknown) {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Gagal menyimpan');
  return json;
}

export function AdminTeamManager({ users, currentUserId }: { users: AdminRow[]; currentUserId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [resetFor, setResetFor] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState('');

  async function run(action: () => Promise<unknown>, ok: string) {
    setBusy(true);
    setMessage(null);
    try {
      await action();
      setMessage({ type: 'ok', text: ok });
      router.refresh();
      return true;
    } catch (e) {
      setMessage({ type: 'error', text: (e as Error).message });
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function addMember(e: FormEvent) {
    e.preventDefault();
    const done = await run(
      () => send('/api/admin/users', 'POST', form),
      `${form.name} ditambahkan. Bagikan email & password awalnya secara pribadi.`
    );
    if (done) setForm({ name: '', email: '', password: '' });
  }

  async function submitReset(e: FormEvent, user: AdminRow) {
    e.preventDefault();
    const done = await run(
      () => send(`/api/admin/users/${user.id}`, 'PATCH', { password: resetPassword }),
      `Password ${user.name} sudah direset.`
    );
    if (done) {
      setResetFor(null);
      setResetPassword('');
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {message && (
        <p
          role="status"
          className={
            message.type === 'ok'
              ? 'rounded-lg border border-line bg-surface px-4 py-3 text-sm'
              : 'rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive'
          }
        >
          {message.text}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Anggota tim</CardTitle>
          <CardDescription>Semua anggota punya akses penuh ke admin panel.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {users.map((u) => {
            const locked = u.lockedUntil && new Date(u.lockedUntil) > new Date();
            return (
              <div key={u.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold">
                      {u.name} {u.id === currentUserId && <span className="text-muted-foreground">(Anda)</span>}
                    </p>
                    <p className="text-sm text-muted-foreground">{u.email}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {u.active ? 'Aktif' : 'Nonaktif'}
                      {locked && ' · terkunci sementara'}
                      {' · '}
                      {u.lastLoginAt ? `login terakhir ${dateFmt.format(new Date(u.lastLoginAt))}` : 'belum pernah login'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={busy}
                      onClick={() => {
                        setResetFor(resetFor === u.id ? null : u.id);
                        setResetPassword('');
                      }}
                    >
                      <KeyRound className="mr-1 h-4 w-4" aria-hidden /> Reset password
                    </Button>
                    {u.id !== currentUserId && (
                      <Button
                        type="button"
                        variant={u.active ? 'outline' : 'default'}
                        size="sm"
                        disabled={busy}
                        onClick={() =>
                          run(
                            () => send(`/api/admin/users/${u.id}`, 'PATCH', { active: !u.active }),
                            u.active ? `${u.name} dinonaktifkan.` : `${u.name} diaktifkan kembali.`
                          )
                        }
                      >
                        {u.active ? 'Nonaktifkan' : 'Aktifkan'}
                      </Button>
                    )}
                  </div>
                </div>
                {resetFor === u.id && (
                  <form onSubmit={(e) => submitReset(e, u)} className="mt-3 flex flex-wrap items-end gap-2">
                    <div className="grid gap-1.5">
                      <Label htmlFor={`reset-${u.id}`}>Password baru</Label>
                      <Input
                        id={`reset-${u.id}`}
                        type="password"
                        autoComplete="new-password"
                        minLength={MIN_PASSWORD_LENGTH}
                        value={resetPassword}
                        onChange={(e) => setResetPassword(e.target.value)}
                        className="w-64"
                      />
                    </div>
                    <Button type="submit" size="sm" disabled={busy || resetPassword.length < MIN_PASSWORD_LENGTH}>
                      Simpan
                    </Button>
                  </form>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tambah anggota</CardTitle>
          <CardDescription>
            Buat password awal (minimal {MIN_PASSWORD_LENGTH} karakter), lalu minta anggota menggantinya dari menu
            Akun Saya setelah login.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={addMember} className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-1.5">
              <Label htmlFor="new-name">Nama</Label>
              <Input id="new-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="new-email">Email</Label>
              <Input
                id="new-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="new-password">Password awal</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div className="sm:col-span-3">
              <Button type="submit" disabled={busy || !form.name || !form.email || !form.password}>
                <UserPlus className="mr-2 h-4 w-4" aria-hidden /> Tambah anggota
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
