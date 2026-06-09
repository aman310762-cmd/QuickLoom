'use client';

import { Product, Booking, BookingItem, CartItem, InventoryStatus, BookingStatus, BookingItemStatus, Category } from '../types';
import { SEED_PRODUCTS } from './products';

const STORAGE_KEYS = {
  products: 'ql_products',
  bookings: 'ql_bookings',
  cart: 'ql_cart',
  adminAuth: 'ql_admin_auth',
  initialized: 'ql_initialized',
};

function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

export function initializeStore(): void {
  if (typeof window === 'undefined') return;
  const initialized = localStorage.getItem(STORAGE_KEYS.initialized);
  if (!initialized) {
    setToStorage(STORAGE_KEYS.products, SEED_PRODUCTS);
    setToStorage(STORAGE_KEYS.bookings, []);
    setToStorage(STORAGE_KEYS.cart, []);
    localStorage.setItem(STORAGE_KEYS.initialized, 'true');
  }
}

// ===== PRODUCTS =====
export function getAllProducts(): Product[] {
  return getFromStorage<Product[]>(STORAGE_KEYS.products, SEED_PRODUCTS);
}

export function getVisibleProducts(): Product[] {
  return getAllProducts().filter(p => p.isVisible && p.status === 'available');
}

export function getProductById(id: string): Product | undefined {
  return getAllProducts().find(p => p.id === id);
}

export function getProductsByCategory(category: Category): Product[] {
  return getVisibleProducts().filter(p => p.category === category);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return getVisibleProducts().filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.material.toLowerCase().includes(q) ||
    p.color.toLowerCase().includes(q) ||
    p.pattern.toLowerCase().includes(q)
  );
}

