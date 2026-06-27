'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { CATEGORIES } from '@/lib/types';

const WHATSAPP_URL =
  'https://wa.me/919315807233?text=Hi%20QuickLoom%2C%20mujhe%20free%20home%20trial%20ke%20designs%20dekhne%20hain.';

const CATEGORY_IMAGES: Record<string, string> = {
  bedsheets: '/images/categories/bedsheets.png',
  curtains: '/images/categories/curtains.png',
  carpets: '/images/categories/carpets.png',
  rugs: '/images/categories/rugs.png',
  towels: '/images/categories/towels.png',
  'sofa-covers': '/images/categories/sofa-covers.png',
  blankets: '/images/categories/bedsheets.png',
  mats: '/images/categories/carpets.png',
  'dining-covers': '/images/categories/curtains.png',
};

const CATEGORY_TAGS: Record<string, string> = {
  bedsheets: '100% Cotton', curtains: 'Hand-Woven', carpets: 'Artisan Made',
  rugs: 'Handloom', towels: 'Organic', 'sofa-covers': 'Premium',
  blankets: 'Warm & Soft', mats: 'Hand-Crafted', 'dining-covers': 'Designer',
};

const CATEGORY_COLORS: Record<string, { deep: string; tint: string }> = {
  bedsheets: { deep: 'oklch(0.5 0.15 35)', tint: 'oklch(0.94 0.04 35)' },
  curtains: { deep: 'oklch(0.5 0.15 80)', tint: 'oklch(0.94 0.04 80)' },
  carpets: { deep: 'oklch(0.5 0.15 150)', tint: 'oklch(0.94 0.04 150)' },
  rugs: { deep: 'oklch(0.5 0.15 210)', tint: 'oklch(0.94 0.04 210)' },
  towels: { deep: 'oklch(0.5 0.15 265)', tint: 'oklch(0.94 0.04 265)' },
  'sofa-covers': { deep: 'oklch(0.5 0.15 320)', tint: 'oklch(0.94 0.04 320)' },
  blankets: { deep: 'oklch(0.5 0.15 35)', tint: 'oklch(0.94 0.04 35)' },
  mats: { deep: 'oklch(0.5 0.15 150)', tint: 'oklch(0.94 0.04 150)' },
  'dining-covers': { deep: 'oklch(0.5 0.15 265)', tint: 'oklch(0.94 0.04 265)' },
};

const CATEGORY_PRICES: Record<string, string> = {
  bedsheets: 'From ₹1,899', curtains: 'From ₹1,599', carpets: 'From ₹3,999',
  rugs: 'From ₹1,899', towels: 'From ₹899', 'sofa-covers': 'From ₹899',
  blankets: 'From ₹1,299', mats: 'From ₹599', 'dining-covers': 'From ₹699',
};

const PROBLEMS = [
  { icon: 'palette', title: 'Colour ka doubt', desc: 'Screen par jo shade dikhta hai, woh room ki light mein alag lag sakta hai.' },
  { icon: 'texture', title: 'Fabric feel nahi hota', desc: 'Softness, weave aur quality photo dekh kar judge karna mushkil hai.' },
  { icon: 'assignment_return', title: 'Return ka headache', desc: 'Packing, pickup aur refund ke chakkar mein shopping ka maza khatam ho jata hai.' },
];

const STEPS = [
  { num: '01', title: '10 favourites choose karein', desc: 'Bedsheets, curtains aur rugs mein se apne pasand ke designs Trial Cart mein add karein.' },
  { num: '02', title: 'Ghar par try karein', desc: 'QuickLoom products aapke ghar laata hai. Apne bed, window aur room ki light mein dekhiye.' },
  { num: '03', title: 'Sirf pasand ka payment', desc: 'Jo ghar mein perfect lage woh rakhiye. Baaki products hum usi waqt wapas le jayenge.' },
];

const FAQS = [
  { q: 'Kya home trial sach mein free hai?', a: 'Haan. Trial book karne ke liye koi advance payment nahi hai. Aap sirf un products ka payment karte hain jo trial ke baad rakhna chahte hain.' },
  { q: 'Kya trial ke baad kuch khareedna zaroori hai?', a: 'Nahi. Koi purchase compulsion nahi hai. Agar koi design aapke ghar mein suit nahi karta, aap sab products return kar sakte hain.' },
  { q: 'Main kitne products try kar sakta hoon?', a: 'Aap ek home trial ke liye bedsheets, curtains, rugs aur dusri categories mila kar 10 products tak choose kar sakte hain.' },
  { q: 'Trial mein kitna time lagta hai?', a: 'Aam taur par trial 30 minutes ka hota hai, jismein aap products ko apne room mein compare kar sakte hain.' },
  { q: 'QuickLoom abhi kahan available hai?', a: 'Home trial service filhaal Gurgaon aur Bhiwadi mein available hai.' },
];

