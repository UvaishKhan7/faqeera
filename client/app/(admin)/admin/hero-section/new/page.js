'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import SlideForm from '../SlideForm';
import { useSession } from 'next-auth/react';

export default function NewSlidePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateSlide = async (values) => {
    setIsSubmitting(true);

    if (status === 'unauthenticated' || !session?.user?.accessToken) {
      toast.error('Authentication error. Please log in again.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/hero-slides`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create slide.');
      }

      toast.success('New hero slide created successfully!');
      router.push('/admin/hero-section');
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <SlideForm onSubmit={handleCreateSlide} isSubmitting={isSubmitting} />
    </div>
  );
}
