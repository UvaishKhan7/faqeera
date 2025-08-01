import { Suspense } from 'react';
import ProductGrid from '@/components/shop/ProductGrid';
import ProductCardSkeleton from '@/components/shop/ProductCardSkeleton';
import ProductFilters from '@/components/shop/ProductFilters';
import { getPublicProducts } from '@/lib/api';
import DynamicHeroSection from '@/components/layout/DynamicHeroSection';

// --- THE DEFINITIVE, FINAL FIX: FORCE DYNAMIC RENDERING ---
// This one line resolves the entire class of errors.
export const dynamic = 'force-dynamic';

// The page itself is now an async component.
export default async function HomePage({ searchParams }) {
  // We can now safely use searchParams because the page is marked as dynamic.
  // We pass the object directly to the fetching function.
  const { products } = await getPublicProducts(searchParams);

  return (
    <>
      <DynamicHeroSection />
      <main id="product-grid" className="bg-background">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Our Collection</h2>
          </div>
          <ProductFilters />
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            <Suspense fallback={[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}>
              {/* We render the ProductGrid directly with the fetched data */}
              <ProductGrid products={products} />
            </Suspense>
          </div>
        </div>
      </main>
    </>
  );
}