import { auth } from '@/auth';
import { AdminAccountForm } from '@/components/admin-account-form';

export default async function AdminAccountPage() {
  const session = await auth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Akun Saya</h1>
        <p className="text-muted-foreground">Ganti password akun admin Anda.</p>
      </div>
      <AdminAccountForm name={session?.user.name ?? ''} email={session?.user.email ?? ''} />
    </div>
  );
}
