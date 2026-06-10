import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const { data: products } = await supabaseAdmin.from('products').select('status');
  const { data: bookings } = await supabaseAdmin.from('bookings').select('status');

  const allProducts = products || [];
  const allBookings = bookings || [];

  const stats = {
    totalProducts: allProducts.length,
    availableProducts: allProducts.filter(p => p.status === 'available').length,
    reservedProducts: allProducts.filter(p => p.status === 'reserved').length,
    outForTrial: allProducts.filter(p => p.status === 'out_for_trial').length,
    soldProducts: allProducts.filter(p => p.status === 'sold').length,
    returnedPending: allProducts.filter(p => p.status === 'returned_pending').length,
    damagedProducts: allProducts.filter(p => p.status === 'damaged').length,
    totalBookings: allBookings.length,
    activeBookings: allBookings.filter(b => !['completed', 'cancelled'].includes(b.status)).length,
  };

  return NextResponse.json(stats);
}
