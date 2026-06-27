import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, max-age=0',
};

// GET /api/products/[id]
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data, error } = await supabaseAdmin.from('products').select('*').eq('id', id).maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: NO_STORE_HEADERS });
  }

  if (!data) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404, headers: NO_STORE_HEADERS });
  }

  return NextResponse.json(mapProduct(data), { headers: NO_STORE_HEADERS });
}

// PUT /api/products/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const updateData: Record<string, unknown> = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.category !== undefined) updateData.category = body.category;
  if (body.subcategory !== undefined) updateData.subcategory = body.subcategory;
  if (body.price !== undefined) updateData.price = body.price;
  if (body.originalPrice !== undefined) updateData.original_price = body.originalPrice;
  if (body.images !== undefined) updateData.images = body.images;
  if (body.size !== undefined) updateData.size = body.size;
  if (body.material !== undefined) updateData.material = body.material;
  if (body.careInstructions !== undefined) updateData.care_instructions = body.careInstructions;
  if (body.color !== undefined) updateData.color = body.color;
  if (body.pattern !== undefined) updateData.pattern = body.pattern;
  if (body.sku !== undefined) updateData.sku = body.sku;
  if (body.serialNumber !== undefined) updateData.serial_number = body.serialNumber;
  if (body.status !== undefined) updateData.status = body.status;
  if (body.cities !== undefined) updateData.cities = body.cities;
  if (body.isVisible !== undefined) updateData.is_visible = body.isVisible;

  const { data, error } = await supabaseAdmin
    .from('products')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: NO_STORE_HEADERS });
  }

  return NextResponse.json(mapProduct(data), { headers: NO_STORE_HEADERS });
}

// DELETE /api/products/[id]
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error } = await supabaseAdmin.from('products').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: NO_STORE_HEADERS });
  }

  return NextResponse.json({ success: true }, { headers: NO_STORE_HEADERS });
}

function mapProduct(row: Record<string, unknown>) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    subcategory: row.subcategory,
    price: Number(row.price),
    originalPrice: Number(row.original_price),
    images: row.images || [],
    size: row.size,
    material: row.material,
    careInstructions: row.care_instructions,
    color: row.color,
    pattern: row.pattern,
    sku: row.sku,
    serialNumber: row.serial_number,
    status: row.status,
    cities: row.cities || [],
    isVisible: row.is_visible,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
