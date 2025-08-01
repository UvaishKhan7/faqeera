'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import ProductReviews from './ProductReviews';
import StarRating from '@/components/ui/StarRating';
import ProductImageCarousel from './ProductImageCarousel';


export default function ProductPageClient({ product }) {
  const { addToCart } = useCartStore();
  
// State to track user's current selections
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // --- DERIVE AVAILABLE OPTIONS FROM VARIANTS ---
  const availableColors = useMemo(() => {
    return [...new Set(product.variants.map(v => v.color))];
  }, [product.variants]);
  
  const availableSizes = useMemo(() => {
    if (!selectedColor) return [];
    // Only show sizes that are available for the selected color
    return product.variants
      .filter(v => v.color === selectedColor)
      .map(v => v.size);
  }, [product.variants, selectedColor]);
  
  // Find the fully selected variant based on color and size
  const selectedVariant = useMemo(() => {
    if (!selectedColor || !selectedSize) return null;
    return product.variants.find(
      v => v.color === selectedColor && v.size === selectedSize
    );
  }, [product.variants, selectedColor, selectedSize]);
  
  // Reset size selection if the selected color changes
  const handleColorChange = (color) => {
    setSelectedColor(color);
    setSelectedSize(null);
  };
  
  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error('Please select a color and size.');
      return;
    }
    addToCart({ product, variant: selectedVariant });
    toast.success(`${product.name} (${selectedVariant.color}, ${selectedVariant.size}) added to cart!`);
  };

  return (
    <div className="bg-background text-foreground">
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="sticky top-16 aspect-square bg-white z-50"
          >
            <ProductImageCarousel images={product.images} productName={product.name} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              {product.name}
            </h1>
            <div className="mt-3 flex items-center">
              <StarRating
                rating={product.rating}
                size={24}
                isEditable={false}
              />
              <p className="ml-2 text-sm text-muted-foreground">
                ({product.numReviews} reviews)
              </p>
            </div>
            <div className="mt-6">
              <p className="text-3xl tracking-tight text-primary">
                ₹{product.price.toFixed(2)}
              </p>
            </div>
            <div className="mt-8 prose prose-lg max-w-none text-muted-foreground">
              <p>{product.description}</p>
            </div>
            <form className="mt-8">
              <fieldset>
                <legend className="text-lg font-medium mb-4">Color</legend>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map(color => (
                    <Button 
                      key={color} 
                      type="button" 
                      variant={selectedColor === color ? 'default' : 'outline'}
                      onClick={() => handleColorChange(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </fieldset>
              {selectedColor && (
                <fieldset className="mt-8">
                  <legend className="text-lg font-medium mb-4">Size</legend>
                  <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex flex-wrap gap-2">
                    {availableSizes.map(size => (
                      <div key={size}>
                        <RadioGroupItem value={size} id={`${size}-${selectedColor}`} className="sr-only" />
                        <Label
                          htmlFor={`${size}-${selectedColor}`}
                          className={`
                            flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase
                            cursor-pointer hover:bg-muted
                            ${selectedSize === size ? 'bg-primary text-primary-foreground' : 'bg-background'}
                          `}
                        >
                          {size}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </fieldset>
              )}
              <div className="mt-4 h-6">
                {selectedVariant && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-sm font-medium ${selectedVariant.stock < 5 && selectedVariant.stock > 0 ? 'text-destructive' : 'text-muted-foreground'}`}
                  >
                    {5 > selectedVariant.stock > 0 
                      ? `Only ${selectedVariant.stock} left in stock!` 
                      : selectedVariant.stock > 5 
                      ? `Available ${selectedVariant.stock} in stock.` 
                      : 'Out of stock'
                    }
                  </motion.p>
                )}
              </div>
              <div className="mt-4">
                <Button 
                  type="button" 
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || selectedVariant.stock === 0}
                  size="lg" 
                  className="w-full"
                >
                  {!selectedVariant ? 'Select Options' : selectedVariant.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </div>
            </form>
            <Accordion type="single" collapsible className="mt-8 w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Sizing & Fit</AccordionTrigger>
                <AccordionContent>
                  Runs true to size. Check our size guide for more details.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                <AccordionContent>
                  Free shipping on orders over ₹500. 7-day return policy.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
        <div className="mt-16 border-t pt-12">
          <ProductReviews product={product} />
        </div>
      </div>
    </div>
  );
}