'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useAuthStore } from '@/store/auth';
import CartSheet from '@/components/shop/CartSheet';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsMobileMenuOpen(false);
  };

  const NavLinks = ({ isMobile = false }) => {
    if (isMobile) {
      // --- MOBILE-ONLY LINKS ---
      return (
        <div className="flex flex-col space-y-4">
          {user ? (
            <>
              <Link href="/account" className="block py-3 text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                My Account
              </Link>
              {user.isAdmin && (
                <>
                  <Link href="/admin/orders" className="block py-3 text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                    Manage Orders
                  </Link>
                  <Link href="/admin/products" className="block py-3 text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                    Manage Products
                  </Link>
                  <Link href="/admin/hero-section" className="..." onClick={() => setIsMobileMenuOpen(false)}>
                    Manage Hero
                  </Link>
                </>
              )}
              <div className="pt-4">
                <Button variant="destructive" onClick={handleLogout} className="w-full">
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="w-full justify-start py-6 text-lg">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
              </Button>
              <Button asChild className="w-full text-lg">
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      );
    }

    // --- DESKTOP-ONLY LINKS ---
    return (
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            {user.isAdmin && (
              <>
                <Button asChild variant="ghost">
                  <Link href="/admin/orders">Manage Orders</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/admin/products">Manage Products</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/admin/hero-section">Manage Hero</Link>
                </Button>
              </>
            )}
            <Button asChild variant="ghost">
              <Link href="/account">My Account</Link>
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button asChild variant="ghost">
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </>
        )}
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background rounded-b-4xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/faqeera.svg" width={120} height={50} alt="Faqeera Logo" />
        </Link>

        <div className="flex items-center gap-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex">
          <NavLinks />
        </div>

        {/* Mobile-Right Aligned Icons */}
          <CartSheet />
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-6">
                <SheetClose asChild>
                  <Button variant="outline" size="icon" className="absolute top-6 right-6">
                    <X className="h-6 w-6" />
                  </Button>
                </SheetClose>
                <div className="mt-20">
                  {user && (
                    <div className="mb-4 border-b pb-4">
                      <p className="text-lg font-semibold">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  )}
                  <NavLinks isMobile={true} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}