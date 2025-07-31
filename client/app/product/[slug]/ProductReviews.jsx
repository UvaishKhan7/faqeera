'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import StarRating from '@/components/ui/StarRating';

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating.'),
  comment: z.string().min(10, 'Comment must be at least 10 characters.'),
});

export default function ProductReviews({ product }) {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: '' },
  });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/products/${product._id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to submit review.');

      toast.success('Review submitted successfully!');
      router.refresh(); // Refresh the page to show the new review
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Review Form Section */}
        <div>
          <Card>
            <CardHeader><CardTitle>Write a Review</CardTitle></CardHeader>
            <CardContent>
              {user ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField name="rating" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Rating</FormLabel>
                        <FormControl>
                          <StarRating
                            rating={field.value}
                            onRatingChange={field.onChange}
                            size={28}
                            isEditable={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField name="comment" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Comment</FormLabel>
                        <FormControl><Textarea placeholder="Tell us what you think..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </form>
                </Form>
              ) : (
                <p>Please <a href="/login" className="underline">log in</a> to write a review.</p>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Existing Reviews Section */}
        <div className="space-y-6">
          {product.reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            product.reviews.map((review) => (
              <div key={review._id} className="border-b pb-4">
                <div className="flex items-center mb-2">
                  <StarRating
                    rating={review.rating}
                    size={20}
                    isEditable={false}
                  />
                  <p className="ml-4 font-semibold">{review.name}</p>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                <p>{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}