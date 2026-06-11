'use client';

import { useState, useEffect } from 'react';
import { fetchAllProducts, updateProduct as apiUpdateProduct } from '@/lib/api';
import { Product, InventoryStatus, CATEGORIES } from '@/lib/types';
import { exportInventoryToExcel } from '@/lib/exportExcel';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAllProducts().then(setProducts);
  }, []);

  const refresh = async () => setProducts(await fetchAllProducts());

  const filtered = products.filter(p => {
    if (statusFilter && p.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.sku.toLowerCase().includes(q) ||
        p.serialNumber.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q);
    }
    return true;
  });

  const STATUS_BADGE: Record<string, string> = {
    available: 'badge-success',
    reserved: 'badge-warning',
    out_for_trial: 'badge-primary',
    sold: 'badge-info',
    returned_pending: 'badge-warning',
    restocked: 'badge-success',
    damaged: 'badge-error',
  };

  const STATUS_LABELS: Record<string, string> = {
    available: '✅ Available',
    reserved: '📌 Reserved',
    out_for_trial: '🚚 Out for Trial',
    sold: '💰 Sold',
    returned_pending: '🔍 Pending Check',
    restocked: '♻️ Restocked',
    damaged: '⚠️ Damaged',
  };

  const statusCounts = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  const handleRestock = async (id: string) => {
    await apiUpdateProduct(id, { status: 'available' });
    await refresh();
  };

  const handleStatusChange = async (id: string, status: InventoryStatus) => {
    await apiUpdateProduct(id, { status });
    await refresh();
  };

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Inventory</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Track product status and availability</p>
        </div>
        <button
          className="btn btn-sm"
          onClick={() => exportInventoryToExcel(products)}
          style={{ background: '#10B981', color: 'white', border: 'none' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span>
          Export Excel
        </button>
      </div>

      {/* Status overview */}
      <div className="admin-stats-grid" style={{ marginBottom: '1.5rem' }}>
        {Object.entries(STATUS_LABELS).map(([status, label]) => (
          <div
            key={status}
            className="admin-stat-card"
            style={{
              cursor: 'pointer',
              border: statusFilter === status ? '2px solid var(--accent)' : undefined,
            }}
            onClick={() => setStatusFilter(statusFilter === status ? '' : status)}
          >
            <div className="stat-label">{label}</div>
            <div className="stat-value">{statusCounts[status] || 0}</div>
          </div>
        ))}
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <label>Search SKU / Serial / Name</label>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            style={{ minWidth: '250px' }}
          />
        </div>
        <div className="filter-group">
          <label>Status</label>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            {Object.entries(STATUS_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ alignSelf: 'flex-end', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          {filtered.length} items
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>SKU</th>
              <th>Serial #</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{ fontWeight: 600, maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>₹{p.price.toLocaleString()}</div>
                </td>
                <td>{CATEGORIES.find(c => c.slug === p.category)?.name}</td>
                <td style={{ fontFamily: 'monospace', fontSize: '0.813rem' }}>{p.sku}</td>
                <td style={{ fontFamily: 'monospace', fontSize: '0.813rem' }}>{p.serialNumber}</td>
                <td>
                  <span className={`badge ${STATUS_BADGE[p.status]}`}>
                    {p.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                    {p.status === 'returned_pending' && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleRestock(p.id)}
                        style={{ fontSize: '0.75rem' }}
                      >
                        ✅ Restock
                      </button>
                    )}
                    {p.status === 'damaged' && (
                      <>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleRestock(p.id)}
                          style={{ fontSize: '0.75rem' }}
                        >
                          ♻️ Repair & Restock
                        </button>
                      </>
                    )}
                    {p.status === 'available' && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', padding: '0.25rem' }}>
                        Live on website
                      </span>
                    )}
                    {p.status === 'reserved' && (
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleStatusChange(p.id, 'available')}
                        style={{ fontSize: '0.75rem' }}
                      >
                        Release
                      </button>
                    )}
                    {p.status === 'sold' && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', padding: '0.25rem' }}>
                        Sold — removed from stock
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
