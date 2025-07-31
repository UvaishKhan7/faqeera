'use client';

import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      router.push('/'); // Redirect to homepage if not an admin
    } else {
      setIsAllowed(true);
    }
  }, [user, router]);

  // Render children only if user is a confirmed admin
  if (!isAllowed) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading or Access Denied...</p>
      </div>
    );
  }
  
  return <>{children}</>;
}