'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import SlideForm from '../SlideForm';

export default function NewSlidePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateSlide = async (values) => {
    setIsSubmitting(true);
    const token = useAuthStore.getState().token;
    if (!token) {
      toast.error('Authentication error. Please refresh and log in again.');
      setIsSubmitting(false);
      return;
    }
    try {
      const response = await fetch('/api/admin/hero-slides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create slide.');
      }

      toast.success('New hero slide created successfully!');
      router.push('/admin/hero-section');
      router.refresh(); // Tells Next.js to re-fetch the slide list on the previous page
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