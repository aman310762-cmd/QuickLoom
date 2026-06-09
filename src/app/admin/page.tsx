'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdminStats, getAllBookings, getAllProducts } from '@/lib/data/store';
import { Booking, Product } from '@/lib/types';

export default function AdminDashboard() {
  const [stats, setStats] = useState<ReturnType<typeof getAdminStats> | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    setStats(getAdminStats());
    setRecentBookings(getAllBookings().slice(-5).reverse());
    setProducts(getAllProducts());
    setCurrentTime(new Date().toLocaleDateString('en-IN', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }));
  }, []);

  if (!stats) return null;

  // Revenue calculations
  const soldProducts = products.filter(p => p.status === 'sold');
  const totalRevenue = soldProducts.reduce((sum, p) => sum + p.price, 0);
  const avgOrderValue = soldProducts.length > 0 ? Math.round(totalRevenue / soldProducts.length) : 0;

  // Low stock (available products count)
  const lowImageProducts = products.filter(p => !p.images || p.images.length === 0).length;

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: 'inventory_2', color: '#942E02', bg: 'rgba(148,46,2,0.08)' },
    { label: 'Available', value: stats.availableProducts, icon: 'check_circle', color: '#10B981', bg: 'rgba(16,185,129,0.08)' },
    { label: 'Reserved', value: stats.reservedProducts, icon: 'bookmark', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
    { label: 'Out for Trial', value: stats.outForTrial, icon: 'local_shipping', color: '#005685', bg: 'rgba(0,86,133,0.08)' },
    { label: 'Sold', value: stats.soldProducts, icon: 'monetization_on', color: '#10B981', bg: 'rgba(16,185,129,0.08)' },
    { label: 'Pending Check', value: stats.returnedPending, icon: 'pending', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: 'receipt_long', color: '#B5451B', bg: 'rgba(181,69,27,0.08)' },
    { label: 'Active Bookings', value: stats.activeBookings, icon: 'schedule', color: '#BA1A1A', bg: 'rgba(186,26,26,0.08)' },
  ];

  const STATUS_BADGE: Record<string, string> = {
    pending: 'badge-warning',
    confirmed: 'badge-info',
    out_for_trial: 'badge-primary',
    completed: 'badge-success',
    cancelled: 'badge-error',
  };

  // Generate activity feed
  const activities = [
    ...recentBookings.map(b => ({
      text: `New booking from ${b.customerName} (${b.city}) — ${b.items.length} items`,
      time: new Date(b.createdAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      color: b.status === 'completed' ? '#10B981' : b.status === 'cancelled' ? '#BA1A1A' : '#F59E0B',
    })),
  ].slice(0, 5);

  return (
    <>
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1>Dashboard</h1>
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px' }}>{currentTime}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/admin/products" className="btn btn-primary btn-sm">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
            Add Product
          </Link>
          <Link href="/admin/bookings" className="btn btn-secondary btn-sm">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>receipt_long</span>
            View Bookings
          </Link>
        </div>
      </div>

      {/* Revenue Card */}
      <div className="admin-revenue-card">
        <h3>Total Revenue</h3>
        <div className="revenue-amount">₹{totalRevenue.toLocaleString('en-IN')}</div>
        <div className="revenue-breakdown">
          <div className="revenue-item">
            <span>Items Sold</span>
            <span>{soldProducts.length}</span>
          </div>
          <div className="revenue-item">
            <span>Avg Order Value</span>
            <span>₹{avgOrderValue.toLocaleString('en-IN')}</span>
          </div>
          <div className="revenue-item">
            <span>Active Trials</span>
            <span>{stats.outForTrial}</span>
          </div>
          <div className="revenue-item">
            <span>Conversion Rate</span>
            <span>{stats.totalBookings > 0 ? Math.round((soldProducts.length / (stats.totalBookings || 1)) * 100) : 0}%</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-quick-actions">
        <Link href="/admin/products" className="admin-quick-action">
          <div className="action-icon" style={{ background: 'rgba(148,46,2,0.08)' }}>
            <span className="material-symbols-outlined" style={{ color: '#942E02' }}>add_circle</span>
          </div>
          <div className="action-label">New Product</div>
        </Link>
        <Link href="/admin/bookings" className="admin-quick-action">
          <div className="action-icon" style={{ background: 'rgba(0,86,133,0.08)' }}>
            <span className="material-symbols-outlined" style={{ color: '#005685' }}>event_note</span>
          </div>
          <div className="action-label">Manage Bookings</div>
        </Link>
        <Link href="/admin/inventory" className="admin-quick-action">
          <div className="action-icon" style={{ background: 'rgba(245,158,11,0.08)' }}>
            <span className="material-symbols-outlined" style={{ color: '#F59E0B' }}>warehouse</span>
          </div>
          <div className="action-label">Check Inventory</div>
        </Link>
        <Link href="/" className="admin-quick-action" target="_blank">
          <div className="action-icon" style={{ background: 'rgba(16,185,129,0.08)' }}>
            <span className="material-symbols-outlined" style={{ color: '#10B981' }}>visibility</span>
          </div>
          <div className="action-label">View Live Site</div>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {statCards.map((stat, i) => (
          <div key={i} className="admin-stat-card">
            <div style={{
              width: '40px', height: '40px', borderRadius: 'var(--radius-lg)',
              background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '0.5rem',
            }}>
              <span className="material-symbols-outlined" style={{ color: stat.color, fontSize: '22px' }}>{stat.icon}</span>
            </div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Alerts/Insights Row */}
      {(lowImageProducts > 0 || stats.returnedPending > 0) && (
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)',
          marginTop: 'var(--space-xl)',
        }}>
          {lowImageProducts > 0 && (
            <div style={{
              background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: 'var(--radius-xl)', padding: 'var(--space-lg)',
              display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
            }}>
              <span className="material-symbols-outlined" style={{ color: '#F59E0B', fontSize: '24px' }}>photo_camera</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '0.125rem' }}>{lowImageProducts} products without photos</div>
                <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>Add images to improve trial conversion.</div>
              </div>
              <Link href="/admin/products" style={{ marginLeft: 'auto', color: '#F59E0B', fontSize: '13px', fontWeight: 500 }}>Fix →</Link>
            </div>
          )}
          {stats.returnedPending > 0 && (
            <div style={{
              background: 'rgba(186,26,26,0.08)', border: '1px solid rgba(186,26,26,0.2)',
              borderRadius: 'var(--radius-xl)', padding: 'var(--space-lg)',
              display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
            }}>
              <span className="material-symbols-outlined" style={{ color: '#BA1A1A', fontSize: '24px' }}>warning</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '0.125rem' }}>{stats.returnedPending} items pending inspection</div>
                <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>Review returned items and restock.</div>
              </div>
              <Link href="/admin/inventory" style={{ marginLeft: 'auto', color: '#BA1A1A', fontSize: '13px', fontWeight: 500 }}>Review →</Link>
            </div>
          )}
        </div>
      )}

      {/* Two-column layout: Recent Bookings + Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-xl)', marginTop: 'var(--space-xl)' }}>
        {/* Recent Bookings */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem' }}>Recent Bookings</h2>
            <Link href="/admin/bookings" className="btn btn-ghost btn-sm" style={{ fontSize: '13px' }}>
              View All <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="admin-table-wrapper" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-outline)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'block' }}>event_busy</span>
              No bookings yet. They will appear here when customers book trials.
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Customer</th>
                    <th>City</th>
                    <th>Items</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map(b => (
                    <tr key={b.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '13px' }}>{b.id}</td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{b.customerName}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-outline)' }}>{b.customerPhone}</div>
                      </td>
                      <td><span className="badge badge-info">{b.city}</span></td>
                      <td style={{ fontWeight: 600 }}>{b.items.length}</td>
                      <td>
                        <span className={`badge ${STATUS_BADGE[b.status] || 'badge-neutral'}`}>
                          {b.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td style={{ fontSize: '13px', color: 'var(--color-outline)' }}>
                        {new Date(b.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Recent Activity</h2>
          <div style={{
            background: 'var(--color-surface-container-lowest)',
            border: '1px solid var(--color-outline-variant)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-lg)',
          }}>
            {activities.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--color-outline)', padding: 'var(--space-xl)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>history</span>
                No recent activity
              </div>
            ) : (
              <ul className="admin-activity-list">
                {activities.map((act, i) => (
                  <li key={i} className="admin-activity-item">
                    <div className="admin-activity-dot" style={{ background: act.color }} />
                    <span className="admin-activity-text">{act.text}</span>
                    <span className="admin-activity-time">{act.time}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quick Stats Mini */}
          <div style={{
            background: 'var(--color-surface-container-lowest)',
            border: '1px solid var(--color-outline-variant)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-lg)',
            marginTop: 'var(--space-md)',
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: 'var(--space-md)' }}>Catalog Health</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>Products with photos</span>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>
                  {products.filter(p => p.images && p.images.length > 0).length}/{products.length}
                </span>
              </div>
              <div style={{
                height: '6px', background: 'var(--color-surface-container)',
                borderRadius: 'var(--radius-full)', overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', borderRadius: 'var(--radius-full)',
                  background: 'var(--color-primary)',
                  width: `${products.length > 0 ? (products.filter(p => p.images && p.images.length > 0).length / products.length) * 100 : 0}%`,
                  transition: 'width 0.3s ease',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>Visible on site</span>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>
                  {products.filter(p => p.isVisible).length}/{products.length}
                </span>
              </div>
              <div style={{
                height: '6px', background: 'var(--color-surface-container)',
                borderRadius: 'var(--radius-full)', overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', borderRadius: 'var(--radius-full)',
                  background: '#10B981',
                  width: `${products.length > 0 ? (products.filter(p => p.isVisible).length / products.length) * 100 : 0}%`,
                  transition: 'width 0.3s ease',
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
