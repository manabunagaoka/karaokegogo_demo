// src/app/api/direct-upload/route.ts
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }
    
    // Generate a unique filename with timestamp
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'mp3';
    const uniqueFilename = `audio-${timestamp}.${fileExtension}`;
    
    // Upload directly to Vercel Blob with proper content type
    const { url } = await put(uniqueFilename, file, {
      access: 'public',
      contentType: `audio/${fileExtension}`,
      addRandomSuffix: false
    });
    
    return NextResponse.json({
      status: 'complete',
      fileUrl: url,
      progress: 100
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: `Upload failed: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}