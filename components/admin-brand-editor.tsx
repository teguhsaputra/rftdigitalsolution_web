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
import type { BrandFormValues } from '@/lib/brand-settings-db';
import {
  BRAND_LOGO_FALLBACK_SRC,
  BRAND_MARK_FALLBACK_SRC,
  DEFAULT_CONTACT_EMAIL,
  DEFAULT_WHATSAPP_MESSAGE,
} from '@/lib/brand';

type FormValues = BrandFormValues;

/** Field kosong = memakai nilai bawaan (ditampilkan sebagai placeholder, tidak ikut disimpan). */
export function AdminBrandEditor({ initial }: { initial: BrandFormValues }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, watch, setValue, formState } = useForm<FormValues>({
    defaultValues: initial,
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
    setValue('contactEmail', json.contactEmail ?? '');
    setValue('whatsappMessage', json.whatsappMessage ?? '');
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
            <Input
              id="whatsappNumber"
              placeholder="0812-3456-7890"
              {...register('whatsappNumber')}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="whatsappMessage">Pesan pembuka WhatsApp</Label>
            <Textarea
              id="whatsappMessage"
              rows={2}
              placeholder={DEFAULT_WHATSAPP_MESSAGE}
              {...register('whatsappMessage')}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contactEmail">Email kontak</Label>
            <Input
              id="contactEmail"
              type="email"
              placeholder={DEFAULT_CONTACT_EMAIL}
              {...register('contactEmail')}
            />
            <p className="text-xs text-muted-foreground">Kosongkan untuk memakai bawaan.</p>
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
            <ImageUpload
              value={logoUrl || BRAND_LOGO_FALLBACK_SRC}
              onChange={(url) => setValue('logoUrl', url)}
            />
            {logoUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setValue('logoUrl', '')}
              >
                Pakai logo bawaan
              </Button>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Simbol navbar (persegi)</Label>
            <ImageUpload
              value={logoMarkUrl || BRAND_MARK_FALLBACK_SRC}
              onChange={(url) => setValue('logoMarkUrl', url)}
            />
            {logoMarkUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setValue('logoMarkUrl', '')}
              >
                Pakai simbol bawaan
              </Button>
            )}
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
