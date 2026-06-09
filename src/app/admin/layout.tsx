'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { isAdminLoggedIn, adminLogout } from '@/lib/data/store';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setChecking(false);
      setAuthed(true); // Don't block login page
      return;
    }
    if (!isAdminLoggedIn()) {
      router.replace('/admin/login');
      // Don't set checking to false — keep showing loader until redirect completes
      return;
    }
    setAuthed(true);
    setChecking(false);
  }, [pathname, router]);

  if (pathname === '/admin/login') return <>{children}</>;

  if (checking || !authed) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--color-bg, #0F172A)',
        color: 'var(--color-text, #E2E8F0)',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }}></div>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted, #94A3B8)' }}>Loading admin panel...</p>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: '📊 Dashboard', exact: true },
    { href: '/admin/products', label: '📦 Products' },
    { href: '/admin/bookings', label: '📋 Bookings' },
    { href: '/admin/inventory', label: '📊 Inventory' },
  ];

  const handleLogout = () => {
    adminLogout();
    router.push('/admin/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          🧵 QuickLoom Admin
        </div>
        <ul className="admin-nav">
          {navItems.map(item => {
            const isActive = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`admin-nav-link ${isActive ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
          <Link href="/" className="admin-nav-link" target="_blank">
            🌐 View Website
          </Link>
          <button onClick={handleLogout} className="admin-nav-link" style={{ width: '100%', textAlign: 'left' }}>
            🚪 Logout
          </button>
        </div>
      </aside>

      <div className="admin-mobile-header">
        <span style={{ fontWeight: 700 }}>🧵 QuickLoom Admin</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                background: pathname === item.href || (!item.exact && pathname?.startsWith(item.href)) ? 'var(--color-primary)' : 'transparent',
                color: 'white',
              }}
            >
              {item.label.split(' ')[0]}
            </Link>
          ))}
        </div>
      </div>

      <div className="admin-content">
        {children}
      </div>
    </div>
  );
}
