'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { requiredImageRefSchema } from '@/lib/image-ref';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  name: z.string().min(1, 'Nama brand wajib'),
  imageUrl: requiredImageRefSchema,
  sortOrder: z.string().optional(),
  published: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export function AdminTrustedPartnerEditor({
  partner,
}: {
  partner?: {
    id: string;
    name: string;
    imageUrl: string;
    sortOrder: number;
    published: boolean;
  };
}) {
  const router = useRouter();
  const isEdit = !!partner;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: partner?.name ?? '',
      imageUrl: partner?.imageUrl ?? '',
      sortOrder: partner != null ? String(partner.sortOrder) : '0',
      published: partner?.published ?? true,
    },
  });

  const imageUrl = watch('imageUrl');
  const published = watch('published');

  const onSubmit = async (data: FormValues) => {
    const sortOrder = parseInt(data.sortOrder ?? '0', 10);
    const payload = {
      name: data.name,
      imageUrl: data.imageUrl,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      published: data.published,
    };

    const url = isEdit ? `/api/admin/trusted-partners/${partner.id}` : '/api/admin/trusted-partners';
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

    router.push('/admin/trusted-partners');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit mitra' : 'Mitra / brand baru'}</CardTitle>
          <CardDescription>
            Logo tampil di pita &quot;Dipercaya oleh&quot; di beranda. Gunakan gambar persegi.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nama brand</Label>
            <Input id="name" {...register('name')} placeholder="Nama perusahaan atau produk" />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label>Logo (gambar)</Label>
            <input type="hidden" {...register('imageUrl')} />
            <ImageUpload value={imageUrl} onChange={(url) => setValue('imageUrl', url, { shouldValidate: true })} />
            {errors.imageUrl && (
              <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
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
