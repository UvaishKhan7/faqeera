'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import ImageUploader from '@/components/admin/products/ImageUploader';

const variantSchema = z.object({
  size: z.string().min(1, 'Size is required.'),
  color: z.string().min(1, 'Color is required.'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative.'),
});

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  slug: z.string().min(2, 'Slug must be at least 2 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  price: z.coerce.number().positive('Price must be a positive number.'),
  category: z.enum(['Men', 'Women', 'Kids', 'Accessories']),
  images: z.array(z.string()).min(1, 'Please upload at least one image.'),
  variants: z.array(variantSchema).min(1, 'You must add at least one product variant.'),
});

export default function ProductForm({ onSubmit, product, isSubmitting }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || '',
      slug: product?.slug || '',
      description: product?.description || '',
      price: product?.price || 0,
      category: product?.category || 'Men',
      images: product?.image || [],
      variants: product?.variants?.length ? product.variants : [{ size: '', color: '', stock: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product ? 'Edit Product' : 'Create New Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField name="name" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl><Input placeholder="Classic T-Shirt" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="slug" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl><Input placeholder="classic-t-shirt" {...field} /></FormControl>
                <FormDescription>This is the URL-friendly version of the name.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="description" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl><Textarea placeholder="A high-quality, 100% cotton t-shirt..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FormField name="price" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="category" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Men">Men</SelectItem>
                      <SelectItem value="Women">Women</SelectItem>
                      <SelectItem value="Kids">Kids</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Images</FormLabel>
                  <FormControl>
                    <ImageUploader onChange={field.onChange} value={field.value} />
                  </FormControl>
                  <FormDescription>
                    Drag and drop or click to upload.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* --- NEW DYNAMIC VARIANTS SECTION --- */}
            <div>
              <CardTitle className="text-lg mb-4">Product Variants</CardTitle>
              <CardDescription className="mb-4">Add size, color, and stock information for each product variant.</CardDescription>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-7 gap-4 border p-4 rounded-md relative">
                    <FormField name={`variants.${index}.size`} control={form.control} render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Size</FormLabel>
                        <FormControl><Input placeholder="e.g., M, L, One Size" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField name={`variants.${index}.color`} control={form.control} render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Color</FormLabel>
                        <FormControl><Input placeholder="e.g., Blue, Black" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField name={`variants.${index}.stock`} control={form.control} render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Stock</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="col-span-1 flex items-end">
                      {/* Allow removing any variant except the very first one */}
                      {fields.length > 1 && (
                        <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => append({ size: '', color: '', stock: 0 })}
              >
                Add Another Variant
              </Button>
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}