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
import { ImageUpload } from '@/components/image-upload';

const schema = z.object({
  slug: z.string().min(1, 'Slug wajib'),
  title: z.string().min(1, 'Judul wajib'),
  clientType: z.string().min(1, 'Klien / lokasi wajib'),
  focus: z.string().min(1, 'Fokus wajib'),
  description: z.string().min(1, 'Deskripsi wajib'),
  image: z.string().optional(),
  services: z.array(z.string()).min(1, 'Pilih minimal satu layanan'),
  sortOrder: z.string().optional(),
  published: z.boolean(),
});

type PortfolioFormValues = z.infer<typeof schema>;

function toStringArray(services: unknown): string[] {
  if (!Array.isArray(services)) return [];
  return services.filter((x): x is string => typeof x === 'string');
}

export function AdminPortfolioEditor({
  project,
  serviceOptions,
}: {
  /** Judul layanan yang tersedia (checklist). */
  serviceOptions: string[];
  project?: {
    id: string;
    slug: string;
    title: string;
    clientType: string;
    focus: string;
    description: string;
    services: unknown;
    image: string | null;
    sortOrder: number;
    published: boolean;
  };
}) {
  const router = useRouter();
  const isEdit = !!project;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PortfolioFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      slug: project?.slug ?? '',
      title: project?.title ?? '',
      clientType: project?.clientType ?? '',
      focus: project?.focus ?? '',
      description: project?.description ?? '',
      image: project?.image ?? '',
      services: project ? toStringArray(project.services) : [],
      sortOrder: project != null ? String(project.sortOrder) : '0',
      published: project?.published ?? true,
    },
  });

  const title = watch('title');
  const published = watch('published');
  const image = watch('image');
  const selectedServices = watch('services');
  // Tag lama yang tidak ada di daftar layanan tetap ditampilkan agar tidak hilang diam-diam.
  const allServiceOptions = [
    ...serviceOptions,
    ...toStringArray(project?.services).filter((s) => !serviceOptions.includes(s)),
  ];
  const toggleService = (name: string, checked: boolean) => {
    const next = checked
      ? [...selectedServices, name]
      : selectedServices.filter((s) => s !== name);
    setValue('services', next, { shouldValidate: true });
  };

  useEffect(() => {
    if (!isEdit && title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [title, isEdit, setValue]);

  const onSubmit = async (data: PortfolioFormValues) => {
    const services = data.services;
    const sortOrder = parseInt(data.sortOrder ?? '0', 10);
    const img = data.image?.trim();
    const payload = {
      slug: data.slug,
      title: data.title,
      clientType: data.clientType,
      focus: data.focus,
      description: data.description,
      image: img && img.length > 0 ? img : null,
      services,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      published: data.published,
    };

    const url = isEdit ? `/api/admin/portfolio/${project.id}` : '/api/admin/portfolio';
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

    router.push('/admin/portfolio');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit portfolio' : 'Project portfolio baru'}</CardTitle>
          <CardDescription>Muncul di blok portfolio beranda.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Judul project</Label>
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
          <div className="grid gap-2">
            <Label>Gambar project (opsional)</Label>
            <input type="hidden" {...register('image')} />
            <ImageUpload
              value={image}
              onChange={(url) => setValue('image', url, { shouldValidate: true })}
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
            <div className="grid gap-2">
              <Label htmlFor="clientType">Klien / tipe</Label>
              <Input id="clientType" {...register('clientType')} placeholder="F&B • Jakarta" />
              {errors.clientType && (
                <p className="text-sm text-destructive">{errors.clientType.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="focus">Fokus layanan</Label>
              <Input id="focus" {...register('focus')} placeholder="Website • SEO" />
              {errors.focus && (
                <p className="text-sm text-destructive">{errors.focus.message}</p>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea id="description" rows={5} {...register('description')} />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Layanan yang dikerjakan</Label>
            <div className="grid gap-2 sm:grid-cols-2">
              {allServiceOptions.map((name) => (
                <label key={name} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={selectedServices.includes(name)}
                    onChange={(e) => toggleService(name, e.target.checked)}
                  />
                  {name}
                </label>
              ))}
            </div>
            {errors.services && (
              <p className="text-sm text-destructive">{errors.services.message}</p>
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
