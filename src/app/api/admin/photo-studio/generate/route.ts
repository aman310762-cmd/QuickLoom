import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, STORAGE_BUCKET, getPublicImageUrl } from '@/lib/supabase';

const FAL_BACKGROUND_REMOVE_MODEL = 'fal-ai/bria/background/remove';
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
    name: 'Clean White Studio',
    background: '#f8f7f2',
    shadow: '0 34px 44px rgba(52, 43, 34, 0.18)',
    surface: '#ffffff',
  },
  {
    name: 'Warm Catalog Neutral',
    background: '#eee7dc',
    shadow: '0 32px 40px rgba(80, 60, 42, 0.16)',
    surface: '#faf7f0',
  },
  {
    name: 'Soft Home Display',
    background: '#e3ece8',
    shadow: '0 36px 46px rgba(37, 69, 61, 0.16)',
    surface: '#f6f1e8',
  },
];

type FalQueueStart = {
  request_id?: string;
  status_url?: string;
  response_url?: string;
};

function pickFalImageUrl(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null;

  const data = payload as Record<string, unknown>;
  const directFields = ['image_url', 'url'];
  for (const field of directFields) {
    if (typeof data[field] === 'string') return data[field] as string;
  }

  const image = data.image;
  if (image && typeof image === 'object' && typeof (image as Record<string, unknown>).url === 'string') {
    return (image as Record<string, string>).url;
  }

  const images = data.images;
  if (Array.isArray(images) && images.length > 0) {
    const first = images[0];
    if (typeof first === 'string') return first;
    if (first && typeof first === 'object' && typeof (first as Record<string, unknown>).url === 'string') {
      return (first as Record<string, string>).url;
    }
  }

  return null;
}

