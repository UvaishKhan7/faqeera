'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function AdminHeroSectionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slideToDelete, setSlideToDelete] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const user = session?.user;

  useEffect(() => {
    if (status === 'loading') return;
    if (!user || !user.isAdmin) {
      router.push('/');
    }
  }, [status, user, router]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/hero-slides', {
          headers: {
            Authorization: `Bearer ${session?.token}`
          }
        });
        if (!res.ok) throw new Error('Failed to fetch slides');
        const data = await res.json();
        setSlides(data);
      } catch (err) {
        toast.error(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if (session?.token && user?.isAdmin) {
      fetchSlides();
    }
  }, [session?.token, user]);

  const handleDelete = async () => {
    if (!slideToDelete) return;
    try {
      const res = await fetch(`/api/admin/hero-slides/${slideToDelete._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session?.token}`
        }
      });
      if (!res.ok) throw new Error('Failed to delete slide');
      setSlides(prev => prev.filter(s => s._id !== slideToDelete._id));
      toast.success('Slide deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Error deleting slide');
    } finally {
      setIsDialogOpen(false);
      setSlideToDelete(null);
    }
  };

  if (status === 'loading' || loading) {
    return <p className="text-center p-8">Loading slides...</p>;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className="container mx-auto py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Hero Section</h1>
          <Button asChild>
            <Link href="/admin/hero-section/new">Add New Slide</Link>
          </Button>
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
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/hero-section/edit/${slide._id}`}>Edit</Link>
                    </Button>
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
          <DialogDescription>
            This action will permanently delete the slide titled &quot;{slideToDelete?.title}&quot;.
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
