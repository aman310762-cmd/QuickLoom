'use client';

import { useState, useCallback } from 'react';

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const ToastComponent = toast ? (
    <div className={`toast show ${toast.type}`}>
      {toast.type === 'success' ? '✓' : '✕'} {toast.message}
    </div>
  ) : null;

  return { showToast, ToastComponent };
}
