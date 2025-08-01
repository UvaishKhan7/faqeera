import ProductPageClient from './ProductPageClient';
import { getProductBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

async function ProductLoader({ params }) {
  const slug = params.slug; 
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductPageClient product={product} />;
}

export default function ProductDetailPage({ params }) {
  return (
    <Suspense fallback={<div className="container text-center p-24">Loading product...</div>}>
      <ProductLoader params={params} />
    </Suspense>
  );
}