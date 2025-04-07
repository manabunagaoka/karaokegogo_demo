// src/app/api/blob-upload-handler/route.ts
import { NextResponse } from 'next/server';
import { handleUpload } from '@vercel/blob/client';

export async function POST(request: Request) {
  try {
    const response = await handleUpload({
      request,
      // Optional: validate the upload
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: [
            'audio/mpeg',
            'audio/mp3',
            'audio/wav',
            'audio/ogg',
            'audio/x-m4a',
            'audio/aac',
            'audio/*',
          ],
        };
      },
    });
    
    return response;
  } catch (error: any) {
    console.error('Error in blob upload handler:', error);
    return NextResponse.json(
      { error: `Blob upload failed: ${error.message}` },
      { status: 500 }
    );
  }
}