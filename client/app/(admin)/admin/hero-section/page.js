'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function AdminHeroSectionPage() {
  const { token } = useAuthStore();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slideToDelete, setSlideToDelete] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchSlides = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/admin/hero-slides', { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) throw new Error('Failed to fetch slides.');
        const data = await response.json();
        setSlides(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchSlides();
  }, [token]);

  const handleDelete = async () => {
    if (!slideToDelete) return;
    try {
      await fetch(`/api/admin/hero-slides/${slideToDelete._id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      });
      setSlides(slides.filter(s => s._id !== slideToDelete._id));
      toast.success('Slide deleted successfully.');
    } catch (error) {
      toast.error('Failed to delete slide.');
    } finally {
      setIsDialogOpen(false);
      setSlideToDelete(null);
    }
  };

  if (loading) return <p className="text-center p-8">Loading slides...</p>;

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className="container mx-auto py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Hero Section</h1>
          <Button asChild><Link href="/admin/hero-section/new">Add New Slide</Link></Button>
        </div>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slides.map(slide => (
                <TableRow key={slide._id}>
                  <TableCell>
                    <Image src={slide.imageUrl} alt={slide.title} width={80} height={45} className="rounded-md object-cover" />
                  </TableCell>
                  <TableCell className="font-medium">{slide.title}</TableCell>
                  <TableCell>{slide.displayOrder}</TableCell>
                  <TableCell>
                    <Badge variant={slide.isActive ? 'default' : 'secondary'}>
                      {slide.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button asChild variant="outline" size="sm"><Link href={`/admin/hero-section/edit/${slide._id}`}>Edit</Link></Button>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm" onClick={() => setSlideToDelete(slide)}>Delete</Button>
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
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>This action will permanently delete the slide titled "{slideToDelete?.title}".</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}