import { Suspense } from 'react';
import ProductLoader from '@/components/shop/ProductLoader';
import ProductCardSkeleton from '@/components/shop/ProductCardSkeleton';
import ProductFilters from '@/components/shop/ProductFilters';
import HeroSection from '@/components/layout/HeroSection';

// THE ONLY safe way to read searchParams is to destructure them in the Page signature.
export default function HomePage({ searchParams }) {
  // Now 'keyword', 'category', and 'sortBy' are just normal, safe strings or undefined.

  return (
    <> {/* Use a React Fragment to wrap both sections */}
      <HeroSection />

      {/* --- THIS IS THE MAIN PRODUCT SECTION --- */}
      {/* Add an id here for the scroll button to target */}
      <main id="product-grid" className="bg-background">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Our Collection
            </h2>
          </div>

          <ProductFilters />

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            <Suspense fallback={[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}>
              <ProductLoader searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </main>
    </>
  );
}