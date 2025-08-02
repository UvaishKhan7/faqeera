'use client';

import AdminSidebar from '@/components/admin/layout/AdminSidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    // Wait until session is loaded
    if (status === 'loading') return;

    const user = session?.user;

    if (!user || !user.isAdmin) {
      router.push('/'); // Redirect non-admins
    } else {
      setIsAllowed(true);
    }
  }, [session, status, router]);

  if (status === 'loading' || !isAllowed) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Skeleton className="w-32 h-32 rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2 sticky top-24">
            <div className="flex-1">
              <AdminSidebar />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <main className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
