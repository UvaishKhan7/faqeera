import { getPublicProducts } from '@/lib/api';
import ProductGrid from '@/components/shop/ProductGrid';

// This is the "smart" component. It's the first in the chain allowed to read searchParams.
export default async function ProductLoader({ searchParams }) {
  // We extract the primitive values here, inside the async Suspense child.
  const keyword = searchParams?.keyword || '';
  const category = searchParams?.category || '';
  const sortBy = searchParams?.sortBy || '';
  
  // We pass the safe, primitive strings to the data fetching function.
  const { products } = await getPublicProducts({ keyword, category, sortBy });

  if (!products || products.length === 0) {
    let message = "No products found.";
    if (keyword) {
      message = `No products found for "${keyword}".`;
    } else if (category) {
      message = `No products found in the ${category} category.`;
    }
    return <p className="col-span-full text-center text-muted-foreground">{message}</p>;
  }

  // Pass the final, clean data to the "dumb" display component.
  return <ProductGrid products={products} />;
}