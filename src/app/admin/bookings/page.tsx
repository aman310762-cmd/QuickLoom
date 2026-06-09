'use client';

import { useState, useEffect } from 'react';
import { getAllBookings, updateBookingStatus, updateBookingItemStatus, getProductById } from '@/lib/data/store';
import { Booking, BookingStatus, BookingItemStatus } from '@/lib/types';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setBookings(getAllBookings().reverse());
  }, []);

  const refresh = () => setBookings(getAllBookings().reverse());

  const filtered = filter
    ? bookings.filter(b => b.status === filter)
    : bookings;

  const STATUS_BADGE: Record<string, string> = {
    pending: 'badge-warning',
    confirmed: 'badge-info',
    out_for_trial: 'badge-primary',
    completed: 'badge-success',
    cancelled: 'badge-error',
  };

  const ITEM_STATUS_BADGE: Record<string, string> = {
    reserved: 'badge-neutral',
    out_for_trial: 'badge-primary',
    bought: 'badge-success',
    returned: 'badge-warning',
    damaged: 'badge-error',
  };

  const handleStatusChange = (bookingId: string, status: BookingStatus) => {
    updateBookingStatus(bookingId, status);
    refresh();
  };

  const handleItemStatusChange = (bookingId: string, itemId: string, status: BookingItemStatus) => {
    updateBookingItemStatus(bookingId, itemId, status);
    refresh();
  };

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Bookings</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>{bookings.length} total bookings</p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <label>Status</label>
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="out_for_trial">Out for Trial</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ alignSelf: 'flex-end', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          Showing {filtered.length} bookings
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-table-wrapper" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          {bookings.length === 0 ? 'No bookings yet.' : 'No bookings match this filter.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(booking => {
            const isExpanded = expanded === booking.id;
            return (
              <div key={booking.id} className="admin-table-wrapper" style={{ overflow: 'visible' }}>
                <div
                  style={{
                    padding: '1rem 1.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap',
                  }}
                  onClick={() => setExpanded(isExpanded ? null : booking.id)}
                >
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, minWidth: '140px' }}>
                    {booking.id}
                  </span>
                  <span style={{ flex: 1 }}>
                    <strong>{booking.customerName}</strong>
                    <span style={{ color: 'var(--color-text-muted)', marginLeft: '0.5rem' }}>
                      {booking.customerPhone}
                    </span>
                  </span>
                  <span className="badge badge-info">{booking.city}</span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    {booking.items.length} items
                  </span>
                  <span className={`badge ${STATUS_BADGE[booking.status]}`}>
                    {booking.status.replace(/_/g, ' ')}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </span>
                  <span style={{ fontSize: '1.25rem' }}>{isExpanded ? '▲' : '▼'}</span>
                </div>

                {isExpanded && (
                  <div style={{ padding: '0 1.5rem 1.5rem', borderTop: '1px solid var(--color-border-light)' }}>
                    {/* Booking Details */}
                    <div style={{
                      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '1rem', marginTop: '1rem', marginBottom: '1.5rem',
                      padding: '1rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)',
                    }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Address</div>
                        <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{booking.address}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Time Slot</div>
                        <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{booking.preferredSlot}</div>
                      </div>
                      {booking.notes && (
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Notes</div>
                          <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{booking.notes}</div>
                        </div>
                      )}
                    </div>

                    {/* Booking Status Actions */}
                    <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.813rem', fontWeight: 600, alignSelf: 'center', marginRight: '0.5rem' }}>
                        Update Booking:
                      </span>
                      {(['pending', 'confirmed', 'out_for_trial', 'completed', 'cancelled'] as BookingStatus[]).map(s => (
                        <button
                          key={s}
                          className={`btn btn-sm ${booking.status === s ? 'btn-primary' : 'btn-ghost'}`}
                          onClick={() => handleStatusChange(booking.id, s)}
                          style={{ fontSize: '0.75rem' }}
                        >
                          {s.replace(/_/g, ' ')}
                        </button>
                      ))}
                    </div>

                    {/* Items */}
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Trial Items</h3>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>SKU</th>
                          <th>Price</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {booking.items.map(item => {
                          const product = getProductById(item.productId);
                          return (
                            <tr key={item.id}>
                              <td>
                                <div style={{ fontWeight: 500, maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {product?.name || 'Unknown Product'}
                                </div>
                              </td>
                              <td style={{ fontFamily: 'monospace', fontSize: '0.813rem' }}>
                                {product?.sku || '-'}
                              </td>
                              <td style={{ fontWeight: 600 }}>₹{product?.price.toLocaleString() || '-'}</td>
                              <td>
                                <span className={`badge ${ITEM_STATUS_BADGE[item.itemStatus]}`}>
                                  {item.itemStatus.replace(/_/g, ' ')}
                                </span>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                                  {(['bought', 'returned', 'damaged'] as BookingItemStatus[]).map(s => (
                                    <button
                                      key={s}
                                      className={`btn btn-sm ${item.itemStatus === s
                                        ? (s === 'bought' ? 'btn-success' : s === 'damaged' ? 'btn-danger' : 'btn-accent')
                                        : 'btn-ghost'
                                      }`}
                                      onClick={() => handleItemStatusChange(booking.id, item.id, s)}
                                      style={{ fontSize: '0.688rem', padding: '0.25rem 0.5rem' }}
                                    >
                                      {s === 'bought' ? '💰 Bought' : s === 'returned' ? '↩️ Returned' : '⚠️ Damaged'}
                                    </button>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
