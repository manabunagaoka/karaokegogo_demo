import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const artist = formData.get('artist') as string;
    const category = formData.get('category') as string || '';
    
    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
    });
    
    // Save to database
    const result = await query(
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
    return NextResponse.json({ error: 'Failed to upload and save track' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await query('SELECT * FROM tracks ORDER BY created_at DESC');
    return NextResponse.json({ tracks: result.rows });
  } catch (error) {
    console.error('Error fetching tracks:', error);
    return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
  }
}