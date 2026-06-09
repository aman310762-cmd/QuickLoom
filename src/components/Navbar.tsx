'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getCartCount } from '@/lib/data/store';

export function Navbar() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    const updateCount = () => setCartCount(getCartCount());
    updateCount();
    const interval = setInterval(updateCount, 500);
    window.addEventListener('cartUpdated', updateCount);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener('cartUpdated', updateCount);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (isAdmin) return null;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/categories/bedsheets', label: 'Products' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-inner">
          <div className="navbar-left">
            <Link href="/" className="navbar-logo">
              <span className="navbar-logo-text">QuickLoom</span>
            </Link>
            <ul className="navbar-links">
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`navbar-link ${isActive(link.href) ? 'active' : ''}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="navbar-right">
            <span className="navbar-location">Gurgaon / Bhiwadi</span>
            <Link href="/cart" className="navbar-icon-btn">
              <span className="material-symbols-outlined">shopping_basket</span>
              {cartCount > 0 && <span className="navbar-cart-count">{cartCount}</span>}
            </Link>
            <a
              href="https://wa.me/919315807233"
              target="_blank"
              rel="noopener noreferrer"
              className="navbar-icon-btn"
            >
              <span className="material-symbols-outlined">chat</span>
            </a>
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={() => setMobileOpen(false)} />
          <div className="mobile-menu">
            <div className="mobile-menu-header">
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-primary)' }}>
                QuickLoom
              </span>
              <button onClick={() => setMobileOpen(false)} style={{ fontSize: '1.5rem', color: 'var(--color-on-surface)' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <ul className="mobile-menu-links">
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} onClick={() => setMobileOpen(false)}>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/cart" onClick={() => setMobileOpen(false)}>
                  🛒 Trial Cart ({cartCount})
                </Link>
              </li>
              <li>
                <Link href="/policies" onClick={() => setMobileOpen(false)}>
                  Policies
                </Link>
              </li>
            </ul>
          </div>
        </>
      )}
    </>
  );
}
