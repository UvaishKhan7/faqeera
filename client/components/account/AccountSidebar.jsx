'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Package, Heart, CreditCard, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils'; // utility for conditional classnames

const navLinks = [
  { href: '/account', label: 'Profile', icon: User },
  { href: '/account/orders', label: 'My Orders', icon: Package },
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/account/address', label: 'Saved Addresses', icon: MapPin },
  { href: '/account/saved-cards', label: 'Saved Cards', icon: CreditCard },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
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
  );
}