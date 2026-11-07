import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { AdminTrustedPartnersTable } from '@/components/admin-trusted-partners-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

export default async function AdminTrustedPartnersPage() {
  const items = await prisma.trustedPartner.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    select: {
      id: true,
      name: true,
      imageUrl: true,
      published: true,
      sortOrder: true,
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Mitra & brand</h1>
          <p className="text-muted-foreground">
            Logo untuk pita &quot;Dipercaya oleh&quot; di beranda (tampil hitam-putih, berwarna saat disorot).
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/trusted-partners/new">
            <Plus className="h-4 w-4 mr-2" />
            Tambah mitra
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar mitra</CardTitle>
          <CardDescription>{items.length} item</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminTrustedPartnersTable items={items} />
        </CardContent>
      </Card>
    </div>
  );
}
