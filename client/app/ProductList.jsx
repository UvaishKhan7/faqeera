import { getProducts } from '@/lib/api';
import ProductCard from '@/components/shop/ProductCard';

export default async function ProductList() {
  const products = await getProducts();

  if (products.length === 0) {
    return (
      <p className="mt-4 text-center text-muted-foreground col-span-full">
        Our collection is being curated. Please check back soon.
      </p>
    );
  }

  return (
    <>
      {products.map((product, index) => (
        <ProductCard key={product._id} product={product} index={index} />
      ))}
    </>
  );
}