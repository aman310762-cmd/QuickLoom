'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchAdminStats, fetchAllBookings, fetchAllProducts, fetchProductById } from '@/lib/api';
import { Booking, Product } from '@/lib/types';
import { exportProductsToExcel, exportBookingsToExcel, exportInventoryToExcel, exportFullReportToExcel } from '@/lib/exportExcel';

export default function AdminDashboard() {
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const load = async () => {
      const [s, b, p] = await Promise.all([
        fetchAdminStats(),
        fetchAllBookings(),
        fetchAllProducts(),
      ]);
      setStats(s);
      setAllBookings(b);
      setRecentBookings(b.slice(0, 5));
      setProducts(p);
      setCurrentTime(new Date().toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      }));
    };
    load();
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
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{currentTime}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link href="/admin/products" className="btn btn-primary btn-sm">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
            Add Product
          </Link>
          <Link href="/admin/bookings" className="btn btn-secondary btn-sm">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>receipt_long</span>
            View Bookings
          </Link>
          <button
            className="btn btn-sm"
            onClick={async () => {
              const bookings = await fetchAllBookings();
              const getProduct = async (id: string) => {
                const p = products.find(pr => pr.id === id);
                return p || (await fetchProductById(id)) || undefined;
              };
              // Build a sync lookup for the export function
              const lookup = (id: string) => products.find(p => p.id === id);
              exportFullReportToExcel(products, bookings, lookup);
            }}
            style={{ background: '#10B981', color: 'white', border: 'none' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span>
            Export Full Report
          </button>
        </div>
      </div>

      {/* Revenue Card */}
      <div style={{ background: 'var(--accent)', borderRadius: 'var(--radius-xl)', padding: 28, color: 'white', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, oklch(1 0 0 / 0.05) 0 14px, transparent 14px 28px)', pointerEvents: 'none' }} />
        <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.8, position: 'relative' }}>Total Revenue</h3>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 40, position: 'relative', marginTop: 4 }}>₹{totalRevenue.toLocaleString('en-IN')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 20, position: 'relative' }}>
          <div style={{ padding: '10px 14px', background: 'oklch(1 0 0 / 0.12)', borderRadius: 'var(--radius-md)' }}>
            <span>Items Sold</span>
            <span>{soldProducts.length}</span>
          </div>
          <div style={{ padding: '10px 14px', background: 'oklch(1 0 0 / 0.12)', borderRadius: 'var(--radius-md)' }}>
            <span>Avg Order Value</span>
            <span>₹{avgOrderValue.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ padding: '10px 14px', background: 'oklch(1 0 0 / 0.12)', borderRadius: 'var(--radius-md)' }}>
            <span>Active Trials</span>
            <span>{stats.outForTrial}</span>
          </div>
          <div style={{ padding: '10px 14px', background: 'oklch(1 0 0 / 0.12)', borderRadius: 'var(--radius-md)' }}>
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
        <button className="admin-quick-action" onClick={() => exportProductsToExcel(products)}>
          <div className="action-icon" style={{ background: 'rgba(99,102,241,0.08)' }}>
            <span className="material-symbols-outlined" style={{ color: '#6366F1' }}>table_chart</span>
          </div>
          <div className="action-label">Export Products</div>
        </button>
        <button className="admin-quick-action" onClick={async () => {
          const bookings = await fetchAllBookings();
          const lookup = (id: string) => products.find(p => p.id === id);
          exportBookingsToExcel(bookings, lookup);
        }}>
          <div className="action-icon" style={{ background: 'rgba(236,72,153,0.08)' }}>
            <span className="material-symbols-outlined" style={{ color: '#EC4899' }}>receipt</span>
          </div>
          <div className="action-label">Export Bookings</div>
        </button>
        <button className="admin-quick-action" onClick={() => exportInventoryToExcel(products)}>
          <div className="action-icon" style={{ background: 'rgba(14,165,233,0.08)' }}>
            <span className="material-symbols-outlined" style={{ color: '#0EA5E9' }}>inventory</span>
          </div>
          <div className="action-label">Export Inventory</div>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="admin-stat-grid">
        {statCards.map((stat, i) => (
          <div key={i} className="admin-stat-card">
            <div style={{
              width: 40, height: 40, borderRadius: 'var(--radius-md)',
              background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 8,
            }}>
              <span className="material-symbols-outlined" style={{ color: stat.color, fontSize: 22 }}>{stat.icon}</span>
            </div>
            <div className="admin-stat-label">{stat.label}</div>
            <div className="admin-stat-number" style={{ color: stat.color }}>{stat.value}</div>
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
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Add images to improve trial conversion.</div>
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
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Review returned items and restock.</div>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 }}>Recent Bookings</h2>
            <Link href="/admin/bookings" className="btn btn-sm">
              View All <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="ql-card" style={{ padding: 48, textAlign: 'center', color: 'var(--text-faint)', border: '1px solid var(--border)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 40, marginBottom: 8, display: 'block' }}>event_busy</span>
              No bookings yet
            </div>
          ) : (
            <div className="ql-card" style={{ overflow: 'hidden', border: '1px solid var(--border)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-alt)' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-faint)' }}>Booking ID</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-faint)' }}>Customer</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-faint)' }}>City</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-faint)' }}>Items</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-faint)' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-faint)' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map(b => (
                    <tr key={b.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 13 }}>{b.id}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 500 }}>{b.customerName}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-faint)' }}>{b.customerPhone}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}><span className="badge badge-info">{b.city}</span></td>
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>{b.items.length}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className={`badge ${STATUS_BADGE[b.status] || 'badge-neutral'}`}>
                          {b.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-faint)' }}>
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
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, marginBottom: 16 }}>Recent Activity</h2>
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-lg)',
          }}>
            {activities.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-faint)', padding: 'var(--space-xl)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>history</span>
                No recent activity
              </div>
            ) : (
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {activities.map((act, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: act.color, flexShrink: 0, marginTop: 5 }} />
                    <span style={{ flex: 1, color: 'var(--text-muted)', lineHeight: 1.5 }}>{act.text}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-faint)', whiteSpace: 'nowrap' }}>{act.time}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quick Stats Mini */}
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-lg)',
            marginTop: 'var(--space-md)',
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: 'var(--space-md)' }}>Catalog Health</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Products with photos</span>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>
                  {products.filter(p => p.images && p.images.length > 0).length}/{products.length}
                </span>
              </div>
              <div style={{
                height: '6px', background: 'var(--bg-alt)',
                borderRadius: 'var(--radius-full)', overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', borderRadius: 'var(--radius-full)',
                  background: 'var(--accent)',
                  width: `${products.length > 0 ? (products.filter(p => p.images && p.images.length > 0).length / products.length) * 100 : 0}%`,
                  transition: 'width 0.3s ease',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Visible on site</span>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>
                  {products.filter(p => p.isVisible).length}/{products.length}
                </span>
              </div>
              <div style={{
                height: '6px', background: 'var(--bg-alt)',
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
