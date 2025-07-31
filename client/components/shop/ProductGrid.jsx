import ProductCard from '@/components/shop/ProductCard';

export default function ProductGrid({ products }) {
  return (
    <>
      {products.map((product, index) => (
        <ProductCard key={product._id} product={product} index={index} />
      ))}
    </>
  );
}