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
      <div className="hiw-hero">
        <div className="container">
          <div className="hiw-subtitle">THE TRIAL EXPERIENCE</div>
          <h1>
            <em>Feel the weave, see the color, love the fit</em> — all in the comfort of your own home.
          </h1>
          <p>Our unique try-at-home model lets you experience premium handloom textiles before committing.</p>
        </div>
      </div>

      {/* Steps Bento Grid */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="hiw-bento-grid">
            {/* Step 1 — Large */}
            <div className="hiw-bento-card large" style={{ background: 'var(--color-surface-container-low)' }}>
              <div className="hiw-bento-content">
                <div className="hiw-step-label" style={{ color: 'var(--color-primary)' }}>STEP 01</div>
                <h3 style={{ fontSize: '24px', marginBottom: '0.75rem' }}>Browse & Select Your Favorites</h3>
                <p style={{ color: 'var(--color-on-surface-variant)', lineHeight: 1.6 }}>
                  Explore our curated collection of handloom textiles. Filter by category, color, size, and price. Add up to 10 items from any category to your trial cart — no commitment needed.
                </p>
                <Link href="/categories/bedsheets" className="btn btn-primary" style={{ marginTop: 'var(--space-lg)' }}>
                  Start Browsing <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Step 2 */}
            <div className="hiw-bento-card" style={{ background: 'var(--color-primary-fixed)' }}>
              <div className="hiw-bento-content">
                <div className="hiw-step-label" style={{ color: 'var(--color-primary)' }}>STEP 02</div>
                <h3 style={{ fontSize: '20px', marginBottom: '0.5rem' }}>Book a Free Home Trial</h3>
                <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px', lineHeight: 1.6 }}>
                  Choose a delivery time that suits you. Same-day slots available for orders placed before 11 AM.
                </p>
                <div style={{ marginTop: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: '32px' }}>event_available</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>15+ daily slots</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="hiw-bento-card" style={{ background: 'var(--color-tertiary-fixed)' }}>
              <div className="hiw-bento-content">
                <div className="hiw-step-label" style={{ color: 'var(--color-tertiary)' }}>STEP 03</div>
                <h3 style={{ fontSize: '20px', marginBottom: '0.5rem' }}>Expert Home Trial</h3>
                <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px', lineHeight: 1.6 }}>
                  Our textile expert arrives with your selected items for a 30-minute private session. Try pieces in your actual rooms.
                </p>
                <div style={{ marginTop: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--color-tertiary)', fontSize: '32px' }}>house</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-tertiary)' }}>30-min session</span>
                </div>
              </div>
            </div>

            {/* Step 4 — Large */}
            <div className="hiw-bento-card large" style={{ background: 'var(--color-surface-container-low)' }}>
              <div className="hiw-bento-content">
                <div className="hiw-step-label" style={{ color: 'var(--color-primary)' }}>STEP 04</div>
                <h3 style={{ fontSize: '24px', marginBottom: '0.75rem' }}>Pay Only For What You Love</h3>
                <p style={{ color: 'var(--color-on-surface-variant)', lineHeight: 1.6 }}>
                  After trying everything, decide what stays. Pay by UPI or cash — only for items you keep. We collect the rest right there. Zero pressure, zero return hassle.
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-xl)', marginTop: 'var(--space-lg)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--color-success)' }}>check_circle</span>
                    <span style={{ fontWeight: 500, fontSize: '14px' }}>UPI / Cash accepted</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--color-success)' }}>check_circle</span>
                    <span style={{ fontWeight: 500, fontSize: '14px' }}>Free returns</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 side */}
            <div className="hiw-bento-card" style={{ background: 'var(--color-primary)', color: 'white' }}>
              <div className="hiw-bento-content">
                <h3 style={{ fontSize: '24px', color: 'white', marginBottom: '0.75rem' }}>Ready to try?</h3>
                <p style={{ opacity: 0.9, fontSize: '14px', lineHeight: 1.6 }}>
                  Start your free home trial today. No payment required upfront.
                </p>
                <Link href="/categories/bedsheets" className="btn" style={{ marginTop: 'var(--space-lg)', background: 'white', color: 'var(--color-primary)' }}>
                  Browse Collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ + Policies */}
      <section className="section" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
            <h2 className="section-title">Transparency First</h2>
            <p className="section-subtitle">Straightforward answers and clear policies for a worry-free trial experience.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'var(--space-2xl)' }}>
            {/* FAQ */}
            <div>
              <h3 style={{ fontSize: '20px', marginBottom: 'var(--space-lg)' }}>Frequently Asked Questions</h3>
              {FAQ_DATA.map((item, i) => (
                <div key={i} className="faq-item">
                  <button
                    className="faq-question"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    {item.q}
                    <span className="material-symbols-outlined" style={{ fontSize: '20px', transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)' }}>
                      expand_more
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="faq-answer">{item.a}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Policies */}
            <div>
              <h3 style={{ fontSize: '20px', marginBottom: 'var(--space-lg)' }}>Quick Policies</h3>
              <div className="policy-card">
                <div className="policy-card-label">Cancellation</div>
                <p>Free cancellation before the trial delivery. No charges applied.</p>
              </div>
              <div className="policy-card">
                <div className="policy-card-label">Damage Policy</div>
                <p>Minor wear during trial is expected. Significant damage may be charged at fair value.</p>
              </div>
              <div className="policy-card">
                <div className="policy-card-label">Trial Duration</div>
                <p>Each trial session lasts 30 minutes. You can book another session if needed.</p>
              </div>
              <Link href="/policies" style={{ color: 'var(--color-primary)', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: 'var(--space-md)' }}>
                Read Full Policies <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>open_in_new</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
