import ProductPageClient from './ProductPageClient';
import { getProductBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

// This is the new, safe data-loading component.
// It receives the opaque 'params' object.
async function ProductLoader({ params }) {
  // It is only safe to access the property *inside* an async component
  // after the page itself has rendered.
  const slug = params.slug; 
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // It passes the resolved data to the final client component.
  return <ProductPageClient product={product} />;
}

// This is the main page. It is now extremely simple.
export default function ProductDetailPage({ params }) {
  return (
    <Suspense fallback={<div className="container text-center p-24">Loading product...</div>}>
      {/* We pass the 'params' object, untouched, to the loader. */}
      <ProductLoader params={params} />
    </Suspense>
  );
}