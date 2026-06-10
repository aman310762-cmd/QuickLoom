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
  const [cartCount, setCartCount] = useState(0);

  const category = CATEGORIES.find(c => c.slug === slug);

  useEffect(() => {
    fetchProductsByCategory(slug).then(data => {
      setAllCategoryProducts(data);
    });
  }, [slug]);

  useEffect(() => {
    let filtered = [...allCategoryProducts];
    if (colorFilter) filtered = filtered.filter(p => p.color === colorFilter);
    if (priceMax) filtered = filtered.filter(p => p.price <= priceMax);
    if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    setProducts(filtered);
  }, [allCategoryProducts, sortBy, colorFilter, priceMax]);

  useEffect(() => {
    const updateCount = () => setCartCount(getCartCount());
    updateCount();
    const interval = setInterval(updateCount, 500);
    window.addEventListener('cartUpdated', updateCount);
    return () => {
      clearInterval(interval);
      window.removeEventListener('cartUpdated', updateCount);
    };
  }, []);

  const uniqueColors = [...new Set(
    allCategoryProducts.map(p => p.color)
  )];

  const clearFilters = () => {
    setSortBy('newest');
    setColorFilter('');
    setPriceMax(undefined);
  };

  if (!category) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h1>Category not found</h1>
        <Link href="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Go Home</Link>
      </div>
    );
  }

  return (
    <div className="section" style={{ paddingTop: 'var(--space-xl)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '0.25rem' }}>{category.name}</h1>
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px' }}>
            ({products.length} items found in artisanal collection)
          </p>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>tune</span>
            Filter by:
          </label>
          <select className="filter-select" value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}>
            <option value="newest">Sort: Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
          <select className="filter-select" value={colorFilter} onChange={e => setColorFilter(e.target.value)}>
            <option value="">Color: All</option>
            {uniqueColors.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select className="filter-select" value={priceMax || ''} onChange={e => setPriceMax(e.target.value ? Number(e.target.value) : undefined)}>
            <option value="">Price: All</option>
            <option value="1000">Under ₹1,000</option>
            <option value="2000">Under ₹2,000</option>
            <option value="5000">Under ₹5,000</option>
            <option value="10000">Under ₹10,000</option>
          </select>
          {(colorFilter || priceMax) && (
            <button className="clear-filters-btn" onClick={clearFilters}>Clear All Filters</button>
          )}
        </div>

        {/* Products Grid with Sidebar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 'var(--space-xl)', marginTop: 'var(--space-lg)' }}>
          <div>
            {products.length > 0 ? (
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-on-surface-variant)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}>search_off</span>
                <h3>No products found</h3>
                <p>Try adjusting your filters or browse other categories.</p>
              </div>
            )}
          </div>

          {/* Sidebar Trial Cart Widget */}
          <div className="sidebar-cart-widget" style={{ display: 'none' }} id="sidebar-cart">
            <h3>
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>shopping_basket</span>
              Trial Cart
            </h3>
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                  {cartCount} of 10 items selected
                </span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                  {Math.round((cartCount / 10) * 100)}%
                </span>
              </div>
              <div className="cart-progress-bar">
                <div className="cart-progress-fill" style={{ width: `${(cartCount / 10) * 100}%` }} />
              </div>
            </div>
            <ul style={{ listStyle: 'none', fontSize: '14px', color: 'var(--color-on-surface-variant)', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: 'var(--space-lg)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-success)' }}>check_circle</span>
                Try in your own bedroom
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-success)' }}>check_circle</span>
                No obligation to buy
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-success)' }}>check_circle</span>
                Instant return of remaining
              </li>
            </ul>
            <Link href="/cart" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              View Trial Cart
            </Link>
            <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '0.75rem' }}>
              Trial slot available for <strong>Tomorrow</strong>
            </p>
          </div>
        </div>

        {/* Browse Other Categories */}
        <div style={{ marginTop: 'var(--space-4xl)' }}>
          <h2 style={{ fontSize: '24px', marginBottom: 'var(--space-lg)' }}>Browse Other Categories</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {CATEGORIES.filter(c => c.slug !== slug).map(cat => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="btn btn-secondary btn-sm"
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
