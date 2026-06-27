'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getCartCount } from '@/lib/api';

export function Navbar() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setCartCount(getCartCount());
    const onCart = () => setCartCount(getCartCount());
    window.addEventListener('cartUpdated', onCart);
    window.addEventListener('storage', onCart);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('cartUpdated', onCart);
      window.removeEventListener('storage', onCart);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  const links = [
    { href: '/', label: 'Home' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/categories/bedsheets', label: 'Products' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="ql-nav" style={scrolled ? { boxShadow: '0 4px 20px oklch(0.3 0.06 50 / 0.08)' } : {}}>
      <div className="ql-nav-inner">
        <Link href="/" className="ql-nav-logo">
          <div className="ql-nav-logo-diamond">
            <div className="ql-nav-logo-diamond-inner" />
          </div>
          <span className="ql-nav-brand">QuickLoom</span>
        </Link>

        <div className="ql-nav-links">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`ql-nav-link ${pathname === l.href ? 'active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="ql-nav-actions">
          <span className="ql-nav-location">📍 Gurgaon · Bhiwadi</span>
          <Link href="/cart" className="ql-nav-cart">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>shopping_bag</span>
            Trial Cart
            {cartCount > 0 && <span className="ql-nav-cart-badge">{cartCount}</span>}
          </Link>
          <Link href="/categories/bedsheets" className="ql-nav-cta">
            Book Free Home Trial
          </Link>
        </div>
      </div>
    </nav>
  );
}
