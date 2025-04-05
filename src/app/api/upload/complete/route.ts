import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, readdir, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Configure API route
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb', // Just for the metadata
    },
  },
};

// Set up directories
const TEMP_DIR = join(process.cwd(), 'tmp');
const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads');

/**
 * Completes a chunked upload by combining all chunks
 */
export async function POST(request: NextRequest) {
  try {
    // Ensure uploads directory exists
    if (!existsSync(UPLOADS_DIR)) {
      await mkdir(UPLOADS_DIR, { recursive: true });
    }
    
    // Parse the request
    const body = await request.json();
    const { filename, totalChunks } = body;
    
    if (!filename || !totalChunks) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }
    
    // Get sessionId from cookies
    const sessionId = request.cookies.get('session-id')?.value;
    if (!sessionId) {
      return NextResponse.json({ error: 'Session not found' }, { status: 400 });
    }
    
    // Path to file chunks
    const fileDir = join(TEMP_DIR, sessionId, filename);
    if (!existsSync(fileDir)) {
      return NextResponse.json({ error: 'Upload not found' }, { status: 404 });
    }
    
    // Read all chunks
    const files = await readdir(fileDir);
    const chunkFiles = files.filter(file => file.startsWith('chunk-'))
      .sort((a, b) => {
        const numA = parseInt(a.split('-')[1]);
        const numB = parseInt(b.split('-')[1]);
        return numA - numB;
      });
    
    // Verify all chunks are present
    if (chunkFiles.length !== totalChunks) {
      return NextResponse.json(
        { error: `Missing chunks. Expected ${totalChunks}, got ${chunkFiles.length}` },
        { status: 400 }
      );
    }
    
    // Combine chunks
    const finalFilePath = join(UPLOADS_DIR, filename);
    const chunks: Buffer[] = [];
    
    for (const chunkFile of chunkFiles) {
      const chunkPath = join(fileDir, chunkFile);
      const chunkData = await readFile(chunkPath);
      chunks.push(chunkData);
    }
    
    // Write the combined file
    const combinedBuffer = Buffer.concat(chunks);
    await writeFile(finalFilePath, combinedBuffer);
    
    // Clean up chunks
    for (const chunkFile of chunkFiles) {
      await unlink(join(fileDir, chunkFile));
    }
    
    // Return the public URL
    const publicUrl = `/uploads/${filename}`;
    
    return NextResponse.json({
      success: true,
      url: publicUrl,
      message: 'File uploaded successfully'
    });
    
  } catch (error) {
    console.error('Upload completion error:', error);
    return NextResponse.json(
      { error: `Failed to complete upload: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}