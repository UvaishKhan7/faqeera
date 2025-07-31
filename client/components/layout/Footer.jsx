import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Twitter } from 'lucide-react';

const FooterLink = ({ href, children }) => (
  <Link href={href} className="text-muted-foreground hover:text-foreground transition-colors">
    {children}
  </Link>
);

export default function Footer() {
  return (
    <footer className="w-full bg-muted/40 border-t">
      <div className="w-full mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <div className="max-w-full lg:m-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">
          
          {/* Column 1: Brand & Mission */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image src="/faqeera.svg" width={120} height={50} alt="Faqeera Logo" />
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              Elegance in every thread. Discover curated collections that define your style with uncompromising quality.
            </p>
          </div>

          {/* Column 2: Shop */}
          <div className="lg:mx-auto">
            <h3 className="font-semibold text-foreground mb-4">Shop</h3>
            <div className="flex flex-col space-x-3 space-y-2">
              <FooterLink href="/#product-grid">New Arrivals</FooterLink>
              <FooterLink href="#">Men</FooterLink>
              <FooterLink href="#">Women</FooterLink>
              <FooterLink href="#">Accessories</FooterLink>
            </div>
          </div>

          {/* Column 3: About */}
          <div className="lg:mx-auto">
            <h3 className="font-semibold text-foreground mb-4">About Faqeera</h3>
            <div className="flex flex-col space-y-2">
              <FooterLink href="#">About Us</FooterLink>
              <FooterLink href="#">Contact</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
            </div>
          </div>

          {/* Column 4: Social Media */}
          <div className="lg:mx-auto">
            <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
            <div className="flex space-x-5">
              <FooterLink href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-6 w-6" />
              </FooterLink>
              <FooterLink href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-6 w-6" />
              </FooterLink>
              <FooterLink href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-6 w-6" />
              </FooterLink>
            </div>
          </div>

        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Faqeera. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}