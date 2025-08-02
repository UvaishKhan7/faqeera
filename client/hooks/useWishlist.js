'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { getMyWishlist, toggleMyWishlist } from '@/lib/api';
import { useRouter } from 'next/navigation';

export function useWishlist() {
  const { data: session, status } = useSession();
  const token = session?.user?.backendToken;
  const router = useRouter();
  
  // We will store only the IDs for quick lookups
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    if (status === 'authenticated' && token) {
      setLoading(true);
      try {
        const items = await getMyWishlist(token);
        setWishlistIds(new Set(items.map(item => item._id)));
      } catch (error) {
        toast.error("Could not load your wishlist.");
      } finally {
        setLoading(false);
      }
    } else {
        setLoading(false);
        setWishlistIds(new Set());
    }
  }, [status, token]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleItem = async (productId) => {
    if (status !== 'authenticated' || !token) {
      toast.error("Please log in to manage your wishlist.");
      return;
    }
    const originalWishlist = new Set(wishlistIds);
    const isCurrentlyWishlisted = originalWishlist.has(productId);
    // Optimistic UI update: change the state immediately for a fast UX
    setWishlistIds(prevIds => {
        const newIds = new Set(prevIds);
        if (newIds.has(productId)) {
            newIds.delete(productId);
        } else {
            newIds.add(productId);
        }
        return newIds;
    });
    
    try {
      // Then, make the API call to sync the backend
      const updatedItems = await toggleMyWishlist({ productId, token });
      if (isCurrentlyWishlisted) {
        toast.warning("Removed from wishlist!"); // Use 'warning' for removal
      } else {
        toast.success("Added to wishlist!");   // Use 'success' for addition
      }
      setWishlistIds(new Set(updatedItems.map(item => item._id)));
    } catch (error) {
      toast.error("Failed to update wishlist.");
      // If the API call fails, we revert the optimistic update
      fetchWishlist();
    }
  };

  const isItemInWishlist = (productId) => {
    return wishlistIds.has(productId);
  };
  
  return {
    isItemInWishlist,
    toggleItem,
    isLoading: status === 'loading' || loading,
    wishlistItemCount: wishlistIds.size
  };
}