'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { registerUser } from '@/lib/api';
import { signIn } from 'next-auth/react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function RegisterPage() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (values) => {
    try {
      // Call your backend to register the user
      await registerUser(values);

      // Automatically log in after registration
      const signInRes = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (!signInRes.ok) {
        // If auto-login fails, send them to the login page with an error.
        throw new Error(signInRes.error || "Registration succeeded, but auto-login failed. Please log in manually.");
      }

      toast.success('Registration successful! Welcome.');
      router.push('/');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="container flex items-center justify-center py-24">
      <Card className="w-full max-w-md">
        <CardHeader><CardTitle className="text-2xl">Create an Account</CardTitle></CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField name="name" control={form.control} render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="email" control={form.control} render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="password" control={form.control} render={({ field }) => (<FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? 'Creating Account...' : 'Register'}</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
