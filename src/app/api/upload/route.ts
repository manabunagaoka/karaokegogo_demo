import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { db } from '@/lib/db'; // Correct import

export async function POST(request: Request) {
  try {
    console.log('Upload request received');
    
    const formData = await request.formData();
    console.log('FormData parsed successfully');
    
    const file = formData.get('file') as File;
    if (!file) {
      console.log('Error: No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    console.log(`File received: ${file.name}, ${file.size} bytes, type: ${file.type}`);
    
    const title = formData.get('title') as string;
    const artist = formData.get('artist') as string;
    const category = formData.get('category') as string || '';
    
    console.log(`Metadata received: title=${title}, artist=${artist}, category=${category}`);
    
    if (!title || !artist) {
      console.log('Error: Missing title or artist');
      return NextResponse.json({ 
        error: 'Title and artist are required' 
      }, { status: 400 });
    }
    
    // Generate a unique filename to avoid collisions
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/\s+/g, '_')}`;
    
    console.log(`Attempting to upload to Vercel Blob: ${filename}`);
    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    });
    console.log(`File uploaded to Blob successfully: ${blob.url}`);
    
    console.log('Attempting to save to database');
    // Save to database using the correct import
    const result = await db.query(
      `INSERT INTO tracks (title, artist, audio_url, category) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [title, artist, blob.url, category]
    );
    console.log(`Database record created with ID: ${result.rows[0].id}`);
    
    return NextResponse.json({
      success: true,
      trackId: result.rows[0].id,
      url: blob.url
    });
  } catch (error) {
    console.error('Error in upload:', error);
    // Enhanced error logging
    if (error instanceof Error) {
      console.error(`Error name: ${error.name}`);
      console.error(`Error message: ${error.message}`);
      console.error(`Error stack: ${error.stack}`);
    }
    return NextResponse.json({ 
      error: 'Failed to upload and save track', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await db.query('SELECT * FROM tracks ORDER BY created_at DESC');
    return NextResponse.json({ tracks: result.rows });
  } catch (error) {
    console.error('Error fetching tracks:', error);
    return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
  }
}