'use client';

import ProductForm from '../ProductForm';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Progress } from '@radix-ui/react-progress';

export default function NewProductPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
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
          'Authorization': `Bearer ${session?.user?.token}`, // token from session
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to create product.');

      toast.success('Product created successfully!');
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading' || !isClient) {
    return <Progress />;
  }

  if (!session) {
    toast.error('Unauthorized. Please login as admin.');
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto py-12">
      <ProductForm onSubmit={handleCreateProduct} isSubmitting={isSubmitting} />
    </div>
  );
}
