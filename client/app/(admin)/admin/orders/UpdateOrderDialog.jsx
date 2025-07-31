'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function UpdateOrderDialog({ order, onOrderUpdate }) {
  const { token } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  
  // State for the form inside the dialog
  const [newStatus, setNewStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.shippingInfo?.trackingNumber || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/orders/${order._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus, trackingNumber }),
      });
      if (!response.ok) throw new Error('Failed to update order.');
      
      const updatedOrder = await response.json();
      onOrderUpdate(updatedOrder); // Notify the parent table to update its state
      toast.success('Order updated successfully!');
      setIsOpen(false); // Close the dialog on success
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getBadgeVariant = (status) => {
    switch (status) {
      case 'Shipped':
        return 'secondary';
      case 'Delivered':
        return 'default'; // This is often green in shadcn
      case 'Cancelled':
        return 'destructive';
      case 'Processing':
      default:
        return 'outline';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Badge variant={getBadgeVariant(order.status)} className="cursor-pointer font-medium">
          {order.status}
        </Badge>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Order</DialogTitle>
          <p className="text-sm text-muted-foreground pt-1">
            Order ID: {order.paymentDetails.razorpay_order_id}
          </p>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <Select onValueChange={setNewStatus} defaultValue={newStatus} >
              <SelectTrigger id="status" className="col-span-3">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Show tracking number field only if status is Shipped or has been previously shipped */}
          {(newStatus === 'Shipped' || newStatus === 'Delivered') && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tracking" className="text-right">Tracking #</Label>
              <Input
                id="tracking"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="col-span-3"
                placeholder="Enter tracking number..."
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleUpdate} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}