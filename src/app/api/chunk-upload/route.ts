import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import { join, resolve } from 'path';
import { existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Configure API route
export const config = {
  api: {
    bodyParser: false, // We're handling the body parsing ourselves
    responseLimit: false, // No response size limit
  },
};

// Set up temp directory for chunks
const TEMP_DIR = join(process.cwd(), 'tmp');

// Ensure temp directory exists
async function ensureTempDir() {
  try {
    if (!existsSync(TEMP_DIR)) {
      await mkdir(TEMP_DIR, { recursive: true });
    }
  } catch (err) {
    console.error('Failed to create temp directory:', err);
  }
}

/**
 * Handles file chunk uploads
 */
export async function POST(request: NextRequest) {
  try {
    await ensureTempDir();
    
    // Use FormData API to parse multipart form data
    const formData = await request.formData();
    const chunk = formData.get('chunk') as File;
    const filename = formData.get('filename') as string;
    const chunkIndex = parseInt(formData.get('chunkIndex') as string);
    const totalChunks = parseInt(formData.get('totalChunks') as string);
    
    if (!chunk || typeof filename !== 'string' || isNaN(chunkIndex) || isNaN(totalChunks)) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }
    
    // Check file size
    if (chunk.size > 2 * 1024 * 1024) { // 2MB max chunk size
      return NextResponse.json({ error: 'Chunk size exceeds the limit' }, { status: 413 });
    }
    
    // Create user-specific directory for better organization
    const sessionId = request.cookies.get('session-id')?.value || uuidv4();
    const userDir = join(TEMP_DIR, sessionId);
    
    if (!existsSync(userDir)) {
      await mkdir(userDir, { recursive: true });
    }
    
    // Create file-specific directory for chunks
    const fileDir = join(userDir, filename);
    if (!existsSync(fileDir)) {
      await mkdir(fileDir, { recursive: true });
    }
    
    // Save the chunk to disk
    const chunkPath = join(fileDir, `chunk-${chunkIndex}`);
    const buffer = Buffer.from(await chunk.arrayBuffer());
    await writeFile(chunkPath, buffer);
    
    return NextResponse.json({
      success: true,
      message: `Chunk ${chunkIndex + 1} of ${totalChunks} uploaded successfully`,
    });
    
  } catch (error) {
    console.error('Chunk upload error:', error);
    return NextResponse.json(
      { error: `Failed to process upload: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}