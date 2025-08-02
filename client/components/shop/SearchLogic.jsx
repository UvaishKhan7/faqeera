'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getPublicProducts } from '@/lib/api';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';

// This is a "headless" component. It handles all the logic.
export default function SearchLogic({ onSuggestionsChange }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialKeyword = searchParams.get('keyword') || '';
  const [keyword, setKeyword] = useState(initialKeyword);

  useEffect(() => {
    const debounceTimeout = setTimeout(async () => {
      const trimmedKeyword = keyword.trim();
      if (trimmedKeyword) {
        const { products } = await getPublicProducts({ keyword: trimmedKeyword });
        onSuggestionsChange(products.slice(0, 5));
      } else {
        onSuggestionsChange([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [keyword, onSuggestionsChange]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSuggestionsChange([]); // Close suggestions on submit
      router.push(`/search?keyword=${keyword.trim()}`);
    } else {
      router.push('/');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 max-w-md mx-4 items-center bg-muted px-3 py-1.5 rounded-full border focus-within:ring-2 focus-within:ring-gray-300">
      <Search className="w-8 h-8 text-muted-foreground" />
      <Input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search products..."
        className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
      />
    </form>
  );
}