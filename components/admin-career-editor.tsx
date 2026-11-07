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

const schema = z.object({
  slug: z.string().min(1, 'Slug wajib'),
  title: z.string().min(1, 'Judul posisi wajib'),
  location: z.string().min(1, 'Lokasi wajib'),
  type: z.string().min(1, 'Tipe wajib'),
  description: z.string().min(1, 'Deskripsi wajib'),
  responsibilitiesText: z.string().min(1, 'Minimal satu poin tanggung jawab'),
  sortOrder: z.string().optional(),
  published: z.boolean(),
});

type CareerFormValues = z.infer<typeof schema>;

function listToText(list: unknown): string {
  if (!Array.isArray(list)) return '';
  return list.filter((x): x is string => typeof x === 'string').join('\n');
}

export function AdminCareerEditor({
  opening,
}: {
  opening?: {
    id: string;
    slug: string;
    title: string;
    location: string;
    type: string;
    description: string;
    responsibilities: unknown;
    sortOrder: number;
    published: boolean;
  };
}) {
  const router = useRouter();
  const isEdit = !!opening;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CareerFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      slug: opening?.slug ?? '',
      title: opening?.title ?? '',
      location: opening?.location ?? '',
      type: opening?.type ?? '',
      description: opening?.description ?? '',
      responsibilitiesText: opening ? listToText(opening.responsibilities) : '',
      sortOrder: opening != null ? String(opening.sortOrder) : '0',
      published: opening?.published ?? true,
    },
  });

  const title = watch('title');
  const published = watch('published');

  useEffect(() => {
    if (!isEdit && title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [title, isEdit, setValue]);

  const onSubmit = async (data: CareerFormValues) => {
    const responsibilities = data.responsibilitiesText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    const sortOrder = parseInt(data.sortOrder ?? '0', 10);
    const payload = {
      slug: data.slug,
      title: data.title,
      location: data.location,
      type: data.type,
      description: data.description,
      responsibilities,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      published: data.published,
    };

    const url = isEdit ? `/api/admin/careers/${opening.id}` : '/api/admin/careers';
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

    router.push('/admin/careers');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit lowongan' : 'Lowongan baru'}</CardTitle>
          <CardDescription>
            Catatan: section Karier sedang tidak ditampilkan di website publik.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Judul posisi</Label>
            <Input id="title" {...register('title')} />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" {...register('slug')} />
            {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
          </div>
          <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
            <div className="grid gap-2">
              <Label htmlFor="location">Lokasi</Label>
              <Input id="location" {...register('location')} />
              {errors.location && (
                <p className="text-sm text-destructive">{errors.location.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Tipe (full-time, contract, …)</Label>
              <Input id="type" {...register('type')} />
              {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Deskripsi singkat</Label>
            <Textarea id="description" rows={4} {...register('description')} />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="responsibilitiesText">Tanggung jawab (satu baris = satu poin)</Label>
            <Textarea id="responsibilitiesText" rows={6} {...register('responsibilitiesText')} />
            {errors.responsibilitiesText && (
              <p className="text-sm text-destructive">{errors.responsibilitiesText.message}</p>
            )}
          </div>
          <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
            <div className="grid gap-2">
              <Label htmlFor="sortOrder">Urutan</Label>
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
                Tampilkan di situs
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
