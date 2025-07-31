'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function SearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialKeyword = searchParams.get('keyword') || '';
  const [keyword, setKeyword] = useState(initialKeyword);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/search?keyword=${keyword.trim()}`);
    } else {
      router.push('/');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-sm">
      <Input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search products..."
        className="pl-10"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
    </form>
  );
}