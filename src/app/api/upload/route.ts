import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { db } from '@/lib/db'; // Correct import

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Optional: Validate file type
    const validAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg'];
    if (!validAudioTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only audio files are allowed.' 
      }, { status: 400 });
    }
    
    const title = formData.get('title') as string;
    const artist = formData.get('artist') as string;
    const category = formData.get('category') as string || '';
    
    if (!title || !artist) {
      return NextResponse.json({ 
        error: 'Title and artist are required' 
      }, { status: 400 });
    }
    
    // Generate a unique filename to avoid collisions
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/\s+/g, '_')}`;
    
    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    });
    
    // Save to database using the correct import
    const result = await db.query(
      `INSERT INTO tracks (title, artist, audio_url, category) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [title, artist, blob.url, category]
    );
    
    return NextResponse.json({
      success: true,
      trackId: result.rows[0].id,
      url: blob.url
    });
  } catch (error) {
    console.error('Error in upload:', error);
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