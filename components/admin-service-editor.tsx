'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatPriceFrom, parsePriceInput } from '@/lib/format';

const schema = z.object({
  slug: z.string().min(1, 'Slug wajib'),
  title: z.string().min(1, 'Judul wajib'),
  titleEn: z.string().min(1, 'Judul EN wajib'),
  summary: z.string().min(1, 'Ringkasan wajib'),
  detailsText: z.string().min(1, 'Detail (minimal satu baris) wajib'),
  priceFrom: z.string().optional(),
  sortOrder: z.string().optional(),
  published: z.boolean(),
});

type ServiceFormValues = z.infer<typeof schema>;

function detailsToText(details: unknown): string {
  if (!Array.isArray(details)) return '';
  return details.filter((x): x is string => typeof x === 'string').join('\n');
}

export function AdminServiceEditor({
  service,
}: {
  service?: {
    id: string;
    slug: string;
    title: string;
    titleEn: string;
    summary: string;
    details: unknown;
    priceFrom: number | null;
    sortOrder: number;
    published: boolean;
  };
}) {
  const router = useRouter();
  const isEdit = !!service;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      slug: service?.slug ?? '',
      title: service?.title ?? '',
      titleEn: service?.titleEn ?? '',
      summary: service?.summary ?? '',
      detailsText: service ? detailsToText(service.details) : '',
      priceFrom: service?.priceFrom != null ? String(service.priceFrom) : '',
      sortOrder: service != null ? String(service.sortOrder) : '0',
      published: service?.published ?? true,
    },
  });

  const title = watch('title');
  const published = watch('published');
  const priceFromText = watch('priceFrom');

  useEffect(() => {
    if (!isEdit && title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [title, isEdit, setValue]);

  const onSubmit = async (data: ServiceFormValues) => {
    const details = data.detailsText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    const sortOrder = parseInt(data.sortOrder ?? '0', 10);
    const payload = {
      slug: data.slug,
      title: data.title,
      titleEn: data.titleEn,
      summary: data.summary,
      details,
      priceFrom: parsePriceInput(data.priceFrom),
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      published: data.published,
    };

    const url = isEdit ? `/api/admin/services/${service.id}` : '/api/admin/services';
    const res = await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(j.error || 'Gagal menyimpan');
      return;
    }

    router.push('/admin/services');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit layanan' : 'Layanan baru'}</CardTitle>
          <CardDescription>
            Satu layanan = satu kartu di section Layanan dan satu kartu di section Harga beranda.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Judul (ID)</Label>
            <Input id="title" {...register('title')} />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">Slug URL</Label>
            <Input id="slug" {...register('slug')} />
            {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="titleEn">Judul (EN)</Label>
            <Input id="titleEn" {...register('titleEn')} />
            {errors.titleEn && (
              <p className="text-sm text-destructive">{errors.titleEn.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="summary">Ringkasan</Label>
            <Textarea id="summary" rows={4} {...register('summary')} />
            {errors.summary && (
              <p className="text-sm text-destructive">{errors.summary.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="detailsText">Poin detail (satu baris = satu bullet)</Label>
            <Textarea id="detailsText" rows={6} {...register('detailsText')} />
            {errors.detailsText && (
              <p className="text-sm text-destructive">{errors.detailsText.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="priceFrom">Harga mulai dari (Rp)</Label>
            <Input id="priceFrom" inputMode="numeric" placeholder="2.500.000" {...register('priceFrom')} />
            <p className="text-xs text-muted-foreground">
              Tampil di website: {formatPriceFrom(parsePriceInput(priceFromText))}. Kosongkan untuk
              &quot;Hubungi kami&quot;.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
            <div className="grid gap-2">
              <Label htmlFor="sortOrder">Urutan tampil</Label>
              <Input id="sortOrder" inputMode="numeric" {...register('sortOrder')} />
            </div>
            <div className="flex items-end gap-2 pb-2">
              <input
                id="published"
                type="checkbox"
                className="h-4 w-4"
                checked={published}
                onChange={(e) => setValue('published', e.target.checked, { shouldValidate: true })}
              />
              <Label htmlFor="published" className="font-normal cursor-pointer">
                Tampilkan di situs (published)
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit">Simpan</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Batal
        </Button>
      </div>
    </form>
  );
}
