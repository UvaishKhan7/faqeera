'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  const handleScroll = () => {
    const productSection = document.getElementById('product-grid');
    if (productSection) {
      productSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 }
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    },
  };

  return (
    <section className="relative h-[85vh] min-h-[500px] flex items-center justify-center text-white text-center">
      {/* Background Image */}
      <Image
        src="/hero-banner.jpg" // Directly referencing the image in /public
        alt="Model wearing Faqeera brand clothing"
        fill
        className="object-cover object-top -z-10"
        priority // Helps load the most important image first
      />
      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 bg-black/50 -z-10" />

      {/* Animated Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container px-4 z-10"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
        >
          Elegance in Every Thread
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="mt-6 max-w-xl mx-auto text-lg md:text-xl text-gray-200"
        >
          Discover curated collections that define your style. Uncompromising quality, delivered.
        </motion.p>
        <motion.div variants={itemVariants} className="mt-10">
          <Button size="lg" onClick={handleScroll}>
            Shop New Arrivals
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}