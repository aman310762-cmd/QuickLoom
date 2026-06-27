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
  bedsheets: 'From ₹499', curtains: 'From ₹399', carpets: 'From ₹999',
  rugs: 'From ₹699', towels: 'From ₹299', 'sofa-covers': 'From ₹399',
  blankets: 'From ₹499', mats: 'From ₹299', 'dining-covers': 'From ₹349',
};

const PROBLEMS = [
  {
    icon: 'palette',
    title: 'Colour screen par alag, room mein alag',
    desc: 'Photo mein dusty rose dikhti hai, par ghar aakar woh peach nikli! Screen brightness aur room ki lighting mein colour bilkul badal jaata hai.',
    solution: 'QuickLoom mein aap apne room ki light mein colour check karte hain — koi guess-work nahi.',
    image: '/images/problems/colour-issue.png',
  },
  {
    icon: 'texture',
    title: 'Fabric ka feel photo mein nahi aata',
    desc: 'Photo mein curtain premium lagti hai, par ghar aakar patli aur see-through nikli! Touch kiye bina quality ka andaaza lagana mushkil hai.',
    solution: 'QuickLoom mein aap fabric haath mein lekar feel karte hain — softness, thickness sab check hota hai.',
    image: '/images/problems/fabric-issue.png',
  },
  {
    icon: 'assignment_return',
    title: 'Return ka jhanjhat — maza khatam',
    desc: 'Pasand nahi aaya? Pack karo, pickup schedule karo, 7-10 din refund ka wait karo. Ek bedsheet return mein poore hafte ka tension.',
    solution: 'QuickLoom mein jo pasand nahi — wahi par wapas. Koi packing, koi courier, koi wait nahi.',
    image: '/images/problems/return-issue.png',
  },
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
            Bedsheet online nahi,<br />
            <em>family ke saath</em> choose karein.
          </h1>
          <p className="hero-subtitle">
            QuickLoom <strong>10 handloom products aapke ghar laata hai.</strong> Apne bed aur room mein dekhiye, fabric feel kariye, aur jo pasand aaye sirf uska payment kariye.
          </p>
          <div className="hero-actions">
            <Link href="/categories/bedsheets" className="btn-pill btn-pill-accent btn-pill-lg hero-cta-main">
              👉 Abhi 10 products add karein
              <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="hero-trust" aria-label="Trial benefits">
            <span><span className="check">✓</span> ₹0 advance</span>
            <span><span className="check">✓</span> Koi pressure nahi</span>
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
        <div className="problem-hero-banner">
          <span className="section-label">Online shopping ki asli problem</span>
          <h2 className="problem-headline">
            Online photo achhi lagti hai...<br />
            <span className="problem-headline-highlight">Par ghar mein suit nahi karti!</span>
          </h2>
          <p className="problem-hero-desc">Har online shopper ke saath yeh hota hai. Design pasand aata hai par ghar aakar lagta hai — <strong>yeh toh woh nahi jo maine socha tha.</strong></p>
        </div>

        <div className="problem-cards-row">
          {PROBLEMS.map((problem, idx) => (
            <article className="problem-compact-card" key={problem.title}>
              <div className="problem-compact-image">
                <img src={problem.image} alt={problem.title} />
              </div>
              <div className="problem-compact-body">
                <span className="problem-compact-num">Problem {idx + 1}</span>
                <h3>{problem.title}</h3>
                <p>{problem.desc}</p>
                <div className="problem-compact-solution">
                  <span className="problem-compact-check">✅</span>
                  <span>{problem.solution}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="solution-band-big">
          <div className="solution-band-inner">
            <span className="solution-band-emoji">💡</span>
            <div>
              <span className="solution-kicker">QuickLoom ka simple solution</span>
              <h3 className="solution-band-title">Store ko ghar le aao.</h3>
              <p>Product ko apne real room mein dekho, touch karo, family ke saath compare karo — phir decide karo. <strong>Koi advance payment nahi, koi pressure nahi.</strong></p>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="how-section">
        <div className="section-heading-centered">
          <span className="section-label">Bas 3 simple steps</span>
          <h2 className="how-headline">
            Aapka ghar hi <em>trial room</em> hai.
          </h2>
          <p className="how-subtitle">No advance. No awkward sales pressure. No return courier.</p>
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
