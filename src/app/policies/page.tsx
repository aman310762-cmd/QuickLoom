'use client';

export default function PoliciesPage() {
  const policies = [
    {
      icon: 'event_busy',
      title: 'Cancellation Policy',
      color: 'var(--color-primary)',
      items: [
        'Free cancellation before the trial delivery begins.',
        'If the agent is already en route, a ₹100 logistics fee may apply.',
        'Same-day rebooking is allowed subject to slot availability.',
      ],
    },
    {
      icon: 'broken_image',
      title: 'Damage Policy',
      color: 'var(--color-error)',
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
      color: 'var(--color-tertiary)',
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
      color: 'var(--color-success)',
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
      color: 'var(--color-primary)',
      items: [
        'Currently serving Gurgaon (Haryana) and Bhiwadi (Rajasthan).',
        'Same-day delivery for orders placed before 11:00 AM.',
        'Delivery is always FREE — no hidden charges.',
        'You\'ll receive a WhatsApp notification with live tracking.',
      ],
    },
  ];

  return (
    <div className="section" style={{ paddingTop: 'var(--space-xl)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
          <div className="hiw-subtitle">TRANSPARENCY</div>
          <h1 style={{ fontSize: '36px', marginBottom: '0.5rem' }}>Our Policies</h1>
          <p style={{ color: 'var(--color-on-surface-variant)', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto' }}>
            Clear, fair, and designed to make your experience worry-free. No hidden clauses.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
          {policies.map((policy, i) => (
            <div key={i} style={{
              background: 'var(--color-surface-container-lowest)',
              border: '1px solid var(--color-outline-variant)',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--space-xl)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: 'var(--radius-lg)',
                  background: `color-mix(in srgb, ${policy.color} 10%, transparent)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span className="material-symbols-outlined" style={{ color: policy.color, fontSize: '24px' }}>{policy.icon}</span>
                </div>
                <h2 style={{ fontSize: '22px' }}>{policy.title}</h2>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {policy.items.map((item, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '15px', color: 'var(--color-on-surface-variant)', lineHeight: 1.6 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-success)', flexShrink: 0, marginTop: '2px' }}>check_circle</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)', color: 'var(--color-on-surface-variant)', fontSize: '14px' }}>
          <p>Questions about our policies? <a href="/contact" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>Contact us</a></p>
        </div>
      </div>
    </div>
  );
}
