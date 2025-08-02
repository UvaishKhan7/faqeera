'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { getPublicProducts } from '@/lib/api';

let debounceTimeout;

export default function SearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialKeyword = searchParams.get('keyword') || '';
  const [keyword, setKeyword] = useState(initialKeyword);
  const [suggestions, setSuggestions] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/search?keyword=${keyword.trim()}`);
    } else {
      router.push('/');
    }
  };

  useEffect(() => {
  clearTimeout(debounceTimeout);

  const trimmedKeyword = keyword.trim();
  if (!trimmedKeyword) {
    setSuggestions([]); // clear instantly
    return;
  }

  debounceTimeout = setTimeout(async () => {
    try {
      const products = await getPublicProducts({ keyword: trimmedKeyword });
      setSuggestions(products.slice(0, 5));
    } catch (error) {
      console.error('Search suggestion error:', error);
      setSuggestions([]);
    }
  }, 300);
}, [keyword]);


  const handleSuggestionClick = (product) => {
    router.push(`/product/${product.slug}`);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
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

      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 shadow-md max-h-60 overflow-y-auto">
          {suggestions.map((product) => (
            <li
              key={product._id}
              onClick={() => handleSuggestionClick(product)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {product.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
