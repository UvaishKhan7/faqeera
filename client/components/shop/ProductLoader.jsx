import { getProducts } from '@/lib/api';
import ProductGrid from '@/components/shop/ProductGrid';

// This component now ONLY accepts simple, safe string props.
export default async function ProductLoader({ keyword, category, sortBy }) {
  // It passes a clean object of primitives to the fetching function.
  const products = await getProducts({ keyword, category, sortBy });

  // This is now safe, as 'products' is guaranteed to be an array.
  if (products.length === 0) {
    let message = "No products found.";
    if (keyword) {
      message = `No products found for "${keyword}".`;
    } else if (category) {
      message = `No products found in the ${category} category.`;
    }
    return <p className="col-span-full text-center text-muted-foreground">{message}</p>;
  }

  return <ProductGrid products={products} />;
}