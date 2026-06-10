import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/products — fetch all products
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const visibleOnly = searchParams.get('visible') === 'true';

  let query = supabaseAdmin.from('products').select('*').order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }
  if (visibleOnly) {
    query = query.eq('is_visible', true);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map snake_case DB columns to camelCase for frontend
  const products = (data || []).map(mapProduct);
  return NextResponse.json(products);
}

// POST /api/products — create a product
export async function POST(request: NextRequest) {
  const body = await request.json();

  const { data, error } = await supabaseAdmin.from('products').insert({
    name: body.name,
    description: body.description || '',
    category: body.category,
    subcategory: body.subcategory || '',
    price: body.price,
    original_price: body.originalPrice || body.price,
    images: body.images || [],
    size: body.size || '',
    material: body.material || '',
    care_instructions: body.careInstructions || '',
    color: body.color || '',
    pattern: body.pattern || '',
    sku: body.sku,
    serial_number: body.serialNumber || '',
    status: body.status || 'available',
    cities: body.cities || ['Gurgaon', 'Bhiwadi'],
    is_visible: body.isVisible !== false,
  }).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(mapProduct(data));
}

// Helper: map DB row to frontend shape
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
