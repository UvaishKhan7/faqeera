'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { getMyAddresses, addMyAddress, updateMyAddress, deleteMyAddress, toggleMyDefaultAddress } from '@/lib/api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import AddressCard from './AddressCard';
import AddressForm from './AddressForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { DialogDescription } from '@radix-ui/react-dialog';

export default function SavedAddressPage() {
    const { data: session, status } = useSession();
    const token = session?.user?.backendToken;
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [addressToDelete, setAddressToDelete] = useState(null);

    const fetchAddresses = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await getMyAddresses(token);
            setAddresses(data);
        } catch (error) {
            toast.error(error.message || "Failed to load addresses.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchAddresses();
        }
    }, [status, fetchAddresses]);

    const handleFormSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            const updatedAddresses = editingAddress
                ? await updateMyAddress({ addressId: editingAddress._id, address: values, token })
                : await addMyAddress({ address: values, token });
            setAddresses(updatedAddresses);
            toast.success(`Address ${editingAddress ? 'updated' : 'added'}!`);
            setIsDialogOpen(false);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!addressToDelete) return; 
        try {
            await deleteMyAddress({ addressId: addressToDelete, token });
            setAddresses(currentAddresses => currentAddresses.filter(addr => addr._id !== addressToDelete));
            toast.success('Address deleted successfully.');
        } catch(error) {
            toast.error(error.message || 'Failed to delete address.');
        } finally {
            setAddressToDelete(null);
        }
    };

    const openDeleteDialog = (addressId) => {
      setAddressToDelete(addressId);
    };

    const handleEdit = (address) => {
        setEditingAddress(address);
        setIsDialogOpen(true);
    };

    const handleAddNew = () => {
        setEditingAddress(null);
        setIsDialogOpen(true);
    };

    const handleToggleDefault = async (addressId) => {
        if (!token) return toast.error("Authentication Error");
        try {
            const updatedAddresses = await toggleMyDefaultAddress({ addressId, token });
            setAddresses(updatedAddresses);
        } catch(error) {
            toast.error(error.message || 'Failed to update default address.');
        }
    };

    if (session?.status === 'loading' || loading) {
      return (
          <div className="space-y-6">
              <div className="flex justify-between items-center"><Skeleton className="h-9 w-48" /><Skeleton className="h-10 w-32" /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><Skeleton className="h-40" /><Skeleton className="h-40" /></div>
          </div>
      );
    }

    return (
         <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Manage Addresses</h1>
                <Button onClick={handleAddNew}><PlusCircle className="h-4 w-4 mr-2" />Add New Address</Button>
            </div>

            {addresses.length > 0 ? (
                <AlertDialog>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {addresses.map(addr => (
                            <AddressCard 
                                key={addr._id} 
                                address={addr} 
                                onEdit={handleEdit}
                                onDelete={() => openDeleteDialog(addr._id)}
                                onToggleDefault={handleToggleDefault} 
                            />
                        ))}
                    </div>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>This will permanently delete this address.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setAddressToDelete(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            ) : (
                <div className="text-center py-12 px-6 border-2 border-dashed rounded-lg">
                    <h3 className="font-semibold">No Saved Addresses</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Add a new address to get started.
                    </p>
                </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) setEditingAddress(null);
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <AddressForm
                        onSubmit={handleFormSubmit}
                        initialData={editingAddress}
                        isSubmitting={isSubmitting}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}