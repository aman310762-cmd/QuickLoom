'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="footer-brand-name">QuickLoom</span>
            <p>
              Bringing the rich heritage of Indian handlooms to your doorstep with our unique try-at-home experience.
            </p>
          </div>

          <div>
            <h5 className="footer-heading">Explore</h5>
            <ul className="footer-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/how-it-works">How It Works</Link></li>
              <li><Link href="/categories/bedsheets">Products</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="footer-heading">Policies</h5>
            <ul className="footer-links">
              <li><Link href="/policies">Cancellation</Link></li>
              <li><Link href="/policies">Damage Policy</Link></li>
              <li><Link href="/policies">Trial Rules</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="footer-heading">Contact</h5>
            <ul className="footer-links">
              <li><a href="mailto:Quicklooms@gmail.com">Quicklooms@gmail.com</a></li>
              <li><a href="tel:9315807233">+91 93158 07233</a></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} QuickLoom. See it. Feel it. Keep only what you love. Serviced Cities: Gurgaon & Bhiwadi.</p>
        </div>
      </div>
    </footer>
  );
}
