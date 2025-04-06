import { NextResponse } from 'next/server';
import { firebaseAdmin } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { fileId, chunkIndex, etag, size } = await request.json();
    
    if (!fileId || chunkIndex === undefined || !etag) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Update the upload document with the chunk information
    const db = firebaseAdmin.firestore();
    const uploadRef = db.collection('uploads').doc(fileId);
    
    await uploadRef.update({
      [`chunks.${chunkIndex}`]: {
        index: chunkIndex,
        etag,
        size,
        uploadedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp()
      }
    });
    
    return NextResponse.json({
      success: true,
      message: `Chunk ${chunkIndex} confirmed`,
    });
  } catch (error) {
    console.error('Error confirming chunk upload:', error);
    return NextResponse.json(
      { error: 'Failed to confirm chunk upload' },
      { status: 500 }
    );
  }
}