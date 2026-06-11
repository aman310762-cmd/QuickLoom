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
    <div style={{ paddingTop: 32, paddingBottom: 80 }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="section-label">Reach out</span>
          <h1 className="section-title" style={{ marginTop: 12 }}>Get in Touch</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '12px auto 0', lineHeight: 1.6, fontSize: 17 }}>
            We&apos;d love to hear from you. Drop us a message or reach out directly.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 48 }}>
          {/* Contact Info */}
          <div>
            {[
              { icon: 'call', color: 'var(--accent)', title: 'Phone', content: <a href="tel:9315807233" style={{ color: 'var(--text-muted)', fontSize: 14 }}>+91 93158 07233</a> },
              { icon: 'mail', color: 'var(--accent)', title: 'Email', content: <a href="mailto:Quicklooms@gmail.com" style={{ color: 'var(--text-muted)', fontSize: 14 }}>Quicklooms@gmail.com</a> },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--accent-light)', display: 'grid', placeItems: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 22, color: item.color }}>{item.icon}</span>
                </span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{item.title}</div>
                  {item.content}
                </div>
              </div>
            ))}

            {/* WhatsApp */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: '#E8F5E9', display: 'grid', placeItems: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#25D366' }}>chat</span>
              </span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>WhatsApp</div>
                <a href="https://wa.me/919315807233" target="_blank" rel="noopener noreferrer" className="btn btn-sm" style={{ background: '#25D366', color: 'white', border: 'none' }}>
                  Chat with us on WhatsApp
                </a>
              </div>
            </div>

            {/* Serviced Areas */}
            <div style={{ marginTop: 32 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Serviced Areas</h3>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {['Gurgaon, Haryana', 'Bhiwadi, Rajasthan'].map(city => (
                  <span key={city} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 'var(--radius-full)', background: 'var(--success-bg)', fontSize: 13, fontWeight: 600, color: 'oklch(0.4 0.15 145)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--success)' }}>location_on</span>
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            {sent ? (
              <div className="ql-card" style={{ padding: 48, textAlign: 'center', border: '1px solid var(--border)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--success)', marginBottom: 16, display: 'block' }}>check_circle</span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: 8 }}>Message Sent!</h2>
                <p style={{ color: 'var(--text-muted)' }}>We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <div className="book-trial-form-card">
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, marginBottom: 24 }}>Send a Message</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input className="form-input" type="text" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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
                  <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
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
