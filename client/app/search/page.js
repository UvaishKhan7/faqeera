import { Suspense } from 'react';
import ProductCardSkeleton from '@/components/shop/ProductCardSkeleton';
import ProductFilters from '@/components/shop/ProductFilters';

export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }) {
  const { products, keyword } = await getPublicProducts(searchParams);

  return (
    <main className="bg-background">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight mb-12">
          Search results for: <span className="text-primary">"{keyword}"</span>
        </h1>
        
        <ProductFilters />
        
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          <Suspense fallback={[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}>
            <ProductGrid products={products} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}