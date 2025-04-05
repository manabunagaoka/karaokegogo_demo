import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { writeFile } from 'fs/promises';
import { join, resolve } from 'path';

// In-memory storage for chunks (not suitable for production, but works for dev)
const chunkStorage = new Map();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const fileId = formData.get('fileId') as string;
    const chunkIndex = Number(formData.get('chunkIndex'));
    const totalChunks = Number(formData.get('totalChunks'));
    const fileName = formData.get('fileName') as string;
    const chunk = formData.get('chunk') as Blob;

    if (!fileId || !chunk || chunkIndex === undefined || !totalChunks || !fileName) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Store this chunk in memory
    if (!chunkStorage.has(fileId)) {
      chunkStorage.set(fileId, new Map());
    }
    
    // Convert blob to buffer
    const buffer = Buffer.from(await chunk.arrayBuffer());
    chunkStorage.get(fileId).set(chunkIndex, buffer);

    // Check if all chunks are uploaded
    if (chunkStorage.get(fileId).size === totalChunks) {
      // Combine all chunks
      const chunksMap = chunkStorage.get(fileId);
      const chunks = [];
      
      for (let i = 0; i < totalChunks; i++) {
        const chunkBuffer = chunksMap.get(i);
        if (!chunkBuffer) {
          return NextResponse.json(
            { error: `Missing chunk ${i}` },
            { status: 400 }
          );
        }
        chunks.push(chunkBuffer);
      }
      
      const completeFileBuffer = Buffer.concat(chunks);
      
      // Create a unique filename
      const uniqueFilename = `${Date.now()}-${fileName.replace(/\s+/g, '-')}`;
      
      // Upload to Vercel Blob
      const { url } = await put(uniqueFilename, completeFileBuffer, {
        access: 'public',
        contentType: 'audio/mpeg', // Default to audio/mpeg, adjust as needed
      });
      
      // Clean up storage
      chunkStorage.delete(fileId);
      
      return NextResponse.json({
        success: true,
        fileUrl: url,
        status: 'complete',
      });
    }
    
    // Return progress for the incomplete upload
    return NextResponse.json({
      success: true,
      status: 'chunk-received',
      chunksReceived: chunkStorage.get(fileId).size,
      totalChunks,
      progress: (chunkStorage.get(fileId).size / totalChunks) * 100,
    });
    
  } catch (error: any) {
    console.error('Error processing chunk:', error);
    return NextResponse.json(
      { error: `Upload failed: ${error.message}` },
      { status: 500 }
    );
  }
}