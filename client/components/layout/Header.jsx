'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { Menu, X, UserCircle, LogOut, LayoutDashboard } from 'lucide-react';
import CartSheet from '@/components/shop/CartSheet';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import SearchBox from '../shop/SearchBox';

export default function Header() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const MobileNavContent = () => (
    <div className="mt-20">
      {user ? (
        <div className="space-y-3">
          <div className="mb-4 border-b pb-4">
            <p className="text-lg font-semibold">Hi! {user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Link className="flex items-center gap-2 py-3 text-lg" href="/account" onClick={() => setIsMobileMenuOpen(false)}>
            <UserCircle className="w-5 h-5" />My Account
          </Link>
          {user.isAdmin && (
            <Link className="flex items-center gap-2 py-3 text-lg" href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
              <LayoutDashboard className="h-5 w-5" />Admin Dashboard
            </Link>
          )}
          <div className="pt-4">
            <Button variant="destructive" onClick={() => signOut()} className="w-full flex gap-2">
              <LogOut className="h-5 w-5" />Logout
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Button asChild className="w-full text-lg">
            <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start py-6 text-lg">
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-60 w-full py-2 bg-black">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center justify-center shrink-0">
          <Image src="/BLVKC.svg" width={150} height={80} alt="Faqeera_logo" priority />
        </Link>

        <div className="hidden sm:flex flex-1 justify-center max-w-md">
          <SearchBox />
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* --- Desktop View --- */}
          <div className="hidden md:flex items-center gap-2">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Hi! {user.name}
                    <UserCircle className="h-6 w-6 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 z-70" align="end" forceMount>
                  <DropdownMenuItem onClick={() => router.push('/account')}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>My Account</span>
                  </DropdownMenuItem>
                  {user.isAdmin && (
                    <DropdownMenuItem onClick={() => router.push('/admin')}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4 text-destructive" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="outline"><Link href="/login">Log In</Link></Button>
                <Button asChild variant="outline"><Link href="/register">Sign Up</Link></Button>
              </>
            )}
          </div>

          <CartSheet />

          {/* --- Mobile View --- */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                {user ? (
                  <Button variant="outline" className="relative h-9 w-9">
                    <UserCircle className="h-6 w-6" />
                  </Button>
                ) : (
                  <Button variant="outline" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                )}
              </SheetTrigger>
              <SheetContent side="right" className="p-6">
                <SheetClose asChild>
                  <Button variant="outline" size="icon" className="absolute top-6 right-6">
                    <X className="h-6 w-6" />
                  </Button>
                </SheetClose>
                <MobileNavContent />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
