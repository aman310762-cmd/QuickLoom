'use client';

import Link from 'next/link';
import { CATEGORIES } from '@/lib/types';
import { getVisibleProducts } from '@/lib/data/store';
import { useEffect, useState } from 'react';

const CATEGORY_IMAGES: Record<string, string> = {
  'bedsheets': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvM25Lo1--uf1A_RVSXtQO0mZJ8irjdxNt7z5xqJaG3wf7SOT7moWJR4NKzxJQsVd2d3uh6AY1N6L1echYt2-__bUGkGdAcOiaooOEqZcI_mwZbGBbbVAvPgJmJfuZSzeEeFUsKdfiF5C2nme-wBVSDS9dyyIvhLWSWlYQAUJQykF-LlbOS5tn5LUGp0Xc3CundgyMCA4BE8neGbWMIXt_68fjfKCjsHVIBz9Uu2Xz4JtLECDgwaHRGO4y_h2OPZ0DRRHrAGnIwwY',
  'curtains': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDm2j0Wi7z862l6kFmWO4b7vUe6Dr6WGkYnBCqUAK8O7NnS16vGeuH8OH2F6ml-Q8zIBzQMo0OEXjQNu1u9z2IAS_j1aVgv0gFGyWf8HoIWnYUfeYu5UDzYymRmzp0dGvz2hRvCi3emzAQHUoNdSQWsuQZQrh8LiBXDoPnvna6hAs9pDoIrATt8kBk4nMFrBHSdIMzrn0IMKVSsXE6xjfUjWemN56ZIDmbuYUHgW_M3izLGd0wGXqEgTLMFCVeNrGgd0tNcTJqkHcM',
  'carpets': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBH8Y4W9xp5ssbgnM0WU3FZB5yS4SvDvf5qVcYIkiLaKSSG4WlerRnZawlwCHo9ZQCCqzxTq8N-wswOPuvmwCnzxWtMvBLAoAl0zTKhm1v7EveOfX3h1Ii8oCfBuleCjsvKTD9NgPmsEJ5x37QQUsKquojzSUr57-HvfIi30-2ZhZNFOKaz6j_Y0aBr40LsmhYaE0l5o3JarSI-6B_OVfFXAa5sEWCOHS0sL75MQEMmOItoZ5JFdRdT4P1b98ZvBlEurmWkN9LHltM',
  'rugs': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAscgDbXx7ty8rpUjt2H1efEaZeuzYwAKt-Jv75KaJkSu9v7aO3Nk3PkZTkH-jjQZZzuq3AO-qrRiB3oAG2oPA2unt7Hh_pwCcPshY3U5xRExyGSoN_GsyDi2Tzyo0remOQzfMBWDOXFBVEi_Azv4uov34k7BUCfsYdMcYi5fQiyVtZdx9MnHXbLXLqwl306KtGXMvOyY64g18dv3n3Rw7DXjftRuy7XwfSvCFT2h_D0kgFGg4YCYfo79TQ1541XxIqiCDUua4LhEo',
  'towels': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKASX2hjBjDAIfS4Uggp-lpxeS7YrRknmDPS3N0aF5PMvfMVFFaz7n6FUxMf6eJ5i-97pYdcPRaoUrWf7_ytVbCLvJzWeydAf6q3eCxGKT5mGzWlcMPLmmBwvQHCM-n-1X8eScjUNtXGAflbM6SSy3wjAJ0ZpAAexQU7nYRm7CiNznkAt7g1jGMKhHk19SgWghrTpVUFhdHguMX88kLjqMsZv1CpAaYMlhiwzx1kB0qfdtVShRFipMFKIFpLJbwOURIFSfZRyCptc',
  'sofa-covers': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvM25Lo1--uf1A_RVSXtQO0mZJ8irjdxNt7z5xqJaG3wf7SOT7moWJR4NKzxJQsVd2d3uh6AY1N6L1echYt2-__bUGkGdAcOiaooOEqZcI_mwZbGBbbVAvPgJmJfuZSzeEeFUsKdfiF5C2nme-wBVSDS9dyyIvhLWSWlYQAUJQykF-LlbOS5tn5LUGp0Xc3CundgyMCA4BE8neGbWMIXt_68fjfKCjsHVIBz9Uu2Xz4JtLECDgwaHRGO4y_h2OPZ0DRRHrAGnIwwY',
  'blankets': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDm2j0Wi7z862l6kFmWO4b7vUe6Dr6WGkYnBCqUAK8O7NnS16vGeuH8OH2F6ml-Q8zIBzQMo0OEXjQNu1u9z2IAS_j1aVgv0gFGyWf8HoIWnYUfeYu5UDzYymRmzp0dGvz2hRvCi3emzAQHUoNdSQWsuQZQrh8LiBXDoPnvna6hAs9pDoIrATt8kBk4nMFrBHSdIMzrn0IMKVSsXE6xjfUjWemN56ZIDmbuYUHgW_M3izLGd0wGXqEgTLMFCVeNrGgd0tNcTJqkHcM',
  'mats': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBH8Y4W9xp5ssbgnM0WU3FZB5yS4SvDvf5qVcYIkiLaKSSG4WlerRnZawlwCHo9ZQCCqzxTq8N-wswOPuvmwCnzxWtMvBLAoAl0zTKhm1v7EveOfX3h1Ii8oCfBuleCjsvKTD9NgPmsEJ5x37QQUsKquojzSUr57-HvfIi30-2ZhZNFOKaz6j_Y0aBr40LsmhYaE0l5o3JarSI-6B_OVfFXAa5sEWCOHS0sL75MQEMmOItoZ5JFdRdT4P1b98ZvBlEurmWkN9LHltM',
  'dining-covers': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAscgDbXx7ty8rpUjt2H1efEaZeuzYwAKt-Jv75KaJkSu9v7aO3Nk3PkZTkH-jjQZZzuq3AO-qrRiB3oAG2oPA2unt7Hh_pwCcPshY3U5xRExyGSoN_GsyDi2Tzyo0remOQzfMBWDOXFBVEi_Azv4uov34k7BUCfsYdMcYi5fQiyVtZdx9MnHXbLXLqwl306KtGXMvOyY64g18dv3n3Rw7DXjftRuy7XwfSvCFT2h_D0kgFGg4YCYfo79TQ1541XxIqiCDUua4LhEo',
};

