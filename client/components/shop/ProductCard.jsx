'use client'; // This component now uses client-side hooks for animation

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ProductCard = ({ product, index }) => {
  const imageUrl = product.images?.[0] || 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg';

  // A generic, tiny gray pixel to use as a blur placeholder
  const blurDataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg==';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }} // Staggered animation
    >
      <Link href={`/product/${product.slug}`} className="group block">
        <Card className="overflow-hidden px-2 shadow-lg rounded-lg">
          <CardContent className="p-0">
            <div className="relative h-[380px]">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes=''
                className="object-contain transition-transform duration-500 ease-in-out scale-95 group-hover:scale-100"
                placeholder="blur"
                blurDataURL={blurDataURL} 
              />
            </div>
            <div className="pt-4 text-left">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-800">
                  {product.name}
                </h3>
                <Badge variant="secondary">{product.category}</Badge>
              </div>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                ₹{product.price.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default ProductCard;