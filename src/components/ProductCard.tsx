'use client';

import Link from 'next/link';
import { Product } from '@/lib/types';
import { addToCart, isInCart, removeFromCart } from '@/lib/api';
import { useState, useEffect } from 'react';

export function ProductCard({ product }: { product: Product }) {
  const [inCart, setInCart] = useState(false);
  const [toast, setToast] = useState('');
  const hasImage = product.images && product.images.length > 0 && product.images[0] && !product.images[0].includes('/images/products/bedsheet');

  useEffect(() => {
    setInCart(isInCart(product.id));
  }, [product.id]);

  const handleCart = (e: React.MouseEvent) => {
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
    setTimeout(() => setToast(''), 2000);
  };

  const materialLabel = product.material.split(',')[0].trim();

  return (
    <div className="product-card">
      <Link href={`/products/${product.id}`}>
        <div className="product-card-image">
          {hasImage ? (
            <img src={product.images[0]} alt={product.name} />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: `linear-gradient(135deg, var(--color-surface-container-high), var(--color-surface-container))`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: '0.5rem',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--color-outline)' }}>image</span>
              <span style={{ fontSize: '12px', color: 'var(--color-outline)' }}>No image</span>
            </div>
          )}
          <div className="product-card-material">
            <span className="material-badge">{materialLabel}</span>
          </div>
          {product.images && product.images.length > 1 && (
            <div style={{
              position: 'absolute', bottom: '0.5rem', right: '0.5rem',
              background: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: 'var(--radius-full)',
              padding: '2px 8px', fontSize: '11px', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: '3px',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>photo_library</span>
              {product.images.length}
            </div>
          )}
        </div>
      </Link>
      <div className="product-card-body">
        <Link href={`/products/${product.id}`}>
          <h3 className="product-card-name">{product.name}</h3>
        </Link>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span className="product-card-price">₹{product.price.toLocaleString('en-IN')}</span>
          {product.originalPrice > product.price && (
            <span className="product-card-original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          )}
        </div>
        <div className="product-card-sku">SKU: {product.sku}</div>
        <button
          className={`product-card-btn ${inCart ? 'in-cart' : ''}`}
          onClick={handleCart}
          disabled={product.status !== 'available' && !inCart}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            {inCart ? 'remove_shopping_cart' : 'add_shopping_cart'}
          </span>
          {inCart ? 'Remove from Cart' : 'Add to Trial Cart'}
        </button>
      </div>
      {toast && (
        <div style={{
          position: 'fixed', bottom: '5rem', left: '50%', transform: 'translateX(-50%)',
          background: 'var(--color-inverse-surface)', color: 'var(--color-inverse-on-surface)',
          padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-lg)', fontSize: '14px',
          fontWeight: 500, zIndex: 9999, boxShadow: 'var(--shadow-xl)', animation: 'fadeInUp 0.3s ease-out',
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}