const MARQUEE_ITEMS = ['₹0 Advance', '10 Products at Home', '30-Minute Trial', 'Pay Only for What You Keep', 'Gurgaon & Bhiwadi'];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const mainCategories = CATEGORIES.slice(0, 6);
  const smallCategories = CATEGORIES.slice(6);

  const handleHeroMouseMove = (event: React.MouseEvent) => {
    if (!heroRef.current) return;
    const bounds = heroRef.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroRef.current.style.transform = `rotateX(${(-y * 3).toFixed(2)}deg) rotateY(${(x * 3).toFixed(2)}deg)`;
  };

  const handleHeroMouseLeave = () => {
    if (heroRef.current) heroRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
  };

  return (
    <div>
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">Gurgaon &amp; Bhiwadi mein free home trial</span>
          <h1 className="hero-title">
            Online photo achhi lagti hai.<br />
            Par ghar mein <em>suit karegi?</em>
          </h1>
          <p className="hero-subtitle">
            QuickLoom <strong>10 handloom products aapke ghar laata hai.</strong> Apne bed aur room mein dekhiye, fabric feel kariye, aur jo pasand aaye sirf uska payment kariye.
          </p>
          <div className="hero-actions">
            <Link href="/categories/bedsheets" className="btn-pill btn-pill-accent">
              10 designs ghar par try karein
              <span aria-hidden="true">→</span>
            </Link>
            <a href={WHATSAPP_URL} className="btn-pill btn-pill-outline">
              WhatsApp par designs dekhein
            </a>
          </div>
          <div className="hero-trust" aria-label="Trial benefits">
            <span><span className="check">✓</span> ₹0 advance</span>
            <span><span className="check">✓</span> No purchase pressure</span>
            <span><span className="check">✓</span> 30-min trial</span>
          </div>
        </div>

        <div className="hero-image-wrapper">
          <div className="hero-image-card" ref={heroRef} onMouseMove={handleHeroMouseMove} onMouseLeave={handleHeroMouseLeave}>
            <div className="hero-image-inner">
              <video
                className="hero-video"
                poster="/images/categories/bedsheets.png"
                muted
                loop
                playsInline
                aria-label="QuickLoom products displayed in a bedroom for an at-home trial"
              />
              <div className="hero-media-caption">
                <span>Ghar par dekho</span>
                <span>Fabric feel karo</span>
                <span>Phir decide karo</span>
              </div>
            </div>
            <div className="hero-float-badge hero-float-badge-top">
              <span className="hero-float-badge-icon">10</span>
              <div><strong>Designs aapke ghar</strong><small>Ek hi trial mein</small></div>
            </div>
            <div className="hero-float-badge hero-float-badge-bottom">
              <span className="hero-status-dot" />
              <div><strong>Jo pasand aaye wahi rakho</strong><small>Baaki on-the-spot return</small></div>
            </div>
          </div>
        </div>
      </section>

      <div className="marquee-strip" aria-label="QuickLoom trial benefits">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, index) => (
            <span key={`${item}-${index}`}>
              <span className="marquee-item">{item}</span>
              <span className="marquee-sep">✦</span>
            </span>
          ))}
        </div>
      </div>

      <section className="problem-section">
        <div className="problem-heading">
          <span className="section-label">Online shopping ki asli problem</span>
          <h2 className="section-title">Bedsheet sirf screen par choose nahi hoti.</h2>
          <p className="section-desc">Design tabhi sahi lagta hai jab woh aapke furniture, lighting aur room ke saath fit baithe.</p>
        </div>
        <div className="problem-grid">
          {PROBLEMS.map(problem => (
            <article className="problem-item" key={problem.title}>
              <span className="material-symbols-outlined problem-icon" aria-hidden="true">{problem.icon}</span>
              <h3>{problem.title}</h3>
              <p>{problem.desc}</p>
            </article>
          ))}
        </div>
        <div className="solution-band">
          <span className="solution-kicker">QuickLoom ka simple solution</span>
          <p><strong>Store ko ghar le aao.</strong> Product ko real room mein dekho, touch karo, compare karo, phir khareedo.</p>
        </div>
      </section>

      <section id="how" className="how-section">
        <div className="section-heading-centered">
          <span className="section-label">Bas 3 simple steps</span>
          <h2 className="section-title">Aapka ghar hi trial room hai.</h2>
          <p className="section-desc">No advance. No awkward sales pressure. No return courier.</p>
        </div>
        <div className="steps-grid">
          {STEPS.map(step => (
            <article key={step.num} className="step-card">
              <span className="step-num">{step.num}</span>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="shop" className="shop-section">
        <div className="shop-inner">
          <div className="shop-heading">
            <div>
              <span className="section-label">Apna trial shuru karein</span>
              <h2 className="section-title">Pehle favourites choose karein.</h2>
            </div>
            <p>Category kholiye, pasand ke products Trial Cart mein add kariye aur convenient slot book kariye.</p>
          </div>
          <div className="categories-grid">
            {mainCategories.map(category => {
              const colors = CATEGORY_COLORS[category.slug] || CATEGORY_COLORS.bedsheets;
              return (
                <Link key={category.slug} href={`/categories/${category.slug}`} className="category-card">
                  <div className="category-card-image">
                    <img src={CATEGORY_IMAGES[category.slug]} alt={`${category.name} available for home trial`} />
                    <span className="category-card-tag" style={{ background: colors.deep }}>{CATEGORY_TAGS[category.slug]}</span>
                  </div>
                  <div className="category-card-body">
                    <div>
                      <div className="category-card-name">{category.name}</div>
                      <div className="category-card-price">{CATEGORY_PRICES[category.slug]}</div>
                    </div>
                    <span className="category-card-arrow" style={{ background: colors.tint, color: colors.deep }}>→</span>
                  </div>
                </Link>
              );
            })}
          </div>
          {smallCategories.length > 0 && (
            <div className="small-cat-pills">
              {smallCategories.map(category => {
                const colors = CATEGORY_COLORS[category.slug] || CATEGORY_COLORS.bedsheets;
                return (
                  <Link key={category.slug} href={`/categories/${category.slug}`} className="small-cat-pill">
                    <span className="small-cat-dot" style={{ background: colors.deep }} />
                    {category.name}
                    <span className="small-cat-price">{CATEGORY_PRICES[category.slug]}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="dark-section trust-section">
        <div className="trust-copy">
          <span className="section-label">Bina pressure ka trial</span>
          <h2 className="section-title">Pehle confidence.<br /><em>Uske baad payment.</em></h2>
          <p>QuickLoom ka model online return ke chakkar ko khatam karta hai. Decision aapke ghar mein, aapki family ke saath hota hai.</p>
          <a href={WHATSAPP_URL} className="btn-pill btn-pill-white">WhatsApp par sawaal poochhein</a>
        </div>
        <div className="trust-facts">
          <div><strong>₹0</strong><span>Advance payment</span></div>
          <div><strong>10</strong><span>Products per trial</span></div>
          <div><strong>30 min</strong><span>Home trial time</span></div>
          <div><strong>2 cities</strong><span>Gurgaon &amp; Bhiwadi</span></div>
        </div>
      </section>

      <section className="faq-section">
        <div className="faq-heading">
          <span className="section-label">Trial se pehle</span>
          <h2 className="section-title">Jo aap poochna chahenge.</h2>
          <p className="section-desc">Clear answers, taaki booking se pehle koi confusion na rahe.</p>
        </div>
        <div className="faq-list">
          {FAQS.map((faq, index) => (
            <details key={faq.q} open={index === 0}>
              <summary>{faq.q}<span aria-hidden="true">+</span></summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="final-cta-wrap">
        <div className="cta-section">
          <span className="cta-eyebrow">Gurgaon &amp; Bhiwadi</span>
          <h2>Room mein dekho. Phir decide karo.</h2>
          <p>10 favourites choose karke free home trial book kariye. Payment sirf uska jo aapke ghar mein perfect lage.</p>
          <div className="cta-buttons">
            <Link href="/categories/bedsheets" className="btn-pill btn-pill-white">10 designs choose karein →</Link>
            <a href={WHATSAPP_URL} className="btn-pill cta-whatsapp">WhatsApp us</a>
          </div>
        </div>
      </section>

      <Link href="/categories/bedsheets" className="mobile-trial-cta">
        Free home trial book karein <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
