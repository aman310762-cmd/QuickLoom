import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, STORAGE_BUCKET, getPublicImageUrl } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const urls: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const ext = file.name.split('.').pop() || 'jpg';
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

      // Upload to Supabase Storage
      const { error } = await supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .upload(uniqueName, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        console.error('Storage upload error:', error);
        continue;
      }

      // Get the public URL
      const publicUrl = getPublicImageUrl(uniqueName);
      urls.push(publicUrl);
    }

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
