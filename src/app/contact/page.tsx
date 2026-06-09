'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="section" style={{ paddingTop: 'var(--space-xl)' }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
          <div className="hiw-subtitle">REACH OUT</div>
          <h1 style={{ fontSize: '36px', marginBottom: '0.5rem' }}>Get in Touch</h1>
          <p style={{ color: 'var(--color-on-surface-variant)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
            We&apos;d love to hear from you. Drop us a message or reach out directly.
          </p>
        </div>

        <div className="contact-grid">
          {/* Contact Info */}
          <div>
            <div className="contact-info-item">
              <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--color-primary)' }}>call</span>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '0.125rem' }}>Phone</div>
                <a href="tel:9315807233" style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px' }}>+91 93158 07233</a>
              </div>
            </div>
            <div className="contact-info-item">
              <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--color-primary)' }}>mail</span>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '0.125rem' }}>Email</div>
                <a href="mailto:Quicklooms@gmail.com" style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px' }}>Quicklooms@gmail.com</a>
              </div>
            </div>
            <div className="contact-info-item">
              <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#25D366' }}>chat</span>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '0.125rem' }}>WhatsApp</div>
                <a href="https://wa.me/919315807233" target="_blank" rel="noopener noreferrer" className="btn btn-sm" style={{ background: '#25D366', color: 'white', marginTop: '0.375rem' }}>
                  Chat with us on WhatsApp
                </a>
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-xl)' }}>
              <h3 style={{ fontSize: '16px', marginBottom: 'var(--space-md)' }}>Serviced Areas</h3>
              <div className="serviced-areas">
                <div className="city-chip">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-success)' }}>location_on</span>
                  Gurgaon, Haryana
                </div>
                <div className="city-chip">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-success)' }}>location_on</span>
                  Bhiwadi, Rajasthan
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            {sent ? (
              <div style={{
                background: 'var(--color-surface-container-lowest)',
                border: '1px solid var(--color-outline-variant)',
                borderRadius: 'var(--radius-2xl)', padding: 'var(--space-2xl)',
                textAlign: 'center',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--color-success)', marginBottom: '1rem', display: 'block' }}>check_circle</span>
                <h2 style={{ marginBottom: '0.5rem' }}>Message Sent!</h2>
                <p style={{ color: 'var(--color-on-surface-variant)' }}>We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <div style={{
                background: 'var(--color-surface-container-lowest)',
                border: '1px solid var(--color-outline-variant)',
                borderRadius: 'var(--radius-2xl)', padding: 'var(--space-2xl)',
              }}>
                <h3 style={{ fontSize: '20px', marginBottom: 'var(--space-lg)' }}>Send a Message</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input className="form-input" type="text" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input className="form-input" type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea className="form-input form-textarea" placeholder="How can we help you?" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    Send Message <span className="material-symbols-outlined">send</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
