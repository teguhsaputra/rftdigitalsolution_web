import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { AdminServicesTable } from '@/components/admin-services-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

export default async function AdminServicesPage() {
  const items = await prisma.service.findMany({
    orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      sortOrder: true,
      priceFrom: true,
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Layanan</h1>
          <p className="text-muted-foreground">
            Kelola kartu layanan di beranda (single page).
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/services/new">
            <Plus className="h-4 w-4 mr-2" />
            Layanan baru
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar layanan</CardTitle>
          <CardDescription>{items.length} item</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminServicesTable items={items} />
        </CardContent>
      </Card>
    </div>
  );
}
