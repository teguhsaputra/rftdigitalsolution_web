import { AdminBrandEditor } from '@/components/admin-brand-editor';
import { getBrandSettings } from '@/lib/brand-settings-db';

export default async function AdminBrandPage() {
  const initialLogoUrl = (await getBrandSettings()).logoUrl;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Brand</h1>
        <p className="text-muted-foreground">Atur logo utama website.</p>
      </div>
      <AdminBrandEditor initialLogoUrl={initialLogoUrl} />
    </div>
  );
}

