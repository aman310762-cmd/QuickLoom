import { Product, Booking } from '@/lib/types';

const BASE = '';

// ============================================
// PRODUCTS
// ============================================
export async function fetchAllProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE}/api/products`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchVisibleProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE}/api/products?visible=true`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  const res = await fetch(`${BASE}/api/products?category=${category}&visible=true`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const res = await fetch(`${BASE}/api/products/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function createProduct(data: Partial<Product>): Promise<Product | null> {
  const res = await fetch(`${BASE}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product | null> {
  const res = await fetch(`${BASE}/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function deleteProduct(id: string): Promise<boolean> {
  const res = await fetch(`${BASE}/api/products/${id}`, { method: 'DELETE' });
  return res.ok;
}

// ============================================
// BOOKINGS
// ============================================
export async function fetchAllBookings(): Promise<Booking[]> {
  const res = await fetch(`${BASE}/api/bookings`);
  if (!res.ok) return [];
  return res.json();
}

export async function createBooking(data: {
  customerName: string;
  customerPhone: string;
  city: string;
  address: string;
  preferredSlot: string;
  notes: string;
  productIds: string[];
}): Promise<{ id: string; success: boolean } | null> {
  const res = await fetch(`${BASE}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function updateBookingStatus(bookingId: string, status: string): Promise<boolean> {
  const res = await fetch(`${BASE}/api/bookings/${bookingId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return res.ok;
}

export async function updateBookingItemStatus(bookingId: string, itemId: string, itemStatus: string): Promise<boolean> {
  const res = await fetch(`${BASE}/api/bookings/${bookingId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId, itemStatus }),
  });
  return res.ok;
}

// ============================================
// ADMIN STATS
// ============================================
export async function fetchAdminStats() {
  const res = await fetch(`${BASE}/api/admin/stats`);
  if (!res.ok) return null;
  return res.json();
}

// ============================================
// CART (stays in localStorage — per-user data)
// ============================================
const CART_KEY = 'quickloom_cart';
const MAX_CART = 10;

function getCartItems(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveCartItems(items: string[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function getCartProductIds(): string[] {
  return getCartItems();
}

export function getCartCount(): number {
  return getCartItems().length;
}

export function isInCart(productId: string): boolean {
  return getCartItems().includes(productId);
}

export function addToCart(productId: string): { success: boolean; message: string } {
  const items = getCartItems();
  if (items.includes(productId)) {
    return { success: false, message: 'Already in cart' };
  }
  if (items.length >= MAX_CART) {
    return { success: false, message: `Cart limit reached (max ${MAX_CART} items)` };
  }
  items.push(productId);
  saveCartItems(items);
  return { success: true, message: 'Added to cart' };
}

export function removeFromCart(productId: string) {
  const items = getCartItems().filter(id => id !== productId);
  saveCartItems(items);
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}

// Fetch full product details for cart items
export async function getCartProducts(): Promise<Product[]> {
  const ids = getCartItems();
  if (ids.length === 0) return [];

  const products = await fetchAllProducts();
  return products.filter(p => ids.includes(p.id));
}
