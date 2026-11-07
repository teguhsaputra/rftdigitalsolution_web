import { AdminBrandEditor } from '@/components/admin-brand-editor';
import { getBrandFormValues } from '@/lib/brand-settings-db';

export default async function AdminBrandPage() {
  const initial = await getBrandFormValues();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Brand</h1>
        <p className="text-muted-foreground">Atur logo, nomor WhatsApp, dan email kontak website.</p>
      </div>
      <AdminBrandEditor initial={initial} />
    </div>
  );
}
