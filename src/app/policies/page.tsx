'use client';

export default function PoliciesPage() {
  const policies = [
    {
      icon: 'event_busy',
      title: 'Cancellation Policy',
      color: 'var(--accent)',
      items: [
        'Free cancellation before the trial delivery begins.',
        'If the agent is already en route, a ₹100 logistics fee may apply.',
        'Same-day rebooking is allowed subject to slot availability.',
      ],
    },
    {
      icon: 'broken_image',
      title: 'Damage Policy',
      color: 'oklch(0.5 0.18 25)',
      items: [
        'Minor wear and touch during trial is expected and covered.',
        'Significant damage (tears, stains, etc.) will be assessed fairly.',
        'Maximum charge: 80% of product MRP for irreparable damage.',
        'We document item condition before and after every trial.',
      ],
    },
    {
      icon: 'gavel',
      title: 'Trial Rules',
      color: 'var(--accent)',
      items: [
        'Maximum 10 items per trial session.',
        'Trial duration: 30 minutes with our expert.',
        'Payment only for kept items — via UPI or cash.',
        'Returns are collected immediately by our team.',
        'One trial per customer per day.',
      ],
    },
    {
      icon: 'assignment_return',
      title: 'Return & Refund',
      color: 'var(--success)',
      items: [
        'Items not selected during trial are returned on the spot.',
        'If you change your mind within 48 hours of purchase, contact us for an exchange.',
        'Refunds (if applicable) are processed within 5-7 business days.',
        'Refund mode: Original payment method or store credit.',
      ],
    },
    {
      icon: 'local_shipping',
      title: 'Delivery Policy',
      color: 'var(--accent)',
      items: [
        'Currently serving Gurgaon (Haryana) and Bhiwadi (Rajasthan).',
        'Same-day delivery for orders placed before 11:00 AM.',
        'Delivery is always FREE — no hidden charges.',
        'You\'ll receive a WhatsApp notification with live tracking.',
      ],
    },
  ];

  return (
    <div style={{ paddingTop: 32, paddingBottom: 80 }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="section-label">Transparency</span>
          <h1 className="section-title" style={{ marginTop: 12 }}>Our Policies</h1>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 500, margin: '12px auto 0', fontSize: 17 }}>
            Clear, fair, and designed to make your experience worry-free. No hidden clauses.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
          {policies.map((policy, i) => (
            <div key={i} className="ql-card" style={{ padding: 32, border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-md)',
                  background: 'var(--accent-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span className="material-symbols-outlined" style={{ color: policy.color, fontSize: 24 }}>{policy.icon}</span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22 }}>{policy.title}</h2>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {policy.items.map((item, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--success)', flexShrink: 0, marginTop: '2px' }}>check_circle</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)', color: 'var(--text-muted)', fontSize: '14px' }}>
          <p>Questions about our policies? <a href="/contact" style={{ color: 'var(--accent)', fontWeight: 500 }}>Contact us</a></p>
        </div>
      </div>
    </div>
  );
}
