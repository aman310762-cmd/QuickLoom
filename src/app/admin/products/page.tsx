'use client';

import { useState, useEffect, useRef } from 'react';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '@/lib/data/store';
import { Product, CATEGORIES, Category, InventoryStatus } from '@/lib/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [filter, setFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: '', description: '', category: 'bedsheets' as Category, subcategory: '',
    price: '', originalPrice: '', size: '', material: '', careInstructions: '',
    color: '', pattern: '', sku: '', serialNumber: '',
  });

  useEffect(() => {
    setProducts(getAllProducts());
  }, []);

  const refresh = () => setProducts(getAllProducts());

  const filtered = products.filter(p => {
    if (filter && p.category !== filter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.color.toLowerCase().includes(q);
    }
    return true;
  });

  const openCreate = () => {
    setEditing(null);
    setImageUrls([]);
    setForm({
      name: '', description: '', category: 'bedsheets', subcategory: '',
      price: '', originalPrice: '', size: '', material: '', careInstructions: '',
      color: '', pattern: '', sku: `QL-${Date.now()}`, serialNumber: `QL-${Date.now()}-S1`,
    });
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setImageUrls(p.images || []);
    setForm({
      name: p.name, description: p.description, category: p.category,
      subcategory: p.subcategory, price: String(p.price), originalPrice: String(p.originalPrice),
      size: p.size, material: p.material, careInstructions: p.careInstructions,
      color: p.color, pattern: p.pattern, sku: p.sku, serialNumber: p.serialNumber,
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.urls) {
        setImageUrls(prev => [...prev, ...data.urls]);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Image upload failed. Please try again.');
    } finally {
      setUploadingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const setPrimaryImage = (index: number) => {
    setImageUrls(prev => {
      const newUrls = [...prev];
      const [moved] = newUrls.splice(index, 1);
      newUrls.unshift(moved);
      return newUrls;
    });
  };

  const handleSave = () => {
    if (!form.name || !form.price) {
      alert('Please fill in product name and price.');
      return;
    }

    const productData = {
      name: form.name,
      description: form.description,
      category: form.category,
      subcategory: form.subcategory,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice) || Number(form.price),
      size: form.size,
      material: form.material,
      careInstructions: form.careInstructions,
      color: form.color,
      pattern: form.pattern,
      sku: form.sku,
      serialNumber: form.serialNumber,
      images: imageUrls,
      status: 'available' as InventoryStatus,
      cities: ['Gurgaon', 'Bhiwadi'],
      isVisible: true,
    };

    if (editing) {
      updateProduct(editing.id, productData);
    } else {
      createProduct(productData);
    }
    setShowModal(false);
    refresh();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      deleteProduct(id);
      refresh();
    }
  };

  const toggleVisibility = (p: Product) => {
    updateProduct(p.id, { isVisible: !p.isVisible });
    refresh();
  };

  const STATUS_BADGE: Record<string, string> = {
    available: 'badge-success',
    reserved: 'badge-warning',
    out_for_trial: 'badge-primary',
    sold: 'badge-info',
    returned_pending: 'badge-warning',
    restocked: 'badge-success',
    damaged: 'badge-error',
  };

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Products</h1>
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px' }}>{products.length} total products</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
          Add Product
        </button>
      </div>

      {/* Filter & Search */}
      <div className="filter-bar" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="filter-group">
          <label>Category</label>
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Name, SKU, or Color..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ minWidth: '200px' }}
          />
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ color: 'var(--color-outline)', fontSize: '14px' }}>
          Showing {filtered.length} products
        </div>
      </div>

      {/* Products Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Image</th>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>SKU</th>
              <th>Status</th>
              <th>Visible</th>
              <th style={{ width: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: 'var(--radius-md)',
                    overflow: 'hidden', background: 'var(--color-surface-container)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {p.images && p.images.length > 0 && p.images[0] && !p.images[0].includes('/images/products/bedsheet') ? (
                      <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-outline)' }}>image</span>
                    )}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 600, maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-outline)' }}>
                    {p.size} · {p.color}
                  </div>
                </td>
                <td>
                  <span className="badge badge-neutral">{CATEGORIES.find(c => c.slug === p.category)?.name}</span>
                </td>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>₹{p.price.toLocaleString()}</div>
                  {p.originalPrice > p.price && (
                    <div style={{ fontSize: '12px', color: 'var(--color-outline)', textDecoration: 'line-through' }}>
                      ₹{p.originalPrice.toLocaleString()}
                    </div>
                  )}
                </td>
                <td style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>{p.sku}</td>
                <td>
                  <span className={`badge ${STATUS_BADGE[p.status] || 'badge-neutral'}`}>
                    {p.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => toggleVisibility(p)}
                    style={{
                      padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '12px',
                      fontWeight: 500, border: '1px solid',
                      background: p.isVisible ? 'rgba(16,185,129,0.1)' : 'transparent',
                      borderColor: p.isVisible ? '#10B981' : 'var(--color-outline-variant)',
                      color: p.isVisible ? '#10B981' : 'var(--color-outline)',
                      cursor: 'pointer',
                    }}
                  >
                    {p.isVisible ? '● Live' : '○ Hidden'}
                  </button>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)} title="Edit product">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(p.id)} title="Delete product" style={{ color: 'var(--color-error)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '780px' }}>
            <div className="modal-header">
              <h2>{editing ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Image Upload Section */}
            <div style={{ marginBottom: 'var(--space-xl)' }}>
              <label className="form-label" style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>photo_library</span>
                Product Images
              </label>

              {/* Upload Zone */}
              <div className="image-upload-zone" onClick={() => fileInputRef.current?.click()}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <div className="upload-icon">
                  <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: 'var(--color-outline)' }}>
                    {uploadingImages ? 'hourglass_empty' : 'cloud_upload'}
                  </span>
                </div>
                <p>{uploadingImages ? 'Uploading images...' : 'Click or drag & drop to upload product photos'}</p>
                <div className="upload-hint">PNG, JPG, WEBP up to 10MB each · Multiple files supported</div>
              </div>

              {/* Image Previews */}
              {imageUrls.length > 0 && (
                <div className="image-preview-grid">
                  {imageUrls.map((url, i) => (
                    <div key={i} className={`image-preview-item ${i === 0 ? 'primary' : ''}`}>
                      <img src={url} alt={`Product image ${i + 1}`} />
                      <button className="remove-btn" onClick={() => removeImage(i)} title="Remove image">
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
                      </button>
                      {i === 0 && <div className="primary-label">Primary</div>}
                      {i !== 0 && (
                        <button
                          onClick={() => setPrimaryImage(i)}
                          style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none',
                            fontSize: '10px', padding: '3px', cursor: 'pointer',
                            opacity: 0, transition: 'opacity 0.2s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                          onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                        >
                          Set Primary
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Form */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Product Name *</label>
                <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g., Royal Jaipuri Bedsheet Set" />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Description</label>
                <textarea className="form-input form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} placeholder="Detailed product description..." />
              </div>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-input form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value as Category})}>
                  {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Subcategory</label>
                <input className="form-input" value={form.subcategory} onChange={e => setForm({...form, subcategory: e.target.value})} placeholder="e.g., Bedsheets" />
              </div>
              <div className="form-group">
                <label className="form-label">Price (₹) *</label>
                <input className="form-input" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="1299" />
              </div>
              <div className="form-group">
                <label className="form-label">Original Price (₹)</label>
                <input className="form-input" type="number" value={form.originalPrice} onChange={e => setForm({...form, originalPrice: e.target.value})} placeholder="1999" />
              </div>
              <div className="form-group">
                <label className="form-label">Size</label>
                <input className="form-input" value={form.size} onChange={e => setForm({...form, size: e.target.value})} placeholder='e.g., King (108" x 108")' />
              </div>
              <div className="form-group">
                <label className="form-label">Material</label>
                <input className="form-input" value={form.material} onChange={e => setForm({...form, material: e.target.value})} placeholder="e.g., 100% Cotton" />
              </div>
              <div className="form-group">
                <label className="form-label">Color</label>
                <input className="form-input" value={form.color} onChange={e => setForm({...form, color: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Pattern</label>
                <input className="form-input" value={form.pattern} onChange={e => setForm({...form, pattern: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">SKU</label>
                <input className="form-input" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} style={{ fontFamily: 'monospace' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Serial Number</label>
                <input className="form-input" value={form.serialNumber} onChange={e => setForm({...form, serialNumber: e.target.value})} style={{ fontFamily: 'monospace' }} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Care Instructions</label>
                <input className="form-input" value={form.careInstructions} onChange={e => setForm({...form, careInstructions: e.target.value})} placeholder="Machine wash cold, tumble dry low..." />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn btn-primary" onClick={handleSave} style={{ flex: 1 }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{editing ? 'save' : 'add_circle'}</span>
                {editing ? 'Save Changes' : 'Create Product'}
              </button>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
