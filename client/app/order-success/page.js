'use client'; // <-- THIS IS THE CRITICAL FIX: MOVED TO THE TOP OF THE FILE

import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation'; // Now this import is allowed

// This is the client component that safely reads the URL parameters.
function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order_number');
  const paymentId = searchParams.get('payment_id');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-background flex flex-col items-center justify-center text-center p-8"
    >
      <CheckCircle2 className="w-24 h-24 text-green-500 mb-6" />
      <h1 className="text-4xl font-bold mb-2">Thank You for Your Order!</h1>
      <p className="text-2xl text-muted-foreground mb-8">A confirmation email has been sent to you.</p>
      
      {orderNumber && (
        <div className="text-center space-y-4 mb-8">
          <div>
            <p className="text-md text-muted-foreground">Your Order Number:</p>
            <p className="font-mono text-xl font-semibold bg-muted p-3 rounded-md mt-1">{orderNumber}</p>
          </div>
          {paymentId && (
            <div className="text-xs text-muted-foreground pt-2">
              <p>Reference Payment ID: {paymentId}</p>
            </div>
          )}
        </div>
      )}

      <Button asChild size="lg">
        <Link href="/">Continue Shopping</Link>
      </Button>
    </motion.div>
  );
}

// The main page component exports the default function.
export default function OrderSuccessPage() {
  // Suspense is essential for useSearchParams to work without server-side rendering issues.
  return (
    <div className="container mx-auto my-24">
      <Suspense fallback={<div className="text-center p-8">Loading confirmation...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}