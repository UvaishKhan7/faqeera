import HeroCarousel from "./HeroCarousel";

async function getActiveSlides() {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";
  try {
    const res = await fetch(`${API_BASE_URL}/api/content/hero-slides`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch hero slides:", error);
    return [];
  }
}

// This is our async Server Component. Its only job is to fetch data.
export default async function DynamicHeroSection() {
  const slides = await getActiveSlides();
  return <HeroCarousel slides={slides} />;
}
