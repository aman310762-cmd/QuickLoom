'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCart, getCartProducts, removeFromCart, getCartCount } from '@/lib/data/store';
import { Product } from '@/lib/types';

export default function CartPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);

  const refresh = () => {
    setProducts(getCartProducts());
    setCartCount(getCartCount());
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
    window.dispatchEvent(new Event('cartUpdated'));
    refresh();
  };

  return (
    <div className="section" style={{ paddingTop: 'var(--space-xl)' }}>
      <div className="container">
        <h1 style={{ fontSize: '32px', marginBottom: '0.5rem' }}>Your Trial Basket</h1>
        <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '16px', marginBottom: 'var(--space-xl)' }}>
          Review your selection of artisanal handlooms to try at home.
        </p>

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-4xl) 0' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: 'var(--color-outline)', marginBottom: '1rem', display: 'block' }}>shopping_basket</span>
            <h2 style={{ marginBottom: '0.5rem' }}>Your trial basket is empty</h2>
            <p style={{ color: 'var(--color-on-surface-variant)', marginBottom: 'var(--space-lg)' }}>
              Browse our collections and add up to 10 items for a free home trial.
            </p>
            <Link href="/categories/bedsheets" className="btn btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Cart Items */}
            <div>
              {/* Progress Bar */}
              <div className="cart-progress">
                <div className="cart-progress-header">
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>Trial Limit Progress</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {cartCount} of 10 items selected
                  </span>
                </div>
                <div className="cart-progress-bar">
                  <div className="cart-progress-fill" style={{ width: `${(cartCount / 10) * 100}%` }} />
                </div>
                <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', marginTop: '0.5rem' }}>
                  You can add {10 - cartCount} more items to your trial basket.
                </p>
              </div>

              {/* Items */}
              {products.map(product => (
                <div key={product.id} className="cart-item">
                  <div className="cart-item-image">
                    <div style={{
                      width: '100%', height: '100%',
                      background: 'var(--color-surface-container)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--color-outline)' }}>image</span>
                    </div>
                  </div>
                  <div className="cart-item-info">
                    <div style={{ marginBottom: '0.25rem' }}>
                      <span className="material-badge">{product.material.split(',')[0].trim()}</span>
                    </div>
                    <Link href={`/products/${product.id}`}>
                      <h3 className="cart-item-name">{product.name}</h3>
                    </Link>
                    <div className="cart-item-price">₹{product.price.toLocaleString('en-IN')}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <button className="cart-item-remove" onClick={() => handleRemove(product.id)}>
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                    <span style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>Trial Choice</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Sidebar */}
            <div className="cart-summary">
              <h2>Trial Summary</h2>
              <div className="cart-summary-row">
                <span className="cart-summary-label">Total trial items</span>
                <span className="cart-summary-value">{cartCount}</span>
              </div>
              <div className="cart-summary-row">
                <span className="cart-summary-label">Trial Period</span>
                <span className="cart-summary-value highlight">48 Hours</span>
              </div>
              <div className="cart-summary-row">
                <span className="cart-summary-label">Trial Booking Fee</span>
                <span className="cart-summary-value highlight">₹0 (FREE)</span>
              </div>

              <div className="cart-summary-note">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-tertiary)' }}>info</span>
                  <div>
                    <h4>Pay only after trial</h4>
                    <p>Try these pieces in the comfort of your home. Only pay for what you decide to keep. No commitment required today.</p>
                  </div>
                </div>
              </div>

              <Link href="/book" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                Proceed to Book Your Trial Slot
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--color-on-surface-variant)', marginTop: '0.75rem' }}>
                No payment required now
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginTop: 'var(--space-lg)', paddingTop: 'var(--space-lg)', borderTop: '1px solid var(--color-surface-container-high)' }}>
                <div style={{ textAlign: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--color-tertiary)', display: 'block', marginBottom: '0.25rem' }}>verified_user</span>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-on-surface-variant)' }}>Secure Trial</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--color-tertiary)', display: 'block', marginBottom: '0.25rem' }}>local_shipping</span>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-on-surface-variant)' }}>Free Pickup</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
