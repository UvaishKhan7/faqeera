'use client';

import { useState, useEffect, useCallback } from 'react';
import ProductForm from '../../ProductForm';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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
  const { token } = useAuthStore();
  const router = useRouter();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  // Using useCallback to memoize the function
  const fetchProduct = useCallback(async () => {
    setLoading(true);
    const data = await getProduct(id);
    if (data) {
      setProduct(data);
    } else {
      // If product not found, redirect
      router.push('/admin/products');
    }
    setLoading(false);
  }, [id, router]);

  useEffect(() => {
    if (isClient) {
      fetchProduct();
    }
  }, [isClient, fetchProduct]);

  const handleUpdateProduct = async (values) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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

  if (!isClient || loading) {
    return <p className="text-center p-8">Loading product details...</p>;
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