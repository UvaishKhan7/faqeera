"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { updateOrderItemStatus } from "@/lib/api";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";

export default function UpdateOrderItemDialog({ order, item, onOrderUpdate }) {
  const { data: session } = useSession();
  const token = session?.user?.backendToken;
  const [isOpen, setIsOpen] = useState(false);

  const [newStatus, setNewStatus] = useState(item.status);
  const [trackingNumber, setTrackingNumber] = useState(
    item.trackingNumber || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async () => {
    if (!token) return toast.error("Authentication error.");
    setIsSubmitting(true);
    try {
      const updatedOrder = await updateOrderItemStatus({
        orderId: order._id,
        itemId: item._id,
        status: newStatus,
        trackingNumber: trackingNumber,
        token: token,
      });

      onOrderUpdate(updatedOrder);
      toast.success(`Item "${item.name}" updated successfully!`);
      setIsOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to update item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Item Status</DialogTitle>
          <p className="text-sm text-muted-foreground pt-1 truncate">
            {item.name} in Order #{order.orderNumber}
          </p>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select onValueChange={setNewStatus} defaultValue={newStatus}>
              <SelectTrigger id="status" className="col-span-3">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Order Placed">Order Placed</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Out for Delivery">
                  Out for Delivery
                </SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(newStatus === "Shipped" || newStatus === "Delivered") && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tracking" className="text-right">
                Tracking #
              </Label>
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
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleUpdate} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
