import ProductCard from '@/components/shop/ProductCard';

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return <p className="col-span-full text-center text-muted-foreground">No products found for the selected filters.</p>;
  }
  
  return (
    <>
      {products.map((product, index) => (
        <ProductCard key={product._id} product={product} index={index} />
      ))}
    </>
  );
}