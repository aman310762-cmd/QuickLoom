import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/bookings
export async function GET() {
  const { data: bookings, error } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fetch all booking items
  const bookingIds = (bookings || []).map(b => b.id);
  const { data: items } = await supabaseAdmin
    .from('booking_items')
    .select('*')
    .in('booking_id', bookingIds.length > 0 ? bookingIds : ['none']);

  const result = (bookings || []).map(b => ({
    id: b.id,
    customerName: b.customer_name,
    customerPhone: b.customer_phone,
    city: b.city,
    address: b.address,
    preferredSlot: b.preferred_slot,
    notes: b.notes || '',
    status: b.status,
    items: (items || [])
      .filter(i => i.booking_id === b.id)
      .map(i => ({
        id: i.id,
        bookingId: i.booking_id,
        productId: i.product_id,
        itemStatus: i.item_status,
      })),
    createdAt: b.created_at,
    updatedAt: b.updated_at,
  }));

  return NextResponse.json(result);
}

// POST /api/bookings — create a booking
export async function POST(request: NextRequest) {
  const body = await request.json();

  // Create booking
  const { data: booking, error: bookingError } = await supabaseAdmin
    .from('bookings')
    .insert({
      customer_name: body.customerName,
      customer_phone: body.customerPhone,
      city: body.city,
      address: body.address,
      preferred_slot: body.preferredSlot,
      notes: body.notes || '',
      status: 'pending',
    })
    .select()
    .single();

  if (bookingError || !booking) {
    return NextResponse.json({ error: bookingError?.message || 'Failed to create booking' }, { status: 500 });
  }

  // Create booking items
  if (body.productIds && body.productIds.length > 0) {
    const itemsToInsert = body.productIds.map((pid: string) => ({
      booking_id: booking.id,
      product_id: pid,
      item_status: 'reserved',
    }));

    const { error: itemsError } = await supabaseAdmin.from('booking_items').insert(itemsToInsert);

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    // Update product status to reserved
    await supabaseAdmin
      .from('products')
      .update({ status: 'reserved' })
      .in('id', body.productIds);
  }

  return NextResponse.json({ id: booking.id, success: true });
}
