'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { getAdminProducts } from '@/lib/api';
import Image from 'next/image';
import ProductCardSkeleton from '@/components/shop/ProductCardSkeleton';

export default function AdminProductsPage() {
  const { token } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        if (token) {
          const productsArray = await getAdminProducts(token);
          setProducts(productsArray);
        }
      } catch (error) {
        toast.error("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [token]);

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(`/api/admin/products/${productToDelete._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete product.');

      setProducts(products.filter(p => p._id !== productToDelete._id));
      toast.success('Product deleted successfully.');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setProductToDelete(null);
      setIsDialogOpen(false);
    }
  };

  const openDeleteDialog = (product) => {
    setProductToDelete(product);
    setIsDialogOpen(true);
  };

  if (loading) return <p className="text-center p-8">
    <ProductCardSkeleton />
  </p>;

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className="container mx-auto py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Products</h1>
          <Button asChild>
            <Link href="/admin/products/new">Add New Product</Link>
          </Button>
        </div>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Image</TableHead><TableHead>Name</TableHead><TableHead>Category</TableHead><TableHead>Price</TableHead><TableHead>Total Stock</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell className="font-medium">
                    <Image
                      src={product.images[0]}
                      width={60}
                      height={60}
                      alt={product.name}
                      priority
                      className='rounded object-contain aspect-square'
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>₹{product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    {product.variants.reduce((total, v) => total + v.stock, 0)}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/products/edit/${product._id}`}>Edit</Link>
                    </Button>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(product)}>
                        Delete
                      </Button>
                    </DialogTrigger>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the product
            &quot;{productToDelete?.name}&quot;.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}