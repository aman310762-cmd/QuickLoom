import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { SEED_PRODUCTS } from '@/lib/data/products';

// POST /api/seed — seed initial products (run once)
export async function POST() {
  try {
    // Check if products already exist
    const { count } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (count && count > 0) {
      return NextResponse.json({
        message: `Database already has ${count} products. Skipping seed.`,
        seeded: false,
      });
    }

    // Insert seed products
    const rows = SEED_PRODUCTS.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.category,
      subcategory: p.subcategory,
      price: p.price,
      original_price: p.originalPrice,
      images: p.images,
      size: p.size,
      material: p.material,
      care_instructions: p.careInstructions,
      color: p.color,
      pattern: p.pattern,
      sku: p.sku,
      serial_number: p.serialNumber,
      status: p.status,
      cities: p.cities,
      is_visible: p.isVisible,
    }));

    const { error } = await supabaseAdmin.from('products').insert(rows);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: `Seeded ${rows.length} products successfully!`,
      seeded: true,
      count: rows.length,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
