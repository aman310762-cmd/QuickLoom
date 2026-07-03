'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { fetchVisibleProducts } from '@/lib/api';
import { CATEGORIES, Product } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';

const LIVE_CATEGORIES = ['bedsheets', 'curtains', 'sofa-covers'];

export default function AllProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [colorFilter, setColorFilter] = useState('');
  const [priceMax, setPriceMax] = useState<number | undefined>();
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [retryCount, setRetryCount] = useState(0);

  const liveCategories = CATEGORIES.filter(c => LIVE_CATEGORIES.includes(c.slug));

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoadState('loading');
      try {
        const loadedProducts = await fetchVisibleProducts();
        if (!cancelled) {
          // Only show products from live categories
          const liveProducts = loadedProducts.filter(p => LIVE_CATEGORIES.includes(p.category));
          setAllProducts(liveProducts);
          setLoadState('ready');
        }
      } catch (error) {
        console.error('Products load failed:', error);
        if (!cancelled) setLoadState('error');
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [retryCount]);

  const products = useMemo(() => {
    let filtered = [...allProducts];
    if (activeCategory !== 'all') filtered = filtered.filter(p => p.category === activeCategory);
    if (colorFilter) filtered = filtered.filter(p => p.color === colorFilter);
    if (priceMax) filtered = filtered.filter(p => p.price <= priceMax);
    if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    return filtered;
  }, [allProducts, activeCategory, sortBy, colorFilter, priceMax]);

  const uniqueColors = [...new Set(
    (activeCategory === 'all' ? allProducts : allProducts.filter(p => p.category === activeCategory))
      .map(p => p.color)
  )];

  const getCategoryCount = (slug: string) => {
    if (slug === 'all') return allProducts.length;
    return allProducts.filter(p => p.category === slug).length;
  };

  const clearFilters = () => {
    setSortBy('newest');
    setColorFilter('');
    setPriceMax(undefined);
  };

  return (
    <div style={{ paddingTop: 32, paddingBottom: 80 }}>
      <div className="container">
        {/* Breadcrumb */}
        <div className="product-detail-breadcrumb">
          <Link href="/">Home</Link> <span style={{ margin: '0 8px' }}>/</span> Products
        </div>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 className="section-title" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)' }}>Our Collection</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, marginTop: 4 }}>
            {loadState === 'loading' ? 'Loading products...' : `${products.length} products across ${liveCategories.length} categories`}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="category-tabs">
          <button
            className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Products
            <span className="category-tab-count">{getCategoryCount('all')}</span>
          </button>
          {liveCategories.map(cat => (
            <button
              key={cat.slug}
              className={`category-tab ${activeCategory === cat.slug ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.slug)}
            >
              {cat.icon} {cat.name}
              <span className="category-tab-count">{getCategoryCount(cat.slug)}</span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-faint)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: -3, marginRight: 4 }}>tune</span>
            Filter:
          </span>
          <select className="form-input" style={{ width: 'auto', padding: '8px 32px 8px 14px', fontSize: 14, borderRadius: 'var(--radius-full)' }}
            value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}>
            <option value="newest">Newest</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
          </select>
          <select className="form-input" style={{ width: 'auto', padding: '8px 32px 8px 14px', fontSize: 14, borderRadius: 'var(--radius-full)' }}
            value={colorFilter} onChange={e => setColorFilter(e.target.value)}>
            <option value="">All Colors</option>
            {uniqueColors.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="form-input" style={{ width: 'auto', padding: '8px 32px 8px 14px', fontSize: 14, borderRadius: 'var(--radius-full)' }}
            value={priceMax || ''} onChange={e => setPriceMax(e.target.value ? Number(e.target.value) : undefined)}>
            <option value="">All Prices</option>
            <option value="1000">Under ₹1,000</option>
            <option value="2000">Under ₹2,000</option>
            <option value="5000">Under ₹5,000</option>
            <option value="10000">Under ₹10,000</option>
          </select>
          {(colorFilter || priceMax) && (
            <button className="btn btn-sm" onClick={clearFilters}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
              Clear
            </button>
          )}
        </div>

        {/* Products Grid */}
        {loadState === 'loading' ? (
          <div className="products-grid" aria-live="polite" aria-busy="true">
            {Array.from({ length: 6 }, (_, index) => (
              <div className="product-card-skeleton" key={index}>
                <div className="catalog-skeleton skeleton-card-image" />
                <div className="catalog-skeleton skeleton-line skeleton-short" />
                <div className="catalog-skeleton skeleton-line" />
                <div className="catalog-skeleton skeleton-line skeleton-price" />
              </div>
            ))}
          </div>
        ) : loadState === 'error' ? (
          <div className="catalog-state-message" role="alert">
            <span className="material-symbols-outlined">cloud_off</span>
            <h3>Products couldn&apos;t be loaded</h3>
            <p>Please check your connection and try again.</p>
            <button className="btn btn-primary" onClick={() => setRetryCount(count => count + 1)}>Try Again</button>
          </div>
        ) : products.length > 0 ? (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div style={{ padding: 80, textAlign: 'center', color: 'var(--text-muted)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, marginBottom: 16, display: 'block', color: 'var(--text-faint)' }}>search_off</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>No products found</h3>
            <p style={{ marginTop: 8 }}>Try adjusting your filters or browse other categories.</p>
          </div>
        )}
      </div>
    </div>
  );
}
