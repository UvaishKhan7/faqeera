'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import SearchLogic from './SearchLogic';
import Image from 'next/image';

export default function SearchBox() {
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();

  const handleSuggestionClick = (product) => {
    setSuggestions([]); // Close suggestions on click
    router.push(`/product/${product.slug}`);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <Suspense fallback={<div className="h-10 bg-muted rounded-full animate-pulse"></div>}>
        <SearchLogic onSuggestionsChange={setSuggestions} />
      </Suspense>

      {suggestions.length > 0 && (
        <ul className="absolute z-50 w-full bg-background border rounded-md mt-1 shadow-lg max-h-80 overflow-y-auto">
          {suggestions.map((product) => (
            <li key={product._id}>
              <button
                onClick={() => handleSuggestionClick(product)}
                className="w-full text-left px-4 py-2 hover:bg-muted cursor-pointer flex items-center gap-4"
              >
                <Image src={product.images[0]} alt={product.name} width={40} height={40} className="rounded object-cover" />
                <span className="text-sm">{product.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}