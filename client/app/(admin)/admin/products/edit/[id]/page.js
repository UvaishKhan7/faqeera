'use client';

import { useState, useEffect, useCallback } from 'react';
import ProductForm from '../../ProductForm';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

// A new function to get a single product by ID
async function getProduct(id) {
  try {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product data.');
    return res.json();
  } catch (error) {
    toast.error(error.message);
    return null;
  }
}

export default function EditProductPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const { data: session, status } = useSession();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Wait for session to load
  const isLoadingSession = status === 'loading';

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    const data = await getProduct(id);
    if (data) {
      setProduct(data);
    } else {
      router.push('/admin/products');
    }
    setLoading(false);
  }, [id, router]);

  useEffect(() => {
    if (!isLoadingSession && session) {
      fetchProduct();
    }
  }, [isLoadingSession, session, fetchProduct]);

  const handleUpdateProduct = async (values) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`, // <- assuming token is included in session.user
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to update product.');

      toast.success('Product updated successfully!');
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingSession || loading) {
    return <p className="text-center p-8">Loading product details...</p>;
  }

  if (!session) {
    return <p className="text-center p-8 text-red-500">You must be logged in to edit products.</p>;
  }

  return (
    <div className="container mx-auto py-12">
      {product ? (
        <ProductForm
          onSubmit={handleUpdateProduct}
          product={product}
          isSubmitting={isSubmitting}
        />
      ) : (
        <p>Product data could not be loaded.</p>
      )}
    </div>
  );
}
