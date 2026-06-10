-- QuickLoom Database Schema
-- Run this in Supabase SQL Editor (one time only)

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY DEFAULT ('prod-' || substr(md5(random()::text), 1, 8)),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT NOT NULL,
  subcategory TEXT DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  original_price NUMERIC NOT NULL DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  size TEXT DEFAULT '',
  material TEXT DEFAULT '',
  care_instructions TEXT DEFAULT '',
  color TEXT DEFAULT '',
  pattern TEXT DEFAULT '',
  sku TEXT NOT NULL DEFAULT '',
  serial_number TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'available',
  cities TEXT[] DEFAULT '{Gurgaon,Bhiwadi}',
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY DEFAULT ('BK-' || to_char(NOW(), 'YYYYMMDD') || '-' || substr(md5(random()::text), 1, 4)),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  preferred_slot TEXT NOT NULL,
  notes TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BOOKING ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS booking_items (
  id TEXT PRIMARY KEY DEFAULT ('BI-' || substr(md5(random()::text), 1, 8)),
  booking_id TEXT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  item_status TEXT NOT NULL DEFAULT 'reserved'
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_items ENABLE ROW LEVEL SECURITY;

-- Public can READ visible products
CREATE POLICY "Public can read visible products"
  ON products FOR SELECT
  USING (is_visible = true);

-- Service role can do everything on products
CREATE POLICY "Service role full access products"
  ON products FOR ALL
  USING (auth.role() = 'service_role');

-- Public can read bookings (needed for admin panel via service role)
CREATE POLICY "Service role full access bookings"
  ON bookings FOR ALL
  USING (auth.role() = 'service_role');

-- Allow anon to INSERT bookings (customers booking trials)
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

-- Service role full access booking items
CREATE POLICY "Service role full access booking_items"
  ON booking_items FOR ALL
  USING (auth.role() = 'service_role');

-- Allow anon to INSERT booking items (part of booking flow)
CREATE POLICY "Anyone can create booking items"
  ON booking_items FOR INSERT
  WITH CHECK (true);

-- Allow anon to read booking items (for admin via service role)
CREATE POLICY "Anyone can read booking items"
  ON booking_items FOR SELECT
  USING (true);

-- Allow anon to read all products (including hidden, for admin)
CREATE POLICY "Anon can read all products for admin"
  ON products FOR SELECT
  USING (true);

-- ============================================
-- STORAGE BUCKET
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to images
CREATE POLICY "Public read access on product-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Allow authenticated/service uploads
CREATE POLICY "Service role upload on product-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images');

-- Allow service role to delete images
CREATE POLICY "Service role delete on product-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images');

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_visible ON products(is_visible);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_booking_items_booking ON booking_items(booking_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
