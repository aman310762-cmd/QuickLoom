'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getCartCount } from '@/lib/api';

export function FloatingTrialCart() {
  const pathname = usePathname();
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(getCartCount());
    const onCart = () => setCount(getCartCount());
    window.addEventListener('cartUpdated', onCart);
    window.addEventListener('storage', onCart);
    return () => {
      window.removeEventListener('cartUpdated', onCart);
      window.removeEventListener('storage', onCart);
    };
  }, []);

  if (pathname?.startsWith('/admin') || pathname === '/cart' || count === 0) return null;

  return (
    <div className="floating-cart">
      <Link href="/cart" className="floating-cart-btn">
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>shopping_bag</span>
        View Trial Cart
        <span className="floating-cart-badge">{count}</span>
      </Link>
    </div>
  );
}
