'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="ql-footer">
      <div className="ql-footer-grid">
        <div className="ql-footer-col" style={{ gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 9,
              background: 'var(--accent)', transform: 'rotate(45deg)',
              display: 'grid', placeItems: 'center'
            }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: 'white' }} />
            </div>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 20, color: 'white'
            }}>QuickLoom</span>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.6, maxWidth: 320, textWrap: 'pretty' as any }}>
            Bringing the rich heritage of Indian handlooms to your doorstep with our unique try-at-home experience.
          </p>
        </div>

        <div className="ql-footer-col">
          <span className="ql-footer-col-label">Explore</span>
          <Link href="/" className="ql-footer-link">Home</Link>
          <Link href="/how-it-works" className="ql-footer-link">How It Works</Link>
          <Link href="/categories/bedsheets" className="ql-footer-link">Products</Link>
        </div>

        <div className="ql-footer-col">
          <span className="ql-footer-col-label">Policies</span>
          <Link href="/policies" className="ql-footer-link">Cancellation</Link>
          <Link href="/policies" className="ql-footer-link">Damage Policy</Link>
          <Link href="/policies" className="ql-footer-link">Trial Rules</Link>
        </div>

        <div className="ql-footer-col">
          <span className="ql-footer-col-label">Contact</span>
          <a href="mailto:Quicklooms@gmail.com" className="ql-footer-link">Quicklooms@gmail.com</a>
          <a href="tel:9315807233" className="ql-footer-link">+91 93158 07233</a>
          <a href="https://wa.me/919315807233" className="ql-footer-link">WhatsApp</a>
        </div>
      </div>

      <div className="ql-footer-bottom">
        <div className="ql-footer-bottom-inner">
          <span>© 2026 QuickLoom. See it. Feel it. Keep only what you love.</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            Serviced cities: Gurgaon & Bhiwadi
          </span>
        </div>
      </div>
    </footer>
  );
}
