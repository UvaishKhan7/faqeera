'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StarRating({
  count = 5,
  rating = 0,
  onRatingChange,
  size = 24,
  color = "text-yellow-400",
  hoverColor = "text-yellow-500",
  isEditable = true,
}) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index) => { if (isEditable) setHoverRating(index); };
  const handleMouseLeave = () => { if (isEditable) setHoverRating(0); };
  const handleClick = (index) => { if (isEditable && onRatingChange) onRatingChange(index); };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center space-x-1">
      {[...Array(count)].map((_, i) => {
        const starIndex = i + 1;
        return (
          <Star
            key={starIndex}
            className={cn(
              "transition-colors",
              isEditable && "cursor-pointer",
              starIndex <= displayRating ? `${color} ${isEditable ? hoverColor : ''}` : "text-gray-300",
            )}
            size={size}
            onMouseEnter={() => handleMouseEnter(starIndex)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(starIndex)}
            fill={starIndex <= displayRating ? 'currentColor' : 'none'}
          />
        );
      })}
    </div>
  );
}