import { AdminPortfolioEditor } from '@/components/admin-portfolio-editor';
import { getServiceTitleOptions } from '@/lib/public-content';

export default async function AdminNewPortfolioPage() {
  const serviceOptions = await getServiceTitleOptions();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Portfolio baru</h1>
        <p className="text-muted-foreground">Isi formulir lalu simpan.</p>
      </div>
      <AdminPortfolioEditor serviceOptions={serviceOptions} />
    </div>
  );
}
