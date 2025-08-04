import ProductPageClient from './ProductPageClient';
import { getProductBySlug } from '@/lib/api';
import { Progress } from '@radix-ui/react-progress';
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
    <Suspense fallback={<Progress />}>
      <ProductLoader params={params} />
    </Suspense>
  );
}