async function startFalBackgroundRemoval(imageUrl: string, falKey: string): Promise<FalQueueStart> {
  const normalizedFalKey = falKey.trim().replace(/^["']|["']$/g, '');
  const response = await fetch(`https://queue.fal.run/${FAL_BACKGROUND_REMOVE_MODEL}`, {
    method: 'POST',
    headers: {
      Authorization: `Key ${normalizedFalKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image_url: imageUrl }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    if (response.status === 401 || errorText.toLowerCase().includes('invalid key')) {
      throw new Error('Fal rejected FAL_KEY. Copy the full API key from Fal Settings > API Keys. If Fal shows a key ID and secret, paste the full value, not only the ID.');
    }
    throw new Error(`Fal background removal failed to start: ${errorText || response.statusText}`);
  }

  return response.json();
}

async function waitForFalResult(start: FalQueueStart, falKey: string): Promise<unknown> {
  if (!start.status_url && !start.response_url) {
    throw new Error('Fal did not return a status URL or response URL.');
  }

  for (let attempt = 0; attempt < 36; attempt += 1) {
    const statusUrl = start.status_url || start.response_url;
    const statusResponse = await fetch(statusUrl as string, {
      headers: { Authorization: `Key ${falKey}` },
    });

    if (!statusResponse.ok) {
      const errorText = await statusResponse.text();
      throw new Error(`Fal status check failed: ${errorText || statusResponse.statusText}`);
    }

    const statusPayload = await statusResponse.json();
    const status = String(statusPayload.status || '').toUpperCase();

    if (status === 'COMPLETED' || (!status && (start.response_url || pickFalImageUrl(statusPayload)))) {
      const responseUrl = statusPayload.response_url || start.response_url || statusUrl;
      const resultResponse = await fetch(responseUrl, {
        headers: { Authorization: `Key ${falKey}` },
      });

      if (!resultResponse.ok) {
        const errorText = await resultResponse.text();
        throw new Error(`Fal result fetch failed: ${errorText || resultResponse.statusText}`);
      }

      return resultResponse.json();
    }

    if (status === 'FAILED' || status === 'ERROR') {
      throw new Error(`Fal background removal failed: ${JSON.stringify(statusPayload)}`);
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  throw new Error('Fal background removal timed out. Please try again.');
}

function createCatalogSvg(cutoutDataUri: string, index: number): Buffer {
  const style = VARIATION_STYLES[index] || VARIATION_STYLES[0];
  const gradientId = `bg-${index}`;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${OUTPUT_SIZE}" height="${OUTPUT_SIZE}" viewBox="0 0 ${OUTPUT_SIZE} ${OUTPUT_SIZE}" role="img" aria-label="${style.name} 4K catalog product output">
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

async function uploadCatalogVariation(cutoutDataUri: string, index: number): Promise<string> {
  const svgBuffer = createCatalogSvg(cutoutDataUri, index);
  const uniqueName = `photo-studio/generated/${Date.now()}-${index}-${Math.random().toString(36).substring(2, 8)}.svg`;

  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(uniqueName, svgBuffer, {
      contentType: 'image/svg+xml',
      upsert: false,
    });

  if (error) {
    throw new Error(`Storage upload failed for variation ${index + 1}: ${error.message}`);
  }

  return getPublicImageUrl(uniqueName);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const numVariations = Math.min(Math.max(Number(formData.get('numVariations')) || 3, 1), 3);

    if (!file) {
      return NextResponse.json({ error: 'No image file uploaded' }, { status: 400 });
    }

    const falKey = process.env.FAL_KEY?.trim().replace(/^["']|["']$/g, '');
    if (!falKey) {
      return NextResponse.json({ error: 'FAL_KEY environment variable is not configured' }, { status: 500 });
    }

    const originalBytes = await file.arrayBuffer();
    const originalBuffer = Buffer.from(originalBytes);
    const originalExt = file.name.split('.').pop() || 'jpg';
    const originalName = `photo-studio/original/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${originalExt}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(originalName, originalBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Failed to upload original image to Supabase storage:', uploadError);
      return NextResponse.json({ error: `Storage upload failed: ${uploadError.message}` }, { status: 500 });
    }

    const originalUrl = getPublicImageUrl(originalName);
    const falStart = await startFalBackgroundRemoval(originalUrl, falKey);
    const falResult = await waitForFalResult(falStart, falKey);
    const falCutoutUrl = pickFalImageUrl(falResult);

    if (!falCutoutUrl) {
      console.error('Fal returned no usable image URL:', falResult);
      return NextResponse.json({ error: 'Fal returned no background-removed image.' }, { status: 500 });
    }

    const cutoutResponse = await fetch(falCutoutUrl);
    if (!cutoutResponse.ok) {
      return NextResponse.json({ error: `Could not download Fal cutout: ${cutoutResponse.statusText}` }, { status: 500 });
    }

    const cutoutBuffer = Buffer.from(await cutoutResponse.arrayBuffer());
    const cutoutContentType = cutoutResponse.headers.get('content-type') || 'image/png';
    const cutoutName = `photo-studio/cutout/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.png`;
    const { error: cutoutUploadError } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(cutoutName, cutoutBuffer, {
        contentType: cutoutContentType,
        upsert: false,
      });

    if (cutoutUploadError) {
      console.error('Failed to upload background-removed image:', cutoutUploadError);
      return NextResponse.json({ error: `Cutout upload failed: ${cutoutUploadError.message}` }, { status: 500 });
    }

    const cutoutUrl = getPublicImageUrl(cutoutName);
    const cutoutDataUri = `data:${cutoutContentType};base64,${cutoutBuffer.toString('base64')}`;
    const urls = await Promise.all(
      Array.from({ length: numVariations }, (_, index) => uploadCatalogVariation(cutoutDataUri, index))
    );

    return NextResponse.json({
      cutoutUrl,
      originalUrl,
      urls,
      costNote: 'One paid Fal background-removal call was used. Catalog variations are composed in code.',
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('AI Photo Studio background cleanup error:', error);
    return NextResponse.json({ error: `Internal server error: ${errMsg}` }, { status: 500 });
  }
}
