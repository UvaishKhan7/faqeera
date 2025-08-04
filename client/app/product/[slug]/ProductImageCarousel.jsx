'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function ProductImageCarousel({ images, productName }) {
  // We need to keep the two carousels (main and thumbnails) in sync.
  // We'll use the 'api' object that Embla provides for this.
  const [mainApi, setMainApi] = useState();
  const [thumbnailApi, setThumbnailApi] = useState();
  const [selectedIndex, setSelectedIndex] = useState(0);

  // When the main carousel slides, update the selected thumbnail
  useEffect(() => {
    if (!mainApi) return;
    const onSelect = () => {
      setSelectedIndex(mainApi.selectedScrollSnap());
    };
    mainApi.on('select', onSelect);
    return () => mainApi.off('select', onSelect);
  }, [mainApi]);

  // When a thumbnail is clicked, scroll the main carousel to that image
  const onThumbClick = (index) => {
    if (!mainApi) return;
    mainApi.scrollTo(index);
  };
  
  // Update thumbnail carousel position when the main one changes
  useEffect(() => {
    if (!thumbnailApi) return;
    thumbnailApi.scrollTo(selectedIndex, true); // Instantly snap
  }, [selectedIndex, thumbnailApi]);


  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
        <p>No Image Available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Carousel */}
      <Carousel setApi={setMainApi} className="w-full">
        <CarouselContent>
          {images.map((img, index) => (
            <CarouselItem key={index} className="aspect-square">
              <div className="relative w-full h-full">
                <Image
                  src={img}
                  alt={`${productName} image ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="rounded-lg object-contain"
                  priority={index === 0} // Prioritize the first image
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
            <>
                <CarouselPrevious className="absolute left-4" />
                <CarouselNext className="absolute right-4" />
            </>
        )}
      </Carousel>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <Carousel setApi={setThumbnailApi} opts={{ slidesToScroll: 1, align: 'start' }} className="w-full">
          <CarouselContent className="m-auto">
            {images.map((img, index) => (
              <CarouselItem key={index} className="p-2 basis-1/4 sm:basis-1/5">
                <div 
                    onClick={() => onThumbClick(index)} 
                    className={`
                        aspect-square relative cursor-pointer rounded-md overflow-hidden 
                        ring-offset-background transition-shadow 
                        ${selectedIndex === index ? 'ring-2 ring-primary' : 'hover:ring-2 hover:ring-primary/50'}
                    `}
                >
                  <Image
                    src={img}
                    alt={`${productName} thumbnail ${index + 1}`}
                    fill
                    sizes="20vw"
                    className="object-contain"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </div>
  );
}