'use client';

import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function AdminDashboardPage() {
    const { data: session } = useSession();

    return (
        <div>
            <div className="flex flex-1 items-start justify-center rounded-lg border border-dashed shadow-sm p-8">
                <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">
                        Welcome to your Dashboard, {session?.user?.name}!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Manage your orders, products, and site content from here.
                    </p>
                </div>
            </div>

            {/* In the future, we will add stat cards here */}
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mt-8">
                <Card>
                    <CardHeader><CardTitle>Total Revenue</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold">₹0.00</p></CardContent>
                </Card>
                ... more cards ...
            </div>
        </div>
    );
}