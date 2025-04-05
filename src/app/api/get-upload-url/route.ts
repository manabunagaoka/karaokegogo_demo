import { NextResponse } from 'next/server';
import { put } from "@vercel/blob";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    const contentType = searchParams.get('contentType') || 'audio/mpeg';
    
    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      );
    }
    
    // Generate a unique filename
    const uniqueFilename = `${Date.now()}-${filename.replace(/\s+/g, '-')}`;
    
    // Create a pre-signed URL for client-side uploads
    const { url } = await put(uniqueFilename, null, {
      access: 'public',
      contentType: contentType,
      multipart: true,
    });
    
    // Return the URL
    return NextResponse.json({
      fileUrl: url
    });
    
  } catch (error) {
    console.error('Error generating URL:', error);
    return NextResponse.json(
      { error: `Failed to generate URL: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}