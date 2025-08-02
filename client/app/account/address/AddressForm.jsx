'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  addressLine1: z.string().min(5, "Address is required."),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State is required."),
  postalCode: z.string().min(6, "Valid postal code is required."),
  phoneNumber: z.string().min(10, "Valid phone number is required."),
  isDefault: z.boolean(),
});

export default function AddressForm({ onSubmit, initialData, isSubmitting }) {
  const form = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: initialData || {
      fullName: '', addressLine1: '', addressLine2: '', city: '', state: '',
      postalCode: '', country: 'India', phoneNumber: '', isDefault: false,
    },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField name="fullName" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField name="addressLine1" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField name="city" control={form.control} render={({ field }) => (
            <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField name="state" control={form.control} render={({ field }) => (
            <FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField name="postalCode" control={form.control} render={({ field }) => (
            <FormItem><FormLabel>Postal Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField name="phoneNumber" control={form.control} render={({ field }) => (
            <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField name="isDefault" control={form.control} render={({ field }) => (
            <FormItem className="flex items-center gap-2 pt-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Set as default shipping address</FormLabel></FormItem>
        )} />
        <div className="pt-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Saving...' : 'Save Address'}
            </Button>
        </div>
      </form>
    </Form>
  );
}