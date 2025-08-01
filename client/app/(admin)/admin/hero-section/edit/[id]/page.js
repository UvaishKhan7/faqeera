'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import SlideForm from '../../SlideForm';

// Helper function to fetch a single slide
async function getSlide(id, token) {
  try {
    const res = await fetch(`/api/admin/hero-slides/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
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
  const { token } = useAuthStore();
  
  const [slide, setSlide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSlide = async () => {
        if (!token || !id) return;
        setLoading(true);
        // Note: We need a backend route to get a single slide by ID.
        // We will create this next. For now, this code anticipates it.
        const data = await getSlide(id, token);
        if (data) setSlide(data);
        else router.push('/admin/hero-section');
        setLoading(false);
    };
    fetchSlide();
  }, [id, token, router]);

  const handleUpdateSlide = async (values) => {
    setIsSubmitting(true);
    const token = useAuthStore.getState().token;
    if (!token) {
      toast.error('Authentication error. Please refresh and log in again.');
      setIsSubmitting(false);
      return;
    }
    try {
      await fetch(`/api/admin/hero-slides/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      toast.success('Slide updated successfully!');
      router.push('/admin/hero-section');
      router.refresh();
    } catch (error) {
      toast.error('Failed to update slide.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="text-center p-8">Loading slide data...</p>;
  
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