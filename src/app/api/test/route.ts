import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { put } from '@vercel/blob';

export async function GET() {
  const diagnostics = {
    database: { connected: false },
    environment: {
      hasDbUrl: !!process.env.DATABASE_URL,
      hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    },
    blob: { tested: false },
  };

  try {
    // Test database connection
    const dbResult = await db.query('SELECT NOW() as time');
    diagnostics.database = {
      connected: true,
      timestamp: dbResult.rows[0].time
    };
  } catch (dbError) {
    diagnostics.database = {
      connected: false,
      error: dbError instanceof Error ? dbError.message : String(dbError)
    };
  }

  try {
    // Test blob storage (with a tiny test file)
    const testBlob = new Blob(['test'], { type: 'text/plain' });
    const blobFile = new File([testBlob], 'connection-test.txt', { type: 'text/plain' });
    
    const blobResult = await put('connection-test.txt', blobFile, { access: 'public' });
    diagnostics.blob = {
      tested: true,
      success: true,
      url: blobResult.url
    };
  } catch (blobError) {
    diagnostics.blob = {
      tested: true,
      success: false,
      error: blobError instanceof Error ? blobError.message : String(blobError)
    };
  }

  return NextResponse.json(diagnostics);
}