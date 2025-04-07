// src/app/api/media-detect/route.ts
import { NextResponse } from 'next/server';
import { fileTypeFromBuffer } from 'file-type';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }
    
    // Fetch the file
    const response = await fetch(url);
    
    if (!response.ok) {
      return NextResponse.json({ 
        error: `Failed to fetch file: ${response.status} ${response.statusText}` 
      }, { status: 500 });
    }
    
    // Get the file as a buffer
    const buffer = await response.arrayBuffer();
    
    // Get the content type from the response
    const declaredContentType = response.headers.get('content-type');
    
    // Try to detect the actual file type
    let detectedType = null;
    try {
      // First try to use the file-type library if available
      detectedType = await fileTypeFromBuffer(buffer);
    } catch (e) {
      console.warn('Could not detect file type, relying on headers');
    }
    
    return NextResponse.json({
      url,
      declaredContentType,
      detectedType: detectedType || 'Could not detect',
      fileSize: buffer.byteLength,
      headers: Object.fromEntries(response.headers)
    });
    
  } catch (error) {
    console.error('Media detection error:', error);
    return NextResponse.json({ 
      error: `Failed to detect media type: ${error.message}` 
    }, { status: 500 });
  }
}