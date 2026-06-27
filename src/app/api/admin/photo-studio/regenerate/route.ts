import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, STORAGE_BUCKET, getPublicImageUrl } from '@/lib/supabase';

const OUTPUT_SIZE = 4096;
const PRODUCT_BOX = {
  x: 512,
  y: 420,
  width: 3072,
  height: 3072,
};
const SHADOW = {
  cx: 2048,
  cy: 3440,
  rx: 1240,
  ry: 165,
};
const PRODUCT_PRESERVATION_BRIEF = [
  'ROLE: You are a senior e-commerce product photography retoucher for Indian handloom textiles.',
  'NON-NEGOTIABLE: Preserve the exact product, fabric color, weave, floral pattern, borders, scale, and shape.',
  'EDITING RULE: Only remove the messy background and presentation noise. Do not redraw, recolor, smooth, invent, or replace the textile.',
  'OUTPUT: Premium catalog-ready square image, clean background, natural soft shadow, product as the hero.',
].join(' ');
const VARIATION_STYLES = [
  {
    background: '#f8f7f2',
    shadow: '0 34px 44px rgba(52, 43, 34, 0.18)',
    surface: '#ffffff',
  },
  {
    background: '#eee7dc',
    shadow: '0 32px 40px rgba(80, 60, 42, 0.16)',
    surface: '#faf7f0',
  },
  {
    background: '#e3ece8',
    shadow: '0 36px 46px rgba(37, 69, 61, 0.16)',
    surface: '#f6f1e8',
  },
];

function createCatalogSvg(cutoutDataUri: string, index: number): Buffer {
  const style = VARIATION_STYLES[index] || VARIATION_STYLES[0];
  const gradientId = `bg-${index}`;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${OUTPUT_SIZE}" height="${OUTPUT_SIZE}" viewBox="0 0 ${OUTPUT_SIZE} ${OUTPUT_SIZE}" role="img" aria-label="4K catalog product output">
  <metadata>${PRODUCT_PRESERVATION_BRIEF}</metadata>
  <defs>
    <linearGradient id="${gradientId}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${style.surface}"/>
      <stop offset="100%" stop-color="${style.background}"/>
    </linearGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="28" stdDeviation="24" flood-color="rgba(0,0,0,0.20)"/>
    </filter>
  </defs>
  <rect width="${OUTPUT_SIZE}" height="${OUTPUT_SIZE}" fill="url(#${gradientId})"/>
  <ellipse cx="${SHADOW.cx}" cy="${SHADOW.cy}" rx="${SHADOW.rx}" ry="${SHADOW.ry}" fill="${style.shadow}"/>
  <image href="${cutoutDataUri}" x="${PRODUCT_BOX.x}" y="${PRODUCT_BOX.y}" width="${PRODUCT_BOX.width}" height="${PRODUCT_BOX.height}" preserveAspectRatio="xMidYMid meet" filter="url(#softShadow)"/>
</svg>`;

  return Buffer.from(svg, 'utf8');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cutoutUrl, index } = body;

    if (!cutoutUrl || typeof cutoutUrl !== 'string') {
      return NextResponse.json({ error: 'Background-removed image URL is required' }, { status: 400 });
    }

    if (index === undefined || index < 0 || index > 2) {
      return NextResponse.json({ error: 'Valid index (0, 1, or 2) is required' }, { status: 400 });
    }

    const cutoutResponse = await fetch(cutoutUrl);
    if (!cutoutResponse.ok) {
      return NextResponse.json({ error: `Could not download cleaned product image: ${cutoutResponse.statusText}` }, { status: 500 });
    }

    const cutoutBuffer = Buffer.from(await cutoutResponse.arrayBuffer());
    const cutoutContentType = cutoutResponse.headers.get('content-type') || 'image/png';
    const cutoutDataUri = `data:${cutoutContentType};base64,${cutoutBuffer.toString('base64')}`;
    const imgBuffer = createCatalogSvg(cutoutDataUri, index);
    const uniqueName = `photo-studio/generated/${Date.now()}-${index}-${Math.random().toString(36).substring(2, 8)}.svg`;

    const { error: uploadErr } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(uniqueName, imgBuffer, {
        contentType: 'image/svg+xml',
        upsert: false,
      });

    if (uploadErr) {
      console.error('Failed to upload regenerated catalog image to Supabase storage:', uploadErr);
      return NextResponse.json({ error: `Storage upload failed: ${uploadErr.message}` }, { status: 500 });
    }

    return NextResponse.json({ url: getPublicImageUrl(uniqueName) });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('AI Photo Studio regeneration error:', error);
    return NextResponse.json({ error: `Internal server error: ${errMsg}` }, { status: 500 });
  }
}
