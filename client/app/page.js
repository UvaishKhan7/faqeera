import { Suspense } from 'react';
import ProductGrid from '@/components/shop/ProductGrid';
import ProductCardSkeleton from '@/components/shop/ProductCardSkeleton';
import ProductFilters from '@/components/shop/ProductFilters';
import { getPublicProducts } from '@/lib/api';
import DynamicHeroSection from '@/components/layout/DynamicHeroSection';

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }) {
  
  const { products } = await getPublicProducts(searchParams);

  return (
    <>
      <DynamicHeroSection />
      <main id="product-grid" className="bg-background">
        <div className="mx-auto max-w-2xl px-4 py-16 sm-px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Our Collection</h2>
          </div>
          <ProductFilters />
          <div className="mt-6">
            <Suspense fallback={[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}>
              <ProductGrid products={products} />
            </Suspense>
          </div>
        </div>
      </main>
    </>
  );
}