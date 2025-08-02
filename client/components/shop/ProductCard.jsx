"use client"; // This component now uses client-side hooks for animation

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import WishlistButton from "@/components/shop/WishlistButton";

const ProductCard = ({ product, index }) => {
  const imageUrl =
    product.images?.[0] ||
    "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg";
  const blurDataURL =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg==";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/product/${product.slug}`} className="group block">
        <Card className="overflow-hidden px-2 shadow-lg rounded-lg">
          <CardContent className="p-0">
            <div className="relative min-h-[150px] md:h-[270px] lg:h-[300px] ">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain transition-transform duration-500 ease-in-out scale-95 group-hover:scale-100"
                placeholder="blur"
                blurDataURL={blurDataURL}
              />
            </div>
            <div className="pt-4 text-left">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-800 truncate">
                  {product.name}
                </h3>
                <Badge variant="secondary">{product.category}</Badge>
              </div>
              <div className="flex items-center justify-between pr-2 mt-4" onClick={(e)=>e.stopPropagation()}>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  ₹{product.price.toFixed(2)}
                </p>
                <WishlistButton
                  productId={product._id}
                  size={28}
                  className="hover:scale-110"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
