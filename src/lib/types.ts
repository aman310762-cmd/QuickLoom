export type InventoryStatus =
  | 'available'
  | 'reserved'
  | 'out_for_trial'
  | 'sold'
  | 'returned_pending'
  | 'restocked'
  | 'damaged';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'out_for_trial'
  | 'completed'
  | 'cancelled';

export type BookingItemStatus =
  | 'reserved'
  | 'out_for_trial'
  | 'bought'
  | 'returned'
  | 'damaged';

export type Category =
  | 'bedsheets'
  | 'curtains'
  | 'carpets'
  | 'rugs'
  | 'towels'
  | 'sofa-covers'
  | 'blankets'
  | 'mats'
  | 'dining-covers';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: Category;
  subcategory: string;
  price: number;
  originalPrice: number;
  images: string[];
  size: string;
  material: string;
  careInstructions: string;
  color: string;
  pattern: string;
  sku: string;
  serialNumber: string;
  status: InventoryStatus;
  cities: string[];
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  addedAt: string;
}

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  city: string;
  address: string;
  preferredSlot: string;
  notes: string;
  status: BookingStatus;
  items: BookingItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BookingItem {
  id: string;
  bookingId: string;
  productId: string;
  itemStatus: BookingItemStatus;
}

export const CATEGORIES: { slug: Category; name: string; description: string; icon: string }[] = [
  { slug: 'bedsheets', name: 'Bedsheets', description: 'Premium handloom bedsheets, quilts & dohars', icon: '🛏️' },
  { slug: 'curtains', name: 'Curtains', description: 'Handwoven curtains & drapes for every room', icon: '🪟' },
  { slug: 'carpets', name: 'Carpets', description: 'Artisan-made carpets for living spaces', icon: '🧶' },
  { slug: 'rugs', name: 'Rugs', description: 'Decorative handloom rugs & runners', icon: '🪢' },
  { slug: 'towels', name: 'Towels', description: 'Soft cotton & linen bath towels', icon: '🛁' },
  { slug: 'sofa-covers', name: 'Sofa Covers', description: 'Protective & stylish sofa & cushion covers', icon: '🛋️' },
  { slug: 'blankets', name: 'Blankets', description: 'Warm handloom blankets & throws', icon: '🧣' },
  { slug: 'mats', name: 'Mats', description: 'Doormats, bath mats & floor mats', icon: '🚪' },
  { slug: 'dining-covers', name: 'Dining Covers', description: 'Table covers, runners & napkins', icon: '🍽️' },
];

export const CITIES = ['Gurgaon', 'Bhiwadi'];

export const TIME_SLOTS = [
  '9:00 AM - 11:00 AM',
  '11:00 AM - 1:00 PM',
  '2:00 PM - 4:00 PM',
  '4:00 PM - 6:00 PM',
  '6:00 PM - 8:00 PM',
];
