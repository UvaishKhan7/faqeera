'use client';

import ProductForm from '../ProductForm';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

export default function NewProductPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCreateProduct = async (values) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to create product.');

      toast.success('Product created successfully!');
      router.push('/admin/products');
      router.refresh(); // Important to refresh the product list page
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-12">
      {/* NEW: Conditional rendering */}
      {isClient ? (
        <ProductForm onSubmit={handleCreateProduct} isSubmitting={isSubmitting} />
      ) : (
        // You can show a skeleton/loader here while waiting for the client to mount
        <p>Loading form...</p>
      )}
    </div>
  );
}