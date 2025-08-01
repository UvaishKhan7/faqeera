import HeroCarousel from './HeroCarousel'; // <-- Import our new Client Component

// This is still our data-fetching function.
async function getActiveSlides() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
  try {
    const res = await fetch(`${API_BASE_URL}/api/content/hero-slides`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Failed to fetch hero slides:', error);
    return [];
  }
}

// This is our async Server Component. Its only job is to fetch data.
export default async function DynamicHeroSection() {
  const slides = await getActiveSlides();

  // It then passes the simple, serializable 'slides' array
  // as a prop to the Client Component.
  return <HeroCarousel slides={slides} />;
}