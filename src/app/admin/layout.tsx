'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

function isAdminLoggedIn() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('ql_admin') === 'true';
}
function adminLogout() {
  localStorage.removeItem('ql_admin');
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setChecking(false);
      setAuthed(true);
      return;
    }
    if (!isAdminLoggedIn()) {
      router.replace('/admin/login');
      return;
    }
    setAuthed(true);
    setChecking(false);
  }, [pathname, router]);

  if (pathname === '/admin/login') return <>{children}</>;

  if (checking || !authed) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: 'var(--bg)', flexDirection: 'column', gap: 16,
      }}>
        <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Loading admin panel...</p>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: 'dashboard', exact: true },
    { href: '/admin/products', label: 'Products', icon: 'inventory_2' },
    { href: '/admin/bookings', label: 'Bookings', icon: 'event_note' },
    { href: '/admin/inventory', label: 'Inventory', icon: 'bar_chart' },
  ];

  const handleLogout = () => {
    adminLogout();
    router.push('/admin/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 260, background: 'var(--dark-bg)', color: 'var(--dark-text)',
        display: 'flex', flexDirection: 'column', padding: '24px 16px',
        position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 24px', borderBottom: '1px solid var(--dark-border)' }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'var(--accent)', transform: 'rotate(45deg)',
            display: 'grid', placeItems: 'center',
          }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: 'white' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'white' }}>QuickLoom</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'var(--dark-card)', color: 'var(--gold)', marginLeft: 'auto' }}>ADMIN</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 20, flex: 1 }}>
          {navItems.map(item => {
            const isActive = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                  fontSize: 14, fontWeight: 500, textDecoration: 'none',
                  color: isActive ? 'white' : 'var(--dark-text)',
                  background: isActive ? 'var(--accent)' : 'transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ borderTop: '1px solid var(--dark-border)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Link href="/" target="_blank" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 'var(--radius-sm)',
            fontSize: 14, fontWeight: 500, color: 'var(--dark-text)', textDecoration: 'none',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>language</span>
            View Website
          </Link>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 'var(--radius-sm)',
            fontSize: 14, fontWeight: 500, color: 'var(--dark-text)',
            background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ marginLeft: 260, flex: 1, padding: '32px 40px', minHeight: '100vh' }}>
        {children}
      </div>
    </div>
  );
}
