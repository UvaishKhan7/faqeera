'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { getAdminOrders } from '@/lib/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead
} from '@/components/ui/table';
import OrderRow from './OrderRow';
import { Progress } from '@radix-ui/react-progress';

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = session?.user?.backendToken;

  useEffect(() => {
    if (status === 'authenticated' && token) {
      const fetchOrders = async () => {
        setLoading(true);
        try {
          const fetchedOrders = await getAdminOrders(token);
          setOrders(fetchedOrders || []);
        } catch (error) {
          toast.error('Failed to fetch orders.');
          console.error('Fetch Orders Error:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    } else if (status !== 'loading') {
      setLoading(false);
    }
  }, [status, token]);

  const handleOrderUpdate = (updatedOrder) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
    );
  };

  if (loading || !session) {
    return <Progress />;
  }

  return (
    <div>
      <h1 className="text-lg font-semibold md:text-2xl mb-4">Customer Orders</h1>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Overall Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          {orders && orders.length > 0 ? (
            orders.map(order => (
              <OrderRow key={order._id} order={order} onOrderUpdate={handleOrderUpdate} />
            ))
          ) : (
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No orders found.
                </TableCell>
              </TableRow>
            </TableBody>
            )}
        </Table>
      </div>
    </div>
  );
}