export function filterProducts(opts: {
  category?: Category;
  color?: string;
  priceMin?: number;
  priceMax?: number;
  size?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'newest';
}): Product[] {
  let products = opts.category ? getProductsByCategory(opts.category) : getVisibleProducts();

  if (opts.color) {
    products = products.filter(p => p.color.toLowerCase().includes(opts.color!.toLowerCase()));
  }
  if (opts.priceMin !== undefined) {
    products = products.filter(p => p.price >= opts.priceMin!);
  }
  if (opts.priceMax !== undefined) {
    products = products.filter(p => p.price <= opts.priceMax!);
  }
  if (opts.size) {
    products = products.filter(p => p.size.toLowerCase().includes(opts.size!.toLowerCase()));
  }

  if (opts.sortBy === 'price-asc') {
    products.sort((a, b) => a.price - b.price);
  } else if (opts.sortBy === 'price-desc') {
    products.sort((a, b) => b.price - a.price);
  } else if (opts.sortBy === 'newest') {
    products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return products;
}

export function getSimilarProducts(product: Product, limit = 4): Product[] {
  return getVisibleProducts()
    .filter(p => p.id !== product.id && (p.category === product.category || p.color === product.color))
    .slice(0, limit);
}

export function createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
  const products = getAllProducts();
  const newProduct: Product = {
    ...product,
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  products.push(newProduct);
  setToStorage(STORAGE_KEYS.products, products);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | undefined {
  const products = getAllProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return undefined;
  products[idx] = { ...products[idx], ...updates, updatedAt: new Date().toISOString() };
  setToStorage(STORAGE_KEYS.products, products);
  return products[idx];
}

export function deleteProduct(id: string): boolean {
  const products = getAllProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return false;
  setToStorage(STORAGE_KEYS.products, filtered);
  return true;
}

export function updateProductStatus(id: string, status: InventoryStatus): Product | undefined {
  return updateProduct(id, { status });
}

// ===== CART =====
export function getCart(): CartItem[] {
  return getFromStorage<CartItem[]>(STORAGE_KEYS.cart, []);
}

export function getCartProducts(): Product[] {
  const cart = getCart();
  const allProducts = getAllProducts();
  return cart.map(c => allProducts.find(p => p.id === c.productId)).filter(Boolean) as Product[];
}

export function addToCart(productId: string): { success: boolean; message: string } {
  const cart = getCart();
  if (cart.length >= 10) {
    return { success: false, message: 'Maximum 10 items allowed in trial cart' };
  }
  if (cart.find(c => c.productId === productId)) {
    return { success: false, message: 'Item already in trial cart' };
  }
  const product = getProductById(productId);
  if (!product || product.status !== 'available') {
    return { success: false, message: 'Product is not available' };
  }
  cart.push({ productId, addedAt: new Date().toISOString() });
  setToStorage(STORAGE_KEYS.cart, cart);
  return { success: true, message: 'Added to trial cart!' };
}

export function removeFromCart(productId: string): void {
  const cart = getCart().filter(c => c.productId !== productId);
  setToStorage(STORAGE_KEYS.cart, cart);
}

export function clearCart(): void {
  setToStorage(STORAGE_KEYS.cart, []);
}

export function getCartCount(): number {
  return getCart().length;
}

export function isInCart(productId: string): boolean {
  return getCart().some(c => c.productId === productId);
}

// ===== BOOKINGS =====
export function getAllBookings(): Booking[] {
  return getFromStorage<Booking[]>(STORAGE_KEYS.bookings, []);
}

export function getBookingById(id: string): Booking | undefined {
  return getAllBookings().find(b => b.id === id);
}

export function createBooking(data: {
  customerName: string;
  customerPhone: string;
  city: string;
  address: string;
  preferredSlot: string;
  notes: string;
}): Booking {
  const cart = getCart();
  const bookingId = `BK-${Date.now()}`;
  const items: BookingItem[] = cart.map((c, i) => ({
    id: `BI-${Date.now()}-${i}`,
    bookingId,
    productId: c.productId,
    itemStatus: 'reserved' as BookingItemStatus,
  }));

  // Reserve all products
  cart.forEach(c => {
    updateProductStatus(c.productId, 'reserved');
  });

  const booking: Booking = {
    id: bookingId,
    ...data,
    status: 'pending',
    items,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const bookings = getAllBookings();
  bookings.push(booking);
  setToStorage(STORAGE_KEYS.bookings, bookings);

  // Clear cart
  clearCart();

  return booking;
}

export function updateBookingStatus(id: string, status: BookingStatus): Booking | undefined {
  const bookings = getAllBookings();
  const idx = bookings.findIndex(b => b.id === id);
  if (idx === -1) return undefined;

  bookings[idx].status = status;
  bookings[idx].updatedAt = new Date().toISOString();

  if (status === 'out_for_trial') {
    bookings[idx].items.forEach(item => {
      item.itemStatus = 'out_for_trial';
      updateProductStatus(item.productId, 'out_for_trial');
    });
  }

  if (status === 'cancelled') {
    bookings[idx].items.forEach(item => {
      if (item.itemStatus !== 'bought') {
        item.itemStatus = 'returned';
        updateProductStatus(item.productId, 'available');
      }
    });
  }

  setToStorage(STORAGE_KEYS.bookings, bookings);
  return bookings[idx];
}

export function updateBookingItemStatus(bookingId: string, itemId: string, status: BookingItemStatus): Booking | undefined {
  const bookings = getAllBookings();
  const bIdx = bookings.findIndex(b => b.id === bookingId);
  if (bIdx === -1) return undefined;

  const iIdx = bookings[bIdx].items.findIndex(i => i.id === itemId);
  if (iIdx === -1) return undefined;

  bookings[bIdx].items[iIdx].itemStatus = status;
  bookings[bIdx].updatedAt = new Date().toISOString();

  // Update product status based on item status
  const productId = bookings[bIdx].items[iIdx].productId;
  if (status === 'bought') {
    updateProductStatus(productId, 'sold');
  } else if (status === 'returned') {
    updateProductStatus(productId, 'returned_pending');
  } else if (status === 'damaged') {
    updateProductStatus(productId, 'damaged');
  }

  // Check if all items are resolved
  const allResolved = bookings[bIdx].items.every(i =>
    ['bought', 'returned', 'damaged'].includes(i.itemStatus)
  );
  if (allResolved) {
    bookings[bIdx].status = 'completed';
  }

  setToStorage(STORAGE_KEYS.bookings, bookings);
  return bookings[bIdx];
}

export function restockProduct(productId: string): Product | undefined {
  return updateProduct(productId, { status: 'available' });
}

// ===== ADMIN AUTH =====
const ADMIN_USERNAME = 'Aman2030';
const ADMIN_PASSWORD = '6375625863';

export function adminLogin(username: string, password: string): boolean {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    setToStorage(STORAGE_KEYS.adminAuth, { loggedIn: true, loginAt: new Date().toISOString() });
    return true;
  }
  return false;
}

export function isAdminLoggedIn(): boolean {
  const auth = getFromStorage<{ loggedIn: boolean } | null>(STORAGE_KEYS.adminAuth, null);
  return auth?.loggedIn === true;
}

export function adminLogout(): void {
  setToStorage(STORAGE_KEYS.adminAuth, { loggedIn: false });
}

// ===== STATS =====
export function getAdminStats() {
  const products = getAllProducts();
  const bookings = getAllBookings();
  return {
    totalProducts: products.length,
    availableProducts: products.filter(p => p.status === 'available').length,
    reservedProducts: products.filter(p => p.status === 'reserved').length,
    outForTrial: products.filter(p => p.status === 'out_for_trial').length,
    soldProducts: products.filter(p => p.status === 'sold').length,
    returnedPending: products.filter(p => p.status === 'returned_pending').length,
    damagedProducts: products.filter(p => p.status === 'damaged').length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    activeBookings: bookings.filter(b => ['confirmed', 'out_for_trial'].includes(b.status)).length,
    completedBookings: bookings.filter(b => b.status === 'completed').length,
  };
}
