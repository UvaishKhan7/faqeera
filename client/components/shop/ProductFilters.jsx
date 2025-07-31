'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // A memoized function to handle URL updates
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name); // Remove param if value is empty (e.g., 'All Categories')
      }
      return params.toString();
    },
    [searchParams]
  );
  
  const handleFilterChange = (filterName, filterValue) => {
    // If user selects "All", we pass an empty value to remove the param
    const value = filterValue === 'all' ? '' : filterValue;
    router.push(pathname + '?' + createQueryString(filterName, value));
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      {/* Category Filter */}
      <div className="flex-1">
        <label htmlFor="category" className="block text-sm font-medium text-muted-foreground mb-1">
          Category
        </label>
        <Select
          defaultValue={searchParams.get('category') || 'all'}
          onValueChange={(value) => handleFilterChange('category', value)}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Men">Men</SelectItem>
            <SelectItem value="Women">Women</SelectItem>
            <SelectItem value="Kids">Kids</SelectItem>
            <SelectItem value="Accessories">Accessories</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sorting Options */}
      <div className="flex-1">
        <label htmlFor="sort" className="block text-sm font-medium text-muted-foreground mb-1">
          Sort by
        </label>
        <Select
          defaultValue={searchParams.get('sortBy') || 'newest'}
          onValueChange={(value) => handleFilterChange('sortBy', value)}
        >
          <SelectTrigger id="sort">
            <SelectValue placeholder="Sort products" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}