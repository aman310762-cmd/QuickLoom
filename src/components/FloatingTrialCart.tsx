'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getCartCount } from '@/lib/api';

export function FloatingTrialCart() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  const isAdmin = pathname?.startsWith('/admin');
  const isCart = pathname === '/cart';
  const isBook = pathname === '/book';

  useEffect(() => {
    const updateCount = () => setCartCount(getCartCount());
    updateCount();
    const interval = setInterval(updateCount, 500);
    window.addEventListener('cartUpdated', updateCount);
    return () => {
      clearInterval(interval);
      window.removeEventListener('cartUpdated', updateCount);
    };
  }, []);

  if (isAdmin || isCart || isBook) return null;

  return (
    <div className="floating-trial-cart">
      <Link href="/cart" className="floating-trial-cart-btn">
        <span className="material-symbols-outlined">shopping_basket</span>
        <span className="floating-trial-cart-label">{cartCount} of 10 items in Trial</span>
        <span className="floating-trial-cart-view">View</span>
      </Link>
    </div>
  );
}