const CATEGORY_BADGES: Record<string, string> = {
  'bedsheets': '100% Cotton',
  'curtains': 'Hand-Woven',
  'carpets': 'Artisan Made',
  'rugs': 'Handloom',
  'towels': 'Organic',
  'sofa-covers': 'Premium',
  'blankets': 'Cozy Warm',
  'mats': 'Anti-Slip',
  'dining-covers': 'Heritage',
};

const CATEGORY_PRICES: Record<string, string> = {
  'bedsheets': 'From ₹1,899',
  'curtains': 'From ₹1,599',
  'carpets': 'From ₹3,999',
  'rugs': 'From ₹1,899',
  'towels': 'From ₹899',
  'sofa-covers': 'From ₹899',
  'blankets': 'From ₹1,299',
  'mats': 'From ₹599',
  'dining-covers': 'From ₹699',
};

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    setMounted(true);
    const products = getVisibleProducts();
    const counts: Record<string, number> = {};
    CATEGORIES.forEach(cat => {
      counts[cat.slug] = products.filter(p => p.category === cat.slug).length;
    });
    setProductCounts(counts);
  }, []);

  // Show first 6 categories on home page
  const homeCategories = CATEGORIES.slice(0, 6);

  return (
    <>
      {/* === HERO === */}
      <section className="hero">
        <div className="hero-bg">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOgGmbLEnJVr6bOQ_2tJMNUZNwUu-XiKYN-_x9V4E9ZEED0V5vG7ssiC9k5Ggnl8leLdpxAhwq86DHHoSI6Fg3LTrfvSluonp8wiSdI--qWO1hTYcBCXrQUHXXKXvCv428o44RwELz2NFo6cPMqotqN6Q0jtFBWiewxDd2Q-LCYeuyC5spM6GlUchclO6GKPN-Oerb_NTrKdEY5HnqyZK-XIkZjg15r2M-rkMKpBEyt7Q-w2D5m_fdTSpvWxdpvb3_syzx5AxA9Zo"
            alt="Premium handloom textiles in a warm bedroom setting"
          />
          <div className="hero-bg-overlay" />
        </div>
        <div className="container">
          <div className="hero-content">
            <h1>Try Before You Buy — Handloom Textiles Delivered to Your Home.</h1>
            <p className="hero-text">
              Free home trial in Gurgaon & Bhiwadi. Experience the warmth of genuine handloom. Pay only for what you keep.
            </p>
            <div className="hero-actions">
              <Link href="/categories/bedsheets" className="btn btn-primary btn-lg">
                Start Your Free Trial
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link href="/how-it-works" className="btn btn-secondary btn-lg">
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* === TRUST BAR === */}
      <section className="trust-bar">
        <div className="container">
          <div className="trust-bar-grid">
            <div className="trust-bar-item">
              <span className="material-symbols-outlined">verified</span>
              <span>Free Home Trial</span>
            </div>
            <div className="trust-bar-item">
              <span className="material-symbols-outlined">payments</span>
              <span>No Advance Payment</span>
            </div>
            <div className="trust-bar-item">
              <span className="material-symbols-outlined">local_shipping</span>
              <span>Same-Day Delivery</span>
            </div>
            <div className="trust-bar-item">
              <span className="material-symbols-outlined">assignment_return</span>
              <span>Easy Returns</span>
            </div>
          </div>
        </div>
      </section>

      {/* === HOW IT WORKS === */}
      <section className="section" style={{ background: 'var(--color-background)' }}>
        <div className="container text-center">
          <h2 className="section-title">A Seamless Trial Experience</h2>
          <p className="section-subtitle">The future of handloom shopping, at your doorstep.</p>
          <div className="steps-grid">
            {[
              { icon: 'grid_view', title: '1. Browse & Pick', desc: 'Select up to 10 favorite items for your trial cart.' },
              { icon: 'event_available', title: '2. Book a Slot', desc: 'Choose a delivery time that works for you.' },
              { icon: 'house', title: '3. 30-min Trial', desc: 'Our expert visits you for a private home trial.' },
              { icon: 'shopping_bag', title: '4. Pay & Keep', desc: 'Only pay for what you absolutely love.' },
            ].map((step, i) => (
              <div key={i} className="step-card">
                <div className="step-icon-circle">
                  <span className="material-symbols-outlined">{step.icon}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === SHOP BY CATEGORY === */}
      <section className="section" style={{ background: 'var(--color-surface-container-lowest)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-xl)' }}>
            <div>
              <h2 className="section-title">Shop by Category</h2>
              <p className="section-subtitle">Find exactly what you need for every room.</p>
            </div>
          </div>

          {/* Category Pills — All 9 categories */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: 'var(--space-xl)' }}>
            {CATEGORIES.map(cat => (
              <Link
                href={`/categories/${cat.slug}`}
                key={cat.slug}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>

          {/* Featured Collections Grid — top 6 */}
          <div className="collections-grid">
            {homeCategories.map(cat => (
              <Link href={`/categories/${cat.slug}`} key={cat.slug}>
                <div className="collection-card">
                  <img
                    src={CATEGORY_IMAGES[cat.slug]}
                    alt={cat.name}
                  />
                  <div className="collection-card-overlay" />
                  {CATEGORY_BADGES[cat.slug] && (
                    <div className="collection-card-badge">
                      <span className="material-badge" style={{ background: 'rgba(252,249,248,0.9)', border: 'none' }}>
                        {CATEGORY_BADGES[cat.slug]}
                      </span>
                    </div>
                  )}
                  <div className="collection-card-info">
                    <h3>{cat.name}</h3>
                    <p>{CATEGORY_PRICES[cat.slug] || `${mounted ? productCounts[cat.slug] || 0 : '...'} products`}</p>
                  </div>
                  <div className="collection-card-cart-btn">
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Remaining 3 categories — smaller cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
            {CATEGORIES.slice(6).map(cat => (
              <Link href={`/categories/${cat.slug}`} key={cat.slug} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--color-surface-container-lowest)',
                  border: '1px solid var(--color-outline-variant)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-lg)',
                  display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}>
                  <span style={{ fontSize: '2rem' }}>{cat.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{cat.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>
                      {CATEGORY_PRICES[cat.slug]}
                    </div>
                  </div>
                  <span className="material-symbols-outlined" style={{ marginLeft: 'auto', color: 'var(--color-primary)', fontSize: '20px' }}>chevron_right</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* === CITY COVERAGE === */}
      <section className="city-section">
        <div className="container">
          <div className="city-content">
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '32px', marginBottom: 'var(--space-md)' }}>Serving Gurgaon & Bhiwadi</h2>
              <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: 'var(--space-xl)', lineHeight: 1.6 }}>
                We are currently exclusively operating in these two hubs to ensure 100% same-day delivery and trial slots.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <span className="material-symbols-outlined">location_on</span>
                  <span style={{ fontWeight: 500 }}>15+ Slots Daily</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <span className="material-symbols-outlined">speed</span>
                  <span style={{ fontWeight: 500 }}>2-Hour Arrival</span>
                </div>
              </div>
            </div>
            <div style={{ flex: 1, maxWidth: '400px' }}>
              <div className="city-map-card">
                <div style={{
                  aspectRatio: '16/10',
                  background: 'var(--color-surface-container)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column', gap: '0.5rem',
                }}>
                  <span className="material-symbols-outlined filled" style={{ fontSize: '48px', color: 'var(--color-primary)' }}>location_on</span>
                  <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-heading)', fontSize: '20px' }}>Live Tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === TESTIMONIALS === */}
      <section className="section" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
            <h2 className="section-title">What Our Trial Users Say</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-lg)' }}>
            {[
              {
                text: '"The convenience of seeing the curtains in my own living room before paying was a game-changer. The quality of handloom is exceptional."',
                name: 'Ananya Sharma',
                loc: 'Gurgaon Sector 56',
                color: 'var(--color-primary-container)',
                initial: 'A',
              },
              {
                text: '"No advance payment made the whole process stress-free. The agent was very professional and helped me choose the right bedsheet patterns."',
                name: 'Rahul Varma',
                loc: 'Bhiwadi Phase 2',
                color: 'var(--color-tertiary)',
                initial: 'R',
              },
              {
                text: '"Finally found high-quality Khadi linen that fits my modern decor. The try-at-home model is perfect for busy professionals like me."',
                name: 'Sana Kapoor',
                loc: 'DLF Phase 4',
                color: 'var(--color-secondary)',
                initial: 'S',
              },
            ].map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="material-symbols-outlined filled" style={{ fontSize: '20px' }}>star</span>
                  ))}
                </div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{ background: t.color }}>{t.initial}</div>
                  <div>
                    <div className="testimonial-author-name">{t.name}</div>
                    <div className="testimonial-author-loc">{t.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
