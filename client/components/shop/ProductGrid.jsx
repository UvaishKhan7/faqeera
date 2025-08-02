'use client';

import ProductCard from '@/components/shop/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <p className="col-span-full text-center text-muted-foreground">
        No products found for the selected filters.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={JSON.stringify(products)} // triggers re-animation on change
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="contents" // ⚠️ KEY: Don't break the grid layout
        >
          {products.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
