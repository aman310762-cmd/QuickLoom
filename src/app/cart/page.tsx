'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCartProducts, removeFromCart, getCartCount } from '@/lib/api';
import { Product } from '@/lib/types';

export default function CartPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);

  const refresh = async () => {
    setProducts(await getCartProducts());
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
    <div style={{ paddingTop: 32, paddingBottom: 80 }}>
      <div className="container">
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(28px, 3.5vw, 40px)', letterSpacing: -1, marginBottom: 8 }}>Your Trial Basket</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 32 }}>
          Review your selection of artisanal handlooms to try at home.
        </p>

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '96px 0' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 64, color: 'var(--text-faint)', marginBottom: 16, display: 'block' }}>shopping_basket</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: 8 }}>Your trial basket is empty</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
              Browse our collections and add up to 10 items for a free home trial.
            </p>
            <Link href="/categories/bedsheets" className="btn btn-primary btn-lg">Browse Products</Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Cart Items */}
            <div>
              {/* Progress Bar */}
              <div className="cart-progress">
                <div className="cart-progress-header">
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>Trial Limit Progress</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent)' }}>
                    {cartCount} of 10 items selected
                  </span>
                </div>
                <div className="cart-progress-bar">
                  <div className="cart-progress-fill" style={{ width: `${(cartCount / 10) * 100}%` }} />
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  You can add {10 - cartCount} more items to your trial basket.
                </p>
              </div>

              {/* Items */}
              {products.map(product => (
                <div key={product.id} className="cart-item">
                  <div className="cart-item-image">
                    <div style={{
                      width: '100%', height: '100%',
                      background: 'var(--bg-alt)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--text-faint)' }}>image</span>
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
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Trial Choice</span>
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
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--accent)' }}>info</span>
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
              <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                No payment required now
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginTop: 'var(--space-lg)', paddingTop: 'var(--space-lg)', borderTop: '1px solid var(--bg-alt)' }}>
                <div style={{ textAlign: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--accent)', display: 'block', marginBottom: '0.25rem' }}>verified_user</span>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>Secure Trial</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--accent)', display: 'block', marginBottom: '0.25rem' }}>local_shipping</span>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>Free Pickup</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
