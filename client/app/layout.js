import { Manrope } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Suspense } from 'react';
import SearchBox from '@/components/shop/SearchBox';

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

export const metadata = {
  title: 'Faqeera - Modern Fashion',
  description: 'Discover the latest trends in modern fashion.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} font-sans flex flex-col min-h-screen`}>
        <Header />
        <div className="container mx-auto px-4 pt-4">
            <Suspense fallback={<div className="h-10 bg-gray-200 rounded-md animate-pulse w-full max-w-sm mx-auto"></div>}>
                <SearchBox />
            </Suspense>
        </div>   
        <main className="flex-grow">{children}</main>
        <Footer />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}