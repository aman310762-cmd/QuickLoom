'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { fetchProductById, fetchProductsByCategory, addToCart, isInCart, removeFromCart, getCartCount } from '@/lib/api';
import { Product } from '@/lib/types';

function ImageZoom({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const zoomFactor = 2.5;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
    setLensPos({
      x: e.clientX - rect.left - 75,
      y: e.clientY - rect.top - 75,
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className={`product-image-zoom-container ${showZoom ? 'zoomed' : ''}`}
      onMouseEnter={() => setShowZoom(true)}
      onMouseLeave={() => setShowZoom(false)}
      onMouseMove={handleMouseMove}
      style={{ aspectRatio: '1', position: 'relative' }}
    >
      <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      {showZoom && (
        <>
          {/* Lens circle */}
          <div
            className="product-image-zoom-lens"
            style={{
              left: `${lensPos.x}px`,
              top: `${lensPos.y}px`,
              opacity: 1,
              backgroundImage: `url(${src})`,
              backgroundSize: `${zoomFactor * 100}% ${zoomFactor * 100}%`,
              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
            }}
          />
          {/* Full zoom panel on the right */}
          <div
            className="product-zoom-result"
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: `${zoomFactor * 100}%`,
              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
            }}
          />
        </>
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [inCart, setInCart] = useState(false);
  const [similar, setSimilar] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [toast, setToast] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'not-found' | 'error'>('loading');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!id) return;

      setLoadState('loading');
      setProduct(null);
      setSimilar([]);

      try {
        const p = await fetchProductById(id);
        if (cancelled) return;

        if (!p) {
          setLoadState('not-found');
          return;
        }

        setProduct(p);
        setLoadState('ready');
        setInCart(isInCart(p.id));
        setSelectedImageIndex(0);
        setCartCount(getCartCount());

        try {
          const catProducts = await fetchProductsByCategory(p.category);
          if (!cancelled) setSimilar(catProducts.filter(sp => sp.id !== p.id).slice(0, 4));
        } catch {
          if (!cancelled) setSimilar([]);
        }
      } catch (error) {
        console.error('Product load failed:', error);
        if (!cancelled) setLoadState('error');
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [id, retryCount]);

  const handleCart = () => {
    if (!product) return;
    if (inCart) {
      removeFromCart(product.id);
      setInCart(false);
      setToast('Removed from trial cart');
    } else {
      const result = addToCart(product.id);
      if (result.success) {
        setInCart(true);
        setToast('Added to trial cart!');
      } else {
        setToast(result.message);
      }
    }
    setCartCount(getCartCount());
    window.dispatchEvent(new Event('cartUpdated'));
    setTimeout(() => setToast(''), 2500);
  };

  if (loadState === 'loading') {
    return (
      <div className="container product-loading" aria-live="polite" aria-busy="true">
        <div className="product-loading-grid">
          <div className="catalog-skeleton product-image-skeleton" />
          <div className="product-info-skeleton">
            <div className="catalog-skeleton skeleton-line skeleton-short" />
            <div className="catalog-skeleton skeleton-line skeleton-title" />
            <div className="catalog-skeleton skeleton-line skeleton-price" />
            <div className="catalog-skeleton skeleton-line" />
            <div className="catalog-skeleton skeleton-line" />
            <div className="catalog-skeleton skeleton-button" />
          </div>
        </div>
        <span className="sr-only">Loading product details</span>
      </div>
    );
  }

  if (loadState === 'error') {
    return (
      <div className="container catalog-state-message" role="alert">
        <span className="material-symbols-outlined">cloud_off</span>
        <h2>We couldn&apos;t load this product</h2>
        <p>Your product is still safely stored. Please check your connection and try again.</p>
        <button className="btn btn-primary" onClick={() => setRetryCount(count => count + 1)}>Try Again</button>
      </div>
    );
  }

  if (loadState === 'not-found' || !product) {
    return (
      <div className="container catalog-state-message">
        <span className="material-symbols-outlined" style={{ fontSize: 64, color: 'var(--text-faint)' }}>inventory_2</span>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginTop: 16 }}>Product not found</h2>
        <p>This product may be hidden or the link may be incorrect.</p>
        <Link href="/" className="btn btn-primary" style={{ marginTop: 16 }}>Go Home</Link>
      </div>
    );
  }

  const materialLabel = product.material.split(',')[0].trim();
  const hasImages = product.images && product.images.length > 0 && product.images[0];
  const currentImage = hasImages ? product.images[selectedImageIndex] || product.images[0] : null;

  return (
    <>
      <div className="container">
        {/* Breadcrumb */}
        <div className="product-detail-breadcrumb">
          <Link href="/">Home</Link>
          <span style={{ margin: '0 0.5rem', opacity: 0.5 }}>&gt;</span>
          <Link href={`/categories/${product.category}`}>{product.subcategory}</Link>
          <span style={{ margin: '0 0.5rem', opacity: 0.5 }}>&gt;</span>
          <span style={{ color: 'var(--text)' }}>{product.name}</span>
        </div>

        {/* Product Grid */}
        <div className="product-detail-grid">
          {/* Gallery */}
          <div className="product-detail-gallery">
            {/* Main Image with Zoom */}
            <div className="product-detail-main-image" style={{ position: 'relative', overflow: 'visible' }}>
              {currentImage ? (
                <ImageZoom src={currentImage} alt={product.name} />
              ) : (
                <div style={{
                  width: '100%', aspectRatio: '1', position: 'relative',
                  background: 'var(--bg-alt)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 'var(--radius-xl)',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 80, color: 'var(--text-faint)' }}>image</span>
                </div>
              )}
              {/* Material Badge */}
              <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 20 }}>
                <span className="material-badge">
                  {materialLabel}
                </span>
              </div>
              {/* Zoom instruction */}
              {currentImage && (
                <div style={{
                  position: 'absolute', bottom: '0.75rem', left: '0.75rem', zIndex: 20,
                  background: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: 'var(--radius-full)',
                  padding: '4px 12px', fontSize: '11px', fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>zoom_in</span>
                  Hover to zoom
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {hasImages && product.images.length > 1 && (
              <div className="product-detail-thumbnails">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    style={{
                      width: 72, height: 72, borderRadius: 'var(--radius-md)',
                      overflow: 'hidden', cursor: 'pointer',
                      border: selectedImageIndex === i
                        ? '2px solid var(--accent)'
                        : '2px solid var(--border)',
                      padding: 0, background: 'none', opacity: selectedImageIndex === i ? 1 : 0.7,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <img src={img} alt={`View ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Image count indicator */}
            {hasImages && product.images.length > 1 && (
              <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-faint)', marginTop: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'text-bottom' }}>photo_library</span>
                {' '}{selectedImageIndex + 1} of {product.images.length} photos · Click to view different angles
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-detail-info">
            <div className="product-detail-category">PREMIUM HANDLOOM</div>
            <h1 className="product-detail-name">{product.name}</h1>
            <div className="product-detail-price">
              ₹{product.price.toLocaleString('en-IN')}
              {product.originalPrice > product.price && (
                <>
                  <span style={{ fontSize: 16, color: 'var(--text-faint)', textDecoration: 'line-through', marginLeft: 12, fontWeight: 400 }}>
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: '14px', color: '#10B981', fontWeight: 600, marginLeft: '0.5rem' }}>
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="product-detail-meta">
              <div className="product-detail-meta-row">
                <span className="product-detail-meta-label">Material</span>
                <span className="product-detail-meta-value">{product.material}</span>
              </div>
              <div className="product-detail-meta-row">
                <span className="product-detail-meta-label">SKU</span>
                <span className="product-detail-meta-value" style={{ fontFamily: 'monospace' }}>{product.sku}</span>
              </div>
              <div className="product-detail-meta-row">
                <span className="product-detail-meta-label">Size</span>
                <span className="product-detail-meta-value">{product.size}</span>
              </div>
              <div className="product-detail-meta-row">
                <span className="product-detail-meta-label">Color</span>
                <span className="product-detail-meta-value">{product.color}</span>
              </div>
              <div className="product-detail-meta-row">
                <span className="product-detail-meta-label">Pattern</span>
                <span className="product-detail-meta-value">{product.pattern}</span>
              </div>
              <div className="product-detail-meta-row">
                <span className="product-detail-meta-label">Care</span>
                <span className="product-detail-meta-value" style={{ maxWidth: '300px' }}>{product.careInstructions}</span>
              </div>
            </div>

            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 24 }}>
              {product.description}
            </p>

            {/* Add to Cart */}
            <button
              className={`btn ${inCart ? 'btn-tertiary' : 'btn-primary'} btn-lg`}
              onClick={handleCart}
              disabled={product.status !== 'available' && !inCart}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span className="material-symbols-outlined">{inCart ? 'remove_shopping_cart' : 'add_shopping_cart'}</span>
              {inCart ? 'Remove from Trial Cart' : 'Add to Trial Cart'}
            </button>
            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 12 }}>
              Trial Limit: {cartCount} of 10 items selected
            </p>

            {/* Trust Badges */}
            <div className="product-detail-trust-badges">
              <div className="trust-badge-item">
                <span className="material-symbols-outlined">event_available</span>
                <span>Free 3-Day Trial</span>
              </div>
              <div className="trust-badge-item">
                <span className="material-symbols-outlined">payments</span>
                <span>Pay After Trial</span>
              </div>
              <div className="trust-badge-item">
                <span className="material-symbols-outlined">assignment_return</span>
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {similar.length > 0 && (
        <div style={{ background: 'var(--bg-alt)', padding: '48px 0', borderTop: '1px solid var(--border)' }}>
          <div className="container">
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, marginBottom: 24 }}>You might also want to try these</h2>
            <div className="products-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              {similar.map(p => {
                const pHasImage = p.images && p.images.length > 0 && p.images[0];
                return (
                  <Link href={`/products/${p.id}`} key={p.id} className="product-card" style={{ textDecoration: 'none' }}>
                    <div className="product-card-image">
                      {pHasImage ? (
                        <img src={p.images[0]} alt={p.name} />
                      ) : (
                        <div style={{
                          width: '100%', height: '100%',
                          background: 'var(--bg-alt)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--text-faint)' }}>image</span>
                        </div>
                      )}
                    </div>
                    <div className="product-card-body">
                      <h3 className="product-card-name">{p.name}</h3>
                      <span className="product-card-price">₹{p.price.toLocaleString('en-IN')}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{
          position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--text)', color: 'var(--bg)',
          padding: '12px 24px', borderRadius: 'var(--radius-full)', fontSize: 14,
          fontWeight: 600, zIndex: 9999, boxShadow: 'var(--shadow-xl)', animation: 'fadeInUp 0.3s ease-out',
        }}>
          {toast}
        </div>
      )}
    </>
  );
}
