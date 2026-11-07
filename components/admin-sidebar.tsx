'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  FileText,
  Loader2,
  LogOut,
  Briefcase,
  Layers,
  Info,
  Users,
  Handshake,
  Image as ImageIcon,
  ShieldCheck,
  UserCog,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/posts', label: 'Blogs', icon: FileText },
  { href: '/admin/brand', label: 'Brand & Kontak', icon: ImageIcon },
  { href: '/admin/services', label: 'Layanan', icon: Briefcase },
  { href: '/admin/trusted-partners', label: 'Mitra & brand', icon: Handshake },
  { href: '/admin/portfolio', label: 'Portfolio', icon: Layers },
  { href: '/admin/about', label: 'Tentang', icon: Info },
  { href: '/admin/careers', label: 'Karier', icon: Users },
  { href: '/admin/team', label: 'Tim Admin', icon: ShieldCheck },
  { href: '/admin/account', label: 'Akun Saya', icon: UserCog },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [signingOut, setSigningOut] = useState(false);
  const { data: session } = useSession();

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    onNavigate?.();
    try {
      await signOut({ redirect: false });
      window.location.replace('/login');
    } catch {
      setSigningOut(false);
    }
  }

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    if (href === '/admin') return pathname === '/admin';
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside className="w-64 border-r border-border/40 bg-card/50 p-6 flex flex-col">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-foreground">Admin Panel</h2>
        <p className="text-sm text-muted-foreground mt-1">PT. RFT Digital Solution</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-border/40">
        {session?.user && (
          <div className="mb-3 px-4">
            <p className="truncate text-sm font-semibold">{session.user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{session.user.email}</p>
          </div>
        )}
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          disabled={signingOut}
          aria-busy={signingOut}
          onClick={() => void handleSignOut()}
        >
          {signingOut ? (
            <Loader2 className="h-5 w-5 mr-3 shrink-0 animate-spin" aria-hidden />
          ) : (
            <LogOut className="h-5 w-5 mr-3 shrink-0" aria-hidden />
          )}
          {signingOut ? 'Memproses keluar…' : 'Keluar'}
        </Button>
      </div>
    </aside>
  );
}
