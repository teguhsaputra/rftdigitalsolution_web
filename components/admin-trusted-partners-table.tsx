'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

type Row = {
  id: string;
  name: string;
  imageUrl: string;
  published: boolean;
  sortOrder: number;
};

export function AdminTrustedPartnersTable({ items }: { items: Row[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus mitra ini?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/trusted-partners/${id}`, { method: 'DELETE' });
      if (res.ok) router.refresh();
      else alert('Gagal menghapus');
    } finally {
      setDeleting(null);
    }
  };

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        Belum ada mitra. Tambah logo dari tombol di atas — sampai ada data, beranda menampilkan
        logo klien bawaan.
      </p>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[820px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Logo</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Urutan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
        {items.map((p) => (
          <TableRow key={p.id}>
            <TableCell>
              <div className="relative h-10 w-16 rounded border border-border/50 bg-muted/30 overflow-hidden">
                <Image
                  src={p.imageUrl}
                  alt=""
                  fill
                  unoptimized
                  className="object-contain p-1"
                />
              </div>
            </TableCell>
            <TableCell className="font-medium">{p.name}</TableCell>
            <TableCell>{p.sortOrder}</TableCell>
            <TableCell>{p.published ? 'Published' : 'Draft'}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/trusted-partners/${p.id}`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(p.id)}
                  disabled={deleting === p.id}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
