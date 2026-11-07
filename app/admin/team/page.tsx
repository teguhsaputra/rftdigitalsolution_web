import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { adminPublicSelect } from '@/lib/admin-users';
import { AdminTeamManager } from '@/components/admin-team-manager';

export default async function AdminTeamPage() {
  const session = await auth();
  if (!session) redirect('/login');
  const users = await prisma.adminUser.findMany({
    select: adminPublicSelect,
    orderBy: [{ active: 'desc' }, { name: 'asc' }],
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Tim Admin</h1>
        <p className="text-muted-foreground">Kelola siapa saja yang bisa masuk ke admin panel.</p>
      </div>
      <AdminTeamManager
        currentUserId={session.user.id}
        users={users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          active: u.active,
          lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
          lockedUntil: u.lockedUntil?.toISOString() ?? null,
        }))}
      />
    </div>
  );
}
