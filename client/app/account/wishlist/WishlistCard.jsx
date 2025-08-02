'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function WishlistCard({ product, onRemove }) {
  const imageUrl = product.images?.[0] || 'https://via.placeholder.com/150';

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 flex gap-4">
        <Link href={`/product/${product.slug}`} className="block flex-shrink-0">
          <Image
            src={imageUrl}
            alt={product.name}
            width={100}
            height={100}
            className="rounded-md object-cover aspect-square"
          />
        </Link>
        <div className="flex-grow flex flex-col justify-between">
          <div>
            <Link href={`/product/${product.slug}`} className="font-semibold hover:underline">
              {product.name}
            </Link>
            <p className="text-lg font-bold mt-1">₹{product.price.toFixed(2)}</p>
          </div>
          <div className="flex items-center justify-end">
             {/* We can add an "Add to Cart" button here later if we want */}
          </div>
        </div>
        <div className="flex-shrink-0">
            <Button
              aria-label="Remove from wishlist"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onRemove(product._id)}
            >
              <X className="h-4 w-4" />
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}