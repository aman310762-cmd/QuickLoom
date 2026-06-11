'use client';

import Link from 'next/link';
import { CATEGORIES } from '@/lib/types';
import { fetchVisibleProducts } from '@/lib/api';
import { useEffect, useState, useRef } from 'react';

const CATEGORY_IMAGES: Record<string, string> = {
  bedsheets: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=85&auto=format&fit=crop',
  curtains: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=85&auto=format&fit=crop',
  carpets: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=85&auto=format&fit=crop',
  rugs: 'https://images.unsplash.com/photo-1560448205-17d3e46c35e3?w=1200&q=85&auto=format&fit=crop',
  towels: 'https://images.unsplash.com/photo-1583845112239-97ef1341b271?w=1200&q=85&auto=format&fit=crop',
  'sofa-covers': 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200&q=85&auto=format&fit=crop',
  blankets: 'https://images.unsplash.com/photo-1580893246395-52aead8960dc?w=1200&q=85&auto=format&fit=crop',
  mats: 'https://images.unsplash.com/photo-1591079406874-6c3cd7fd44e5?w=1200&q=85&auto=format&fit=crop',
  'dining-covers': 'https://images.unsplash.com/photo-1614160859544-177611d0ed56?w=1200&q=85&auto=format&fit=crop',
};

const CATEGORY_TAGS: Record<string, string> = {
  bedsheets: '100% Cotton', curtains: 'Hand-Woven', carpets: 'Artisan Made',
  rugs: 'Handloom', towels: 'Organic', 'sofa-covers': 'Premium',
  blankets: 'Warm & Soft', mats: 'Hand-Crafted', 'dining-covers': 'Designer',
};

const CATEGORY_COLORS: Record<string, { bg: string; deep: string; tint: string }> = {
  bedsheets: { bg: 'oklch(0.5 0.15 35)', deep: 'oklch(0.5 0.15 35)', tint: 'oklch(0.94 0.04 35)' },
  curtains: { bg: 'oklch(0.5 0.15 80)', deep: 'oklch(0.5 0.15 80)', tint: 'oklch(0.94 0.04 80)' },
  carpets: { bg: 'oklch(0.5 0.15 150)', deep: 'oklch(0.5 0.15 150)', tint: 'oklch(0.94 0.04 150)' },
  rugs: { bg: 'oklch(0.5 0.15 210)', deep: 'oklch(0.5 0.15 210)', tint: 'oklch(0.94 0.04 210)' },
  towels: { bg: 'oklch(0.5 0.15 265)', deep: 'oklch(0.5 0.15 265)', tint: 'oklch(0.94 0.04 265)' },
  'sofa-covers': { bg: 'oklch(0.5 0.15 320)', deep: 'oklch(0.5 0.15 320)', tint: 'oklch(0.94 0.04 320)' },
  blankets: { bg: 'oklch(0.5 0.15 35)', deep: 'oklch(0.5 0.15 35)', tint: 'oklch(0.94 0.04 35)' },
  mats: { bg: 'oklch(0.5 0.15 150)', deep: 'oklch(0.5 0.15 150)', tint: 'oklch(0.94 0.04 150)' },
  'dining-covers': { bg: 'oklch(0.5 0.15 265)', deep: 'oklch(0.5 0.15 265)', tint: 'oklch(0.94 0.04 265)' },
};

const CATEGORY_PRICES: Record<string, string> = {
  bedsheets: 'From ₹1,899', curtains: 'From ₹1,599', carpets: 'From ₹3,999',
  rugs: 'From ₹1,899', towels: 'From ₹899', 'sofa-covers': 'From ₹899',
  blankets: 'From ₹1,299', mats: 'From ₹599', 'dining-covers': 'From ₹699',
};

const STEPS = [
  { num: '01', title: 'Browse & Pick', desc: 'Choose up to 10 favourites for your trial cart — bedsheets, curtains, rugs, anything.', color: 'oklch(0.62 0.19 35)' },
  { num: '02', title: 'Book a Slot', desc: 'Pick a same-day delivery window that suits your family. 15+ slots daily.', color: 'oklch(0.68 0.15 80)' },
  { num: '03', title: '30-min Home Trial', desc: 'Our expert lays everything out in your own rooms, on your own bed and windows.', color: 'oklch(0.55 0.15 210)' },
  { num: '04', title: 'Pay & Keep', desc: 'Keep what you love, return the rest on the spot. ₹0 advance, no pressure.', color: 'oklch(0.55 0.17 320)' },
];

