'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { getMyWishlist } from '@/lib/api';

import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard'; // <-- IMPORT THE PRODUCT CARD

export default function WishlistPage() {
    const { data: session, status } = useSession();
    const token = session?.user?.backendToken;
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'authenticated' && token) {
            const fetchWishlist = async () => {
                setLoading(true);
                try {
                    const data = await getMyWishlist(token);
                    setWishlistItems(data || []);
                } catch (error) {
                    toast.error(error.message || "Failed to load wishlist.");
                } finally {
                    setLoading(false);
                }
            };
            fetchWishlist();
        } else if (status === 'unauthenticated') {
            setLoading(false);
        }
    }, [status, token]);

    if (status === 'loading' || loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">My Wishlist</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[450px] rounded-lg" />)}
                </div>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">My Wishlist</h1>
            
            {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlistItems.map((product, index) => (
                        <ProductCard 
                            key={product._id}
                            product={product}
                            index={index} // Pass index for the staggered animation
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 px-6 border-2 border-dashed rounded-lg flex flex-col items-center">
                    <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold">Your Wishlist is Empty</h3>
                    <p className="text-sm text-muted-foreground mt-2 mb-6">
                        Start exploring and save your favorites for later!
                    </p>
                    <Button asChild>
                        <Link href="/">Explore Our Collection</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}