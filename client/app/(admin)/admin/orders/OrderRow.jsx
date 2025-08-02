'use client';

import {
  TableRow,
  TableCell,
  Table,
  TableHeader,
  TableHead,
  TableBody
} from '@/components/ui/table';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronsUpDown } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import UpdateOrderItemDialog from './UpdateOrderItemDialog';

export default function OrderRow({ order, onOrderUpdate }) {
  
  const getBadgeVariant = (status) => {
    switch (status) {
      case 'Delivered': return 'default'; // Green
      case 'Shipped': return 'secondary'; // Gray
      case 'In Transit': return 'yellow';
      case 'Out for Delivery': return 'yellow';
      case 'Partially Shipped': return 'yellow';
      case 'Cancelled': return 'destructive'; // Red
      case 'Processing':
      case 'Order Placed':
      default: return 'outline'; // Default border
    }
  };

  return (
    <Collapsible asChild key={order._id}>
        <TableBody>
            {/* The main, always-visible row for the order */}
            <TableRow>
                <TableCell className="font-mono text-xs w-[180px]">
                    <CollapsibleTrigger asChild>
                    <span className="flex items-center gap-2 cursor-pointer hover:underline p-2 -ml-2">
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                        <span>{order.orderNumber}</span>
                    </span>
                    </CollapsibleTrigger>
                </TableCell>
                <TableCell className="font-medium">{order.userId?.name || 'N/A'}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                    <Badge variant={getBadgeVariant(order.overallStatus)}>{order.overallStatus}</Badge>
                </TableCell>
                <TableCell className="text-right font-medium">₹{order.totalAmount.toFixed(2)}</TableCell>
            </TableRow>

            {/* The hidden content, which is a row containing a nested table */}
            <CollapsibleContent asChild>
                <TableRow>
                    <TableCell colSpan={5} className="p-0">
                        <div className="bg-muted/30 p-4">
                           <Table>
                                <TableHeader>
                                    <TableRow className="text-xs">
                                        <TableHead>Product</TableHead>
                                        <TableHead>Qty</TableHead>
                                        <TableHead>Item Status</TableHead>
                                        <TableHead>Tracking #</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.products?.map(item => (
                                        <TableRow key={item._id} className="text-xs bg-background">
                                            <TableCell className="flex items-center gap-2 font-medium">
                                                <Image 
                                                    src={item.image} 
                                                    alt={item.name} 
                                                    width={32} 
                                                    height={32} 
                                                    className="rounded" 
                                                />
                                                <span>{item.name}</span>
                                            </TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>
                                                <Badge variant={getBadgeVariant(item.status)}>{item.status}</Badge>
                                            </TableCell>
                                            <TableCell className="font-mono">{item.trackingNumber || 'N/A'}</TableCell>
                                            <TableCell className="text-right">
                                                <UpdateOrderItemDialog order={order} item={item} onOrderUpdate={onOrderUpdate} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TableCell>
                </TableRow>
            </CollapsibleContent>
        </TableBody>
    </Collapsible>
  );
}