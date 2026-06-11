'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchProductsByCategory, getCartCount } from '@/lib/api';
import { CATEGORIES, Category, Product } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as Category;
  const [allCategoryProducts, setAllCategoryProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [colorFilter, setColorFilter] = useState('');
  const [priceMax, setPriceMax] = useState<number | undefined>();

  const category = CATEGORIES.find(c => c.slug === slug);

  useEffect(() => {
    fetchProductsByCategory(slug).then(setAllCategoryProducts);
  }, [slug]);

  useEffect(() => {
    let filtered = [...allCategoryProducts];
    if (colorFilter) filtered = filtered.filter(p => p.color === colorFilter);
    if (priceMax) filtered = filtered.filter(p => p.price <= priceMax);
    if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    setProducts(filtered);
  }, [allCategoryProducts, sortBy, colorFilter, priceMax]);

  const uniqueColors = [...new Set(allCategoryProducts.map(p => p.color))];

  const clearFilters = () => {
    setSortBy('newest');
    setColorFilter('');
    setPriceMax(undefined);
  };

  if (!category) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h1 className="section-title">Category not found</h1>
        <Link href="/" className="btn btn-primary" style={{ marginTop: 24 }}>Go Home</Link>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 32, paddingBottom: 80 }}>
      <div className="container">
        {/* Breadcrumb */}
        <div className="product-detail-breadcrumb">
          <Link href="/">Home</Link> <span style={{ margin: '0 8px' }}>/</span> {category.name}
        </div>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 className="section-title" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)' }}>{category.name}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, marginTop: 4 }}>
            {products.length} items found in artisanal collection
          </p>
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
        {products.length > 0 ? (
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

        {/* Other Categories */}
        <div style={{ marginTop: 80 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, marginBottom: 20 }}>Browse Other Categories</h2>
          <div className="small-cat-pills">
            {CATEGORIES.filter(c => c.slug !== slug).map(cat => (
              <Link key={cat.slug} href={`/categories/${cat.slug}`} className="small-cat-pill">
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
