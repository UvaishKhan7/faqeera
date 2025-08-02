'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  ImageIcon,
  Home,
} from 'lucide-react';

const adminNavLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/hero-section', label: 'Hero Section', icon: ImageIcon },
  { href: '/admin/customers', label: 'Customers', icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-6 p-4 lg:p-6">
        <div className="flex items-center gap-2 font-semibold">
          <LayoutDashboard className="h-6 w-6" />
          <span>Admin Panel</span>
        </div>
        
        <nav className="flex flex-col gap-2">
          {adminNavLinks.map((link) => {
            const isActive = link.href === '/admin' ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  isActive && 'bg-muted text-primary'
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto">
           <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                <Home className="h-4 w-4" />
                Back to Site
           </Link>
        </div>
      </div>
    </div>
  );
}