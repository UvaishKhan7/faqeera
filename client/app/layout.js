import { Manrope } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer'; // <-- IMPORT THE FOOTER

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
        <main className="flex-grow">{children}</main>
        <Footer /> 
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}