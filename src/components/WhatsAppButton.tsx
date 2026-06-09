'use client';

import { usePathname } from 'next/navigation';

export function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <a
      href="https://wa.me/919315807233"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-btn"
      aria-label="Chat on WhatsApp"
    >
      💬
    </a>
  );
}
