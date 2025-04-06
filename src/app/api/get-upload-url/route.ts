import { NextResponse } from 'next/server';
import { firebaseAdmin } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { fileId, chunkIndex, contentType } = await request.json();
    
    if (!fileId || chunkIndex === undefined) {
      return NextResponse.json(
        { error: 'Missing fileId or chunkIndex' },
        { status: 400 }
      );
    }
    
    // Get reference to the upload document
    const db = firebaseAdmin.firestore();
    const uploadRef = db.collection('uploads').doc(fileId);
    const uploadDoc = await uploadRef.get();
    
    if (!uploadDoc.exists) {
      return NextResponse.json(
        { error: 'Upload session not found' },
        { status: 404 }
      );
    }
    
    const uploadData = uploadDoc.data();
    if (!uploadData) {
      return NextResponse.json(
        { error: 'Upload data is empty' },
        { status: 500 }
      );
    }
    
    // Create a path for this chunk in Firebase Storage
    const chunkPath = `uploads/${fileId}/chunks/${chunkIndex}`;
    const bucket = firebaseAdmin.storage().bucket();
    const file = bucket.file(chunkPath);
    
    // Generate a signed URL for direct upload
    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // URL expires in 15 minutes
      contentType: contentType || 'application/octet-stream',
    });
    
    return NextResponse.json({
      url: signedUrl,
      headers: {
        'Content-Type': contentType || 'application/octet-stream',
      }
    });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}