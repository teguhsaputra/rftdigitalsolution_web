'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/image-upload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { BrandSettingsPublic } from '@/lib/brand-settings-db';

type FormValues = {
  logoUrl: string;
  logoMarkUrl: string;
  whatsappNumber: string;
  whatsappMessage: string;
  contactEmail: string;
};

export function AdminBrandEditor({ initial }: { initial: BrandSettingsPublic }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, watch, setValue, formState } = useForm<FormValues>({
    defaultValues: {
      logoUrl: initial.logoUrl,
      logoMarkUrl: initial.logoMarkUrl,
      whatsappNumber: initial.whatsappNumber ?? '',
      whatsappMessage: initial.whatsappMessage,
      contactEmail: initial.contactEmail,
    },
  });

  const logoUrl = watch('logoUrl');
  const logoMarkUrl = watch('logoMarkUrl');

  const onSubmit = async (data: FormValues) => {
    setError(null);
    setSaved(false);
    const res = await fetch('/api/admin/brand', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json.error || 'Gagal menyimpan');
      return;
    }
    setValue('whatsappNumber', json.whatsappNumber ?? '');
    setSaved(true);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Kontak & WhatsApp</CardTitle>
          <CardDescription>
            Semua tombol &quot;Chat WhatsApp&quot; di website memakai nomor ini. Jika nomor kosong,
            tombol beralih ke email.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="whatsappNumber">Nomor WhatsApp</Label>
            <Input id="whatsappNumber" placeholder="0812-3456-7890" {...register('whatsappNumber')} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="whatsappMessage">Pesan pembuka WhatsApp</Label>
            <Textarea id="whatsappMessage" rows={2} {...register('whatsappMessage')} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contactEmail">Email kontak</Label>
            <Input id="contactEmail" type="email" {...register('contactEmail')} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Logo</CardTitle>
          <CardDescription>
            Logo utuh dipakai di bagian penutup; simbol persegi dipakai di navbar. Kosongkan untuk
            memakai logo bawaan.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Logo utuh</Label>
            <ImageUpload value={logoUrl} onChange={(url) => setValue('logoUrl', url)} />
          </div>
          <div className="grid gap-2">
            <Label>Simbol navbar (persegi)</Label>
            <ImageUpload value={logoMarkUrl} onChange={(url) => setValue('logoMarkUrl', url)} />
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {saved && <p className="text-sm text-muted-foreground">Pengaturan brand tersimpan.</p>}
      <Button type="submit" disabled={formState.isSubmitting}>
        Simpan brand
      </Button>
    </form>
  );
}
