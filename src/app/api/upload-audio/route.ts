// src/app/api/upload-audio/route.ts
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

// Map of file extensions to content types
const contentTypeMap: Record<string, string> = {
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  m4a: 'audio/mp4',
  aac: 'audio/aac',
  // Add more as needed
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Get file extension and determine content type
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    const contentType = contentTypeMap[fileExt] || 'audio/mpeg';
    
    // Generate unique filename with timestamp and random string
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    const filename = `audio-${timestamp}-${randomString}.${fileExt}`;
    
    console.log(`Uploading file: ${filename} with content type: ${contentType}`);
    
    // Upload to Vercel Blob with explicit content type
    const { url } = await put(filename, file, {
      access: 'public',
      contentType: contentType,
      addRandomSuffix: false,
      cacheControl: 'public, max-age=31536000',
    });
    
    return NextResponse.json({
      success: true,
      url: url,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: `Upload failed: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};