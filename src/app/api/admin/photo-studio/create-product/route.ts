import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, approvedUrls } = body;

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    if (!approvedUrls || !Array.isArray(approvedUrls) || approvedUrls.length === 0) {
      return NextResponse.json({ error: 'At least one approved image URL is required' }, { status: 400 });
    }

    const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
    const uniqueSuffix = Date.now().toString().slice(-6);

    const { data, error } = await supabaseAdmin.from('products').insert({
      name: `Draft ${categoryLabel} (Cleaned Photo)`,
      description: 'Draft product created from AI Photo Cleanup. Please add price and details.',
      category: category,
      price: 0,
      original_price: 0,
      images: approvedUrls,
      sku: `QL-AI-${uniqueSuffix}`,
      serial_number: `QL-AI-${uniqueSuffix}-S1`,
      status: 'available',
      is_visible: false, // Set to false to act as a "draft" (hidden from public catalog)
    }).select().single();

    if (error) {
      console.error('Failed to insert draft product:', error);
      return NextResponse.json({ error: `Database insertion failed: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ productId: data.id });

  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('AI Photo Studio create-product error:', error);
    return NextResponse.json({ error: `Internal server error: ${errMsg}` }, { status: 500 });
  }
}
