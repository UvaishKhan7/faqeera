'use client';

import { useCartStore } from '@/store/cart';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import CheckoutForm from './CheckoutForm';

// --- Reusable Skeleton Loader ---
const CheckoutSkeleton = () => (
    <div className="container mx-auto px-4 py-12">
      <div className="h-8 w-48 mx-auto bg-gray-200 rounded animate-pulse mb-12"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-40 bg-gray-200/50 rounded-lg animate-pulse"></div>
        </div>
        <div className="space-y-4">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-64 bg-gray-200/50 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
);


export default function CheckoutPage() {
  const { items } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal < 500 ? (subtotal > 0 ? 50.00 : 0) : 0;
  const total = subtotal + shipping;
  
  // --- USE THE SKELETON LOADER ---
  if (!isMounted) {
    return <CheckoutSkeleton />;
  }

  if (items.length === 0) { /* ... */ }

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };
  
  return (
    <motion.div
      className="container mx-auto px-4 py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 variants={itemVariants} className="text-3xl font-bold text-center mb-12">
        Checkout
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Side: Checkout Form (with animation) */}
        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
          <div className="bg-muted/30 p-8 rounded-lg">
            <CheckoutForm totalAmount={total} />
          </div>
        </motion.div>

        {/* Right Side: Order Summary (with animation) */}
        <motion.div variants={itemVariants} className="bg-muted/30 p-8 rounded-lg">
          <h2 className="text-xl font-semibold mb-6">Your Order Summary</h2>
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.cartItemId} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Image src={item.image} alt={item.name} width={48} height={48} className="rounded-md" />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.color} / {item.size}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t my-6"></div>
          <div className="space-y-2">
            <div className="flex justify-between"><p>Total MRP</p><p>₹{subtotal.toFixed(2)}</p></div>
            <div className="flex justify-between"><p>Shipping</p><p>₹{shipping.toFixed(2)}</p></div>
          </div>
          <div className="border-t my-6"></div>
          <div className="flex justify-between font-bold text-lg"><p>Total</p><p>₹{total.toFixed(2)}</p></div>
        </motion.div>
      </div>
    </motion.div>
  );
}