const TESTIMONIALS = [
  { quote: 'The convenience of seeing the curtains in my own living room before paying was a game-changer. The quality of handloom is exceptional.', name: 'Ananya Sharma', area: 'Gurgaon Sector 56', initial: 'A', tint: 'oklch(0.94 0.04 35)', deep: 'oklch(0.5 0.15 35)' },
  { quote: 'No advance payment made the whole process stress-free. The agent was very professional and helped me choose the right bedsheet patterns.', name: 'Rahul Varma', area: 'Bhiwadi Phase 2', initial: 'R', tint: 'oklch(0.94 0.04 210)', deep: 'oklch(0.5 0.15 210)' },
  { quote: 'Finally found high-quality Khadi linen that fits my modern decor. The try-at-home model is perfect for busy professionals like me.', name: 'Sana Kapoor', area: 'DLF Phase 4', initial: 'S', tint: 'oklch(0.94 0.04 320)', deep: 'oklch(0.5 0.15 320)' },
];

const MARQUEE_ITEMS = ['Free Home Trial', '₹0 Advance Payment', 'Same-Day Delivery', 'Up to 10 Items Per Trial', 'Easy Returns', 'Genuine Handloom'];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const load = async () => {
      const products = await fetchVisibleProducts();
      const counts: Record<string, number> = {};
      CATEGORIES.forEach(cat => {
        counts[cat.slug] = products.filter(p => p.category === cat.slug).length;
      });
      setProductCounts(counts);
    };
    load();
  }, []);

  const mainCategories = CATEGORIES.slice(0, 6);
  const smallCategories = CATEGORIES.slice(6);

  const handleHeroMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const r = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    heroRef.current.style.transform = `rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg)`;
  };
  const handleHeroMouseLeave = () => {
    if (heroRef.current) heroRef.current.style.transform = 'rotateX(3deg) rotateY(-6deg)';
  };

  if (!mounted) return null;

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">Free handloom home trials — Gurgaon &amp; Bhiwadi</span>
          <h1 className="hero-title">
            See it. Feel it.<br />
            Keep what <em>you love.</em>
          </h1>
          <p className="hero-subtitle">
            We bring up to <strong>10 handloom bedsheets, curtains &amp; rugs</strong> to your doorstep for a 30-minute trial. No advance payment — pay only for what stays in your home.
          </p>
          <div className="hero-actions">
            <Link href="/categories/bedsheets" className="btn-pill btn-pill-accent">
              Start Your Free Trial →
            </Link>
            <Link href="/how-it-works" className="btn-pill btn-pill-outline">
              How it works
            </Link>
          </div>
          <div className="hero-trust">
            <span><span className="check">✓</span> ₹0 advance</span>
            <span><span className="check">✓</span> Same-day delivery</span>
            <span><span className="check">✓</span> Easy returns</span>
          </div>
        </div>

        <div className="hero-image-wrapper">
          <div className="hero-image-card" ref={heroRef} onMouseMove={handleHeroMouseMove} onMouseLeave={handleHeroMouseLeave}>
            <div className="hero-image-inner">
              <img
                src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=85&auto=format&fit=crop"
                alt="Premium handloom textiles on a luxurious bed"
              />
            </div>
            <div className="hero-float-badge" style={{ top: 24, left: -28 }}>
              <span className="hero-float-badge-icon" style={{ background: 'var(--success-bg)' }}>✓</span>
              <div>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Free Home Trial</span>
              </div>
            </div>
            <div className="hero-float-badge" style={{ bottom: -24, right: 28 }}>
              <span style={{ width: 10, height: 10, borderRadius: 99, background: 'var(--success)', boxShadow: '0 0 0 4px oklch(0.65 0.18 145 / 0.2)' }} />
              <div>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Up to 10 items per trial</span>
                <span style={{ display: 'block', fontSize: 12, color: 'var(--text-faint)' }}>Same-day delivery slots</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i}>
              <span className="marquee-item">{item}</span>
              <span className="marquee-sep">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how" style={{ maxWidth: 1240, margin: '0 auto', padding: '110px 32px 90px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textAlign: 'center', marginBottom: 56 }}>
          <span className="section-label">How it works</span>
          <h2 className="section-title">Your home is the trial room.</h2>
          <p className="section-desc" style={{ maxWidth: 480 }}>Four simple steps from browsing to keeping only what you love.</p>
        </div>
        <div className="steps-grid">
          {STEPS.map(step => (
            <div key={step.num} className="step-card">
              <span className="step-num" style={{ color: step.color }}>{step.num}</span>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section id="shop" style={{ background: 'var(--bg-alt)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '100px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 48, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span className="section-label">Shop by category</span>
              <h2 className="section-title">Every thread, every room.</h2>
            </div>
            <p style={{ fontSize: 17, color: 'var(--text-muted)', maxWidth: 360, textWrap: 'pretty' as any }}>
              Genuine handloom for bedrooms, living rooms and everything in between — add any of it to your trial.
            </p>
          </div>
          <div className="categories-grid">
            {mainCategories.map(cat => {
              const colors = CATEGORY_COLORS[cat.slug] || CATEGORY_COLORS.bedsheets;
              return (
                <Link key={cat.slug} href={`/categories/${cat.slug}`} className="category-card">
                  <div className="category-card-image">
                    <img src={CATEGORY_IMAGES[cat.slug]} alt={cat.name} />
                    <span className="category-card-tag" style={{ background: colors.deep }}>{CATEGORY_TAGS[cat.slug]}</span>
                  </div>
                  <div className="category-card-body">
                    <div>
                      <div className="category-card-name">{cat.name}</div>
                      <div className="category-card-price">{CATEGORY_PRICES[cat.slug]}</div>
                    </div>
                    <span className="category-card-arrow" style={{ background: colors.tint, color: colors.deep }}>→</span>
                  </div>
                </Link>
              );
            })}
          </div>
          {smallCategories.length > 0 && (
            <div className="small-cat-pills">
              {smallCategories.map(cat => {
                const colors = CATEGORY_COLORS[cat.slug] || CATEGORY_COLORS.bedsheets;
                return (
                  <Link key={cat.slug} href={`/categories/${cat.slug}`} className="small-cat-pill">
                    <span className="small-cat-dot" style={{ background: colors.deep }} />
                    {cat.name}
                    <span className="small-cat-price">{CATEGORY_PRICES[cat.slug]}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ===== SERVICE AREA ===== */}
      <section className="dark-section">
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 64, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <span className="section-label">Service area</span>
            <h2 className="section-title">Only Gurgaon &amp; Bhiwadi.<br /><em>On purpose.</em></h2>
            <p style={{ fontSize: 17.5, lineHeight: 1.65, maxWidth: 480, textWrap: 'pretty' as any }}>
              We operate exclusively in two hubs so every family gets guaranteed same-day delivery, real trial slots and an expert at the door — not a courier box.
            </p>
          </div>
          <div className="stat-grid">
            <div className="stat-card"><div className="stat-value">15+</div><div className="stat-label">Trial slots every day</div></div>
            <div className="stat-card"><div className="stat-value">2 hrs</div><div className="stat-label">Typical arrival time</div></div>
            <div className="stat-card"><div className="stat-value">Live</div><div className="stat-label">Delivery tracking</div></div>
            <div className="stat-card"><div className="stat-value">30 min</div><div className="stat-label">Private home trial</div></div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section style={{ maxWidth: 1240, margin: '0 auto', padding: '110px 32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textAlign: 'center', marginBottom: 52 }}>
          <span className="section-label">Trial stories</span>
          <h2 className="section-title">Families who tried it at home.</h2>
        </div>
        <div className="testimonials-grid">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="testimonial-card">
              <span className="testimonial-stars">★★★★★</span>
              <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
              <div className="testimonial-author">
                <span className="testimonial-avatar" style={{ background: t.tint, color: t.deep }}>{t.initial}</span>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-area">{t.area}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px 110px' }}>
        <div className="cta-section">
          <h2>Ready to feel the difference?</h2>
          <p>Book a free trial today — we&apos;ll be at your door with 10 handpicked handloom pieces before dinner.</p>
          <div className="cta-buttons">
            <Link href="/categories/bedsheets" className="btn-pill btn-pill-white">
              Start Your Free Trial →
            </Link>
            <a href="https://wa.me/919315807233" className="btn-pill" style={{ background: 'oklch(0.5 0.16 35)', color: 'white', border: '1px solid oklch(0.72 0.14 35)' }}>
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
