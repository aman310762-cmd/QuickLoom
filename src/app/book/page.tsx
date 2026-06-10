'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBooking, getCartCount, getCartProducts, getCartProductIds, clearCart } from '@/lib/api';
import { CITIES } from '@/lib/types';
import { Product } from '@/lib/types';

export default function BookTrialPage() {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [cartProducts, setCartProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    city: '',
    address: '',
    preferredSlot: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setCartCount(getCartCount());
    getCartProducts().then(prods => setCartProducts(prods.slice(0, 3)));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.customerName || !form.customerPhone || !form.city || !form.address || !form.preferredSlot) {
      setError('Please fill in all required fields');
      return;
    }
    if (cartCount === 0) {
      setError('Your trial cart is empty. Add items before booking.');
      return;
    }
    setLoading(true);
    const productIds = getCartProductIds();
    const result = await createBooking({ ...form, productIds });
    if (result) {
      clearCart();
      window.dispatchEvent(new Event('cartUpdated'));
      router.push('/');
      alert('🎉 Trial booked successfully! Our team will call you to confirm your slot.');
    } else {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const timeSlots = [
    { label: 'Morning', sub: '10 AM – 1 PM', icon: 'light_mode' },
    { label: 'Afternoon', sub: '1 PM – 4 PM', icon: 'wb_sunny' },
    { label: 'Evening', sub: '4 PM – 7 PM', icon: 'dark_mode' },
  ];

  return (
    <div className="section" style={{ paddingTop: 'var(--space-xl)' }}>
      <div className="container">
        <div className="book-trial-layout">
          {/* Form */}
          <div>
            <h1 style={{ fontSize: '36px', marginBottom: '0.5rem' }}>Schedule Your Home Trial</h1>
            <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '16px', marginBottom: 'var(--space-xl)', lineHeight: 1.6 }}>
              Experience the texture and artistry of our handloom collection in your own space before you decide.
            </p>

            <div className="book-trial-form-card">
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Enter your full name"
                      value={form.customerName}
                      onChange={e => setForm({ ...form, customerName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      className="form-input"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={form.customerPhone}
                      onChange={e => setForm({ ...form, customerPhone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <select
                      className="form-input form-select"
                      value={form.city}
                      onChange={e => setForm({ ...form, city: e.target.value })}
                      required
                    >
                      <option value="">Select City</option>
                      {CITIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Trial Address</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Flat, Street, Area"
                      value={form.address}
                      onChange={e => setForm({ ...form, address: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Time Slot</label>
                  <div className="time-slot-group">
                    {timeSlots.map(slot => (
                      <button
                        key={slot.label}
                        type="button"
                        className={`time-slot-btn ${form.preferredSlot === slot.label ? 'active' : ''}`}
                        onClick={() => setForm({ ...form, preferredSlot: slot.label })}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px', marginRight: '0.25rem' }}>{slot.icon}</span>
                        {slot.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Special Instructions (Optional)</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Tell us about your home decor style or any specific requests..."
                    value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                  />
                </div>

                {error && (
                  <div style={{
                    padding: '0.75rem',
                    background: 'var(--color-error-container)',
                    color: 'var(--color-on-error-container)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--space-md)',
                    fontSize: '14px',
                  }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                  disabled={loading}
                >
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                      Booking...
                    </span>
                  ) : (
                    <>
                      Book My Free Home Trial
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </>
                  )}
                </button>
                <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--color-on-surface-variant)', marginTop: '0.75rem' }}>
                  No payment required today. Trial duration: 30 minutes.
                </p>
              </form>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div>
            <div className="cart-summary" style={{ background: 'var(--color-tertiary-fixed)', borderColor: 'transparent' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="material-symbols-outlined">event_note</span>
                Trial Summary
              </h2>
              <div className="cart-summary-row">
                <span className="cart-summary-label">Selected Items</span>
                <span className="cart-summary-value">{String(cartCount).padStart(2, '0')} Pieces</span>
              </div>
              <div className="cart-summary-row">
                <span className="cart-summary-label">Selected City</span>
                <span className="cart-summary-value">{form.city || '—'}</span>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-md)',
                padding: '0.75rem', margin: 'var(--space-md) 0',
              }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--color-success)', fontSize: '20px' }}>check_circle</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-success)' }}>Same-day trial available</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>Order before 11 AM to see it today!</div>
                </div>
              </div>

              {/* Item previews */}
              {cartProducts.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', margin: 'var(--space-md) 0' }}>
                  {cartProducts.map(p => (
                    <div key={p.id} style={{
                      width: '64px', height: '64px', borderRadius: 'var(--radius-md)',
                      background: 'var(--color-surface-container)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', color: 'var(--color-outline)' }}>image</span>
                    </div>
                  ))}
                  {cartCount > 3 && (
                    <div style={{
                      width: '64px', height: '64px', borderRadius: 'var(--radius-md)',
                      background: 'var(--color-surface-container)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: '14px', fontWeight: 600, color: 'var(--color-on-surface-variant)',
                    }}>
                      +{cartCount - 3}
                    </div>
                  )}
                </div>
              )}

              <a href="/policies" style={{ color: 'var(--color-primary)', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                Read Trial Rules
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>open_in_new</span>
              </a>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
              <div style={{
                background: 'var(--color-surface-container-lowest)',
                border: '1px solid var(--color-outline-variant)',
                borderRadius: 'var(--radius-xl)', padding: 'var(--space-lg)',
                textAlign: 'center',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--color-primary)', display: 'block', marginBottom: '0.5rem' }}>verified</span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-on-surface-variant)' }}>100% Handloom Certified</span>
              </div>
              <div style={{
                background: 'var(--color-surface-container-lowest)',
                border: '1px solid var(--color-outline-variant)',
                borderRadius: 'var(--radius-xl)', padding: 'var(--space-lg)',
                textAlign: 'center',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--color-primary)', display: 'block', marginBottom: '0.5rem' }}>support_agent</span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-on-surface-variant)' }}>24/7 Expert Styling Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
