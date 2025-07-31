'use client';

import { useAuthStore } from '@/store/auth';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';


import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import OrderCardSkeleton from './OrderCardSkeleton';

export default function AccountPage() {
  const { user, token } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!token) {
        setLoading(false);
        return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders/myorders', {
          headers: { 'Authorization': `Bearer ${token}` },
          cache: 'no-store',
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch your orders.');
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, token, router]);

  const getBadgeVariant = (status) => {
    switch (status) {
      case 'Shipped': return 'secondary';
      case 'Delivered': return 'default';
      case 'Cancelled': return 'destructive';
      case 'Processing':
      default: return 'outline';
    }
  };
  
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-2">My Account</h1>
      {user && <p className="text-muted-foreground ...">Welcome back, {user.name}.</p>}
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
       
       {loading ? (
          // 1. If loading, show the skeleton loaders
          <div className="space-y-8">
            <OrderCardSkeleton />
            <OrderCardSkeleton />
            <OrderCardSkeleton />
          </div>
        ) : orders.length > 0 ? (
          // 2. If not loading and there are orders, show the real orders
          <div className="space-y-8">
            {/* This is the new mapping structure */}
            {orders.map(order => (
              <Card key={order._id} className="overflow-hidden">
                <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/50 p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <div>
                      <p className="font-semibold text-foreground">ORDER PLACED</p>
                      <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">TOTAL</p>
                      <p>₹{order.totalAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">SHIP TO</p>
                      <p>{user.name}</p> {/* Placeholder */}
                    </div>
                    <div className="sm:text-right">
                      <p className="font-semibold text-foreground">ORDER #</p>
                      <p className="font-mono">{order.orderNumber}</p>
                    </div>
                  </div>
                  <div className="self-start">
                    {/* Placeholder for future "View Order Details" and "Invoice" links */}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  {/* --- THE PRODUCT TILE SECTION --- */}
                  <div className="space-y-4">
                    {order.products.map(product => (
                      <div key={product._id} className="flex gap-4">
                        <Link href={`/product/${product.slug}`} className="block flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={100}
                            height={100}
                            className="rounded-md object-cover w-24 h-24"
                          />
                        </Link>
                        <div className="flex-grow">
                          <Link href={`/product/${product.slug}`} className="font-semibold hover:underline">
                            {product.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">Qty: {product.quantity}</p>
                           {/* Add tracking info here if order is shipped */}
                           {order.status === 'Shipped' && order.shippingInfo.trackingNumber &&
                               <div className="mt-2">
                                   <Badge variant="secondary">Shipped</Badge>
                                   <p className="text-sm text-muted-foreground mt-1">
                                       Tracking #: {order.shippingInfo.trackingNumber}
                                   </p>
                               </div>
                           }
                           {order.status === 'Delivered' && <Badge>Delivered</Badge>}
                           {order.status === 'Processing' && <Badge variant="outline">Processing</Badge>}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{product.price.toFixed(2)}</p>
                           {/* Placeholder for "Buy it again" button */}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                {/* Optional Footer for "Archive Order" or other actions */}
              </Card>
            ))}
          </div>
        ) : (
          <p>You have not placed any orders yet.</p>
        )}
      </div>
    </div>
  );
}