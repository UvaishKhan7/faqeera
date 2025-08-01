'use client'; // <-- This is the crucial "Client Boundary"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// This is now a CLIENT component. It receives the 'slides' data as a simple prop.
export default function HeroCarousel({ slides }) {
  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full h-[85vh] min-h-[500px]">
      <Carousel
        className="w-full h-full flex items-center justify-center"
        // It is now safe to use the plugin here, inside a Client Component.
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: true,
          }),
        ]}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent className="h-[85vh]">
          {slides.map((slide) => (
            <CarouselItem key={slide._id} className="h-full">
              <div className="relative w-full h-full text-white text-center flex items-center justify-center">
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  fill
                  className="object-cover object-center -z-10 brightness-50"
                  priority
                />
                <div className="container px-4 z-10 flex flex-col items-center">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                    {slide.title}
                  </h1>
                  <p className="mt-6 max-w-xl mx-auto text-lg md:text-xl text-gray-200">
                    {slide.description}
                  </p>
                  <div className="mt-10">
                    <Button asChild size="lg">
                      <Link href={slide.linkUrl}>{slide.buttonText}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 md:left-8" />
        <CarouselNext className="absolute right-4 md:right-8" />
      </Carousel>
    </section>
  );
}