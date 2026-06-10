import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// PUT /api/bookings/[id] — update booking status
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  // Update booking status
  if (body.status) {
    const { error } = await supabaseAdmin
      .from('bookings')
      .update({ status: body.status })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If booking is confirmed → set items to out_for_trial
    if (body.status === 'out_for_trial') {
      await supabaseAdmin
        .from('booking_items')
        .update({ item_status: 'out_for_trial' })
        .eq('booking_id', id);

      // Update products too
      const { data: items } = await supabaseAdmin
        .from('booking_items')
        .select('product_id')
        .eq('booking_id', id);

      if (items && items.length > 0) {
        await supabaseAdmin
          .from('products')
          .update({ status: 'out_for_trial' })
          .in('id', items.map(i => i.product_id));
      }
    }
  }

  // Update individual item status
  if (body.itemId && body.itemStatus) {
    const { error } = await supabaseAdmin
      .from('booking_items')
      .update({ item_status: body.itemStatus })
      .eq('id', body.itemId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update product status based on item status
    const { data: item } = await supabaseAdmin
      .from('booking_items')
      .select('product_id')
      .eq('id', body.itemId)
      .single();

    if (item) {
      let productStatus = 'available';
      if (body.itemStatus === 'bought') productStatus = 'sold';
      else if (body.itemStatus === 'returned') productStatus = 'returned_pending';
      else if (body.itemStatus === 'damaged') productStatus = 'damaged';

      await supabaseAdmin
        .from('products')
        .update({ status: productStatus })
        .eq('id', item.product_id);
    }
  }

  return NextResponse.json({ success: true });
}
