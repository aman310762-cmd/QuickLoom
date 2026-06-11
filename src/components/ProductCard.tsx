'use client';

import Link from 'next/link';
import { Product } from '@/lib/types';
import { addToCart, isInCart, removeFromCart } from '@/lib/api';
import { useState, useEffect } from 'react';

export function ProductCard({ product }: { product: Product }) {
  const [inCart, setInCart] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    setInCart(isInCart(product.id));
  }, [product.id]);

  const handleToggleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart) {
      removeFromCart(product.id);
      setInCart(false);
      setToast('Removed from trial cart');
    } else {
      const result = addToCart(product.id);
      if (result.success) {
        setInCart(true);
        setToast('Added to trial cart!');
      } else {
        setToast(result.message);
      }
    }
    window.dispatchEvent(new Event('cartUpdated'));
    setTimeout(() => setToast(''), 2500);
  };

  const imgSrc = product.images?.[0] || '';

  return (
    <div className="product-card" style={{ position: 'relative' }}>
      <Link href={`/products/${product.id}`} style={{ display: 'flex', flexDirection: 'column', flex: 1, textDecoration: 'none', color: 'inherit' }}>
        <div className="product-card-image">
          {imgSrc ? (
            <img src={imgSrc} alt={product.name} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--text-faint)' }}>image</span>
            </div>
          )}
          {product.material && (
            <span className="product-card-badge">{product.material.split(',')[0].trim()}</span>
          )}
        </div>
        <div className="product-card-body">
          <div className="product-card-material">{product.category.replace('-', ' ')}</div>
          <div className="product-card-name">{product.name}</div>
          <div className="product-card-footer">
            <div>
              <span className="product-card-price">₹{product.price.toLocaleString('en-IN')}</span>
              {product.originalPrice > product.price && (
                <span className="product-card-original-price" style={{ marginLeft: 8 }}>
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
      <button
        className={`product-card-cart-btn ${inCart ? 'in-cart' : ''}`}
        onClick={handleToggleCart}
        title={inCart ? 'Remove from cart' : 'Add to trial cart'}
        style={{ position: 'absolute', bottom: 20, right: 20 }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
          {inCart ? 'check' : 'add'}
        </span>
      </button>

      {toast && (
        <div style={{
          position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--text)', color: 'var(--bg)',
          padding: '8px 16px', borderRadius: 'var(--radius-full)',
          fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
          boxShadow: 'var(--shadow-lg)', zIndex: 10,
          animation: 'fadeInUp 0.3s ease-out',
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}
