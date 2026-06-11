'use client';

import { useState } from 'react';
import Link from 'next/link';

const FAQ_DATA = [
  { q: 'How long is the home trial?', a: 'Each trial session lasts approximately 30 minutes. Our expert visits your home with your selected items, and you get to try everything in your actual rooms.' },
  { q: 'Is there any advance payment?', a: 'No, absolutely not. You pay nothing upfront. Payment is only made for items you decide to keep, after the trial.' },
  { q: 'What happens to items I don\'t want?', a: 'Our team picks them up right there during the trial visit. Zero hassle, zero extra cost for returns.' },
  { q: 'Can I exchange an item after the trial?', a: 'Yes, within 48 hours of your trial, you can request an exchange for the same value. Contact our support team for assistance.' },
  { q: 'Which areas do you serve?', a: 'Currently, we serve Gurgaon (Haryana) and Bhiwadi (Rajasthan) with same-day delivery slots.' },
  { q: 'How many items can I try?', a: 'You can add up to 10 items in your trial cart from any combination of categories.' },
];

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* Hero */}
      <section style={{ background: 'var(--bg-alt)', borderBottom: '1px solid var(--border)', padding: '80px 0 60px' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 720 }}>
          <span className="section-label">The trial experience</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(36px, 4.5vw, 56px)', letterSpacing: -1.5, marginTop: 14, lineHeight: 1.08 }}>
            <em style={{ color: 'var(--accent)' }}>Feel the weave, see the color, love the fit</em> — all in the comfort of your own home.
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text-muted)', marginTop: 20, lineHeight: 1.6 }}>
            Our unique try-at-home model lets you experience premium handloom textiles before committing.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section style={{ maxWidth: 1240, margin: '0 auto', padding: '80px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Step 1 */}
          <div className="ql-card" style={{ padding: 36, gridColumn: 'span 2', background: 'var(--bg-alt)', border: '1px solid var(--border)' }}>
            <span className="section-label" style={{ color: 'var(--accent)' }}>Step 01</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, marginTop: 8, marginBottom: 12 }}>Browse & Select Your Favorites</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 600 }}>
              Explore our curated collection of handloom textiles. Filter by category, color, size, and price. Add up to 10 items from any category to your trial cart — no commitment needed.
            </p>
            <Link href="/categories/bedsheets" className="btn btn-primary" style={{ marginTop: 24 }}>
              Start Browsing <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>

          {/* Step 2 */}
          <div className="ql-card" style={{ padding: 36, background: 'var(--accent-light)', border: '1px solid oklch(0.88 0.06 35)' }}>
            <span className="section-label" style={{ color: 'var(--accent)' }}>Step 02</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, marginTop: 8, marginBottom: 8 }}>Book a Free Home Trial</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>
              Choose a delivery time that suits you. Same-day slots available for orders placed before 11 AM.
            </p>
            <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--accent)', fontSize: 32 }}>event_available</span>
              <span style={{ fontWeight: 600, color: 'var(--accent)' }}>15+ daily slots</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="ql-card" style={{ padding: 36, background: 'var(--success-bg)', border: '1px solid oklch(0.88 0.06 145)' }}>
            <span className="section-label" style={{ color: 'oklch(0.4 0.15 145)' }}>Step 03</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, marginTop: 8, marginBottom: 8 }}>Expert Home Trial</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>
              Our textile expert arrives with your selected items for a 30-minute private session. Try pieces in your actual rooms.
            </p>
            <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--success)', fontSize: 32 }}>house</span>
              <span style={{ fontWeight: 600, color: 'oklch(0.4 0.15 145)' }}>30-min session</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="ql-card" style={{ padding: 36, background: 'var(--bg-alt)', border: '1px solid var(--border)' }}>
            <span className="section-label" style={{ color: 'var(--accent)' }}>Step 04</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, marginTop: 8, marginBottom: 12 }}>Pay Only For What You Love</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
              After trying everything, decide what stays. Pay by UPI or cash — only for items you keep. We collect the rest right there.
            </p>
            <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--success)' }}>check_circle</span>
                <span style={{ fontWeight: 500, fontSize: 14 }}>UPI / Cash accepted</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--success)' }}>check_circle</span>
                <span style={{ fontWeight: 500, fontSize: 14 }}>Free returns</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="ql-card" style={{ padding: 36, background: 'var(--accent)', color: 'white', border: 'none' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: 'white', marginBottom: 12 }}>Ready to try?</h3>
            <p style={{ opacity: 0.9, fontSize: 14, lineHeight: 1.6 }}>
              Start your free home trial today. No payment required upfront.
            </p>
            <Link href="/categories/bedsheets" className="btn" style={{ marginTop: 24, background: 'white', color: 'var(--accent)', border: 'none' }}>
              Browse Collection
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: 'var(--bg-alt)', borderTop: '1px solid var(--border)', padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="section-label">FAQs</span>
            <h2 className="section-title" style={{ marginTop: 12 }}>Transparency First</h2>
            <p style={{ fontSize: 17, color: 'var(--text-muted)', marginTop: 8 }}>Straightforward answers and clear policies for a worry-free trial experience.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 48 }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, marginBottom: 20 }}>Frequently Asked Questions</h3>
              {FAQ_DATA.map((item, i) => (
                <div key={i} style={{ borderBottom: '1px solid var(--border)', marginBottom: 0 }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: '100%', padding: '18px 0', background: 'none', border: 'none',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      fontSize: 15, fontWeight: 600, color: 'var(--text)', cursor: 'pointer',
                      fontFamily: 'var(--font-body)', textAlign: 'left',
                    }}
                  >
                    {item.q}
                    <span className="material-symbols-outlined" style={{ fontSize: 20, transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)' }}>
                      expand_more
                    </span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: '0 0 18px', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{item.a}</div>
                  )}
                </div>
              ))}
            </div>

            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, marginBottom: 20 }}>Quick Policies</h3>
              {[
                { label: 'Cancellation', text: 'Free cancellation before the trial delivery. No charges applied.' },
                { label: 'Damage Policy', text: 'Minor wear during trial is expected. Significant damage may be charged at fair value.' },
                { label: 'Trial Duration', text: 'Each trial session lasts 30 minutes. You can book another session if needed.' },
              ].map((p, i) => (
                <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 20, marginBottom: 12 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--accent-text)', marginBottom: 6 }}>{p.label}</div>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{p.text}</p>
                </div>
              ))}
              <Link href="/policies" style={{ color: 'var(--accent)', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4, marginTop: 12 }}>
                Read Full Policies <span className="material-symbols-outlined" style={{ fontSize: 16 }}>open_in_new</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
