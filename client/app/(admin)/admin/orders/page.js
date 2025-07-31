'use client';

import { useAuthStore } from '@/store/auth';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import UpdateOrderDialog from './UpdateOrderDialog'; 

export default function AdminOrdersPage() {
  const { token } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch orders if we have a token.
    if (!token) {
        setLoading(false); // If no token, we're not loading anything.
        return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/admin/orders', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch orders.');
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
  }, [token]);
  
  const handleOrderUpdate = (updatedOrder) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
    );
  };

  const getBadgeVariant = (status) => {
    switch (status) {
      case 'Shipped':
        return 'secondary';
      case 'Delivered':
        return 'default';
      case 'Cancelled':
        return 'destructive';
      case 'Processing':
      default:
        return 'outline';
    }
  };

  if (loading) return <p className="text-center p-8">Loading orders...</p>;
  
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">All Customer Orders</h1>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders && orders.length > 0 ? (
                orders.map(order => (
                <TableRow key={order._id}>
                    <TableCell className="font-mono text-xs">{order.paymentDetails.razorpay_order_id}</TableCell>
                    <TableCell>{order.user?.name || 'N/A'}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                    <UpdateOrderDialog order={order} onOrderUpdate={handleOrderUpdate} />
                    </TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={6} className="text-center">No orders found.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}