'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import SlideForm from '../../SlideForm';
import { Skeleton } from '@/components/ui/skeleton';

// Helper function to fetch a single slide from Express API
async function getSlide(id, token) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/hero-slides/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch slide data.');
    return res.json();
  } catch (error) {
    toast.error(error.message);
    return null;
  }
}

export default function EditSlidePage({ params }) {
  const { id } = params;
  const router = useRouter();
  const { data: session, status } = useSession();

  const [slide, setSlide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSlide = async () => {
      if (!session?.user?.accessToken || !id) return;

      setLoading(true);
      const data = await getSlide(id, session.user.accessToken);

      if (data) setSlide(data);
      else router.push('/admin/hero-section');

      setLoading(false);
    };

    fetchSlide();
  }, [id, session?.user?.accessToken, router]);

  const handleUpdateSlide = async (values) => {
    setIsSubmitting(true);

    const token = session?.user?.accessToken;
    if (!token) {
      toast.error('Authentication error. Please log in again.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/hero-slides/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error('Failed to update slide.');

      toast.success('Slide updated successfully!');
      router.push('/admin/hero-section');
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <p className="text-center p-8">
      <Skeleton />
    </p>
  )

  return (
    <div className="container mx-auto py-12">
      {slide && (
        <SlideForm
          onSubmit={handleUpdateSlide}
          slide={slide}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
