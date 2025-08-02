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
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values) => {
    const res = await signIn('credentials', {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (res.ok) {
      toast.success('Login successful! Welcome back.');
      router.push(callbackUrl);
    } else {
      toast.error(res.error || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="container flex items-center justify-center py-24">
      <Card className="w-full max-w-md">
        <CardHeader><CardTitle className="text-2xl">Welcome Back</CardTitle></CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField name="email" control={form.control} render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="password" control={form.control} render={({ field }) => (<FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? 'Signing In...' : 'Sign In'}</Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don't have an account? <Link href="/register" className="underline">Sign up</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}