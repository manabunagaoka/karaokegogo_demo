export async function uploadLargeFile(file: File): Promise<string> {
  try {
    // Step 1: Get a signed upload URL
    const response = await fetch(`/api/get-upload-url?filename=${encodeURIComponent(file.name)}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get upload URL');
    }
    
    const { uploadUrl, fileUrl } = await response.json();
    
    // Step 2: Upload the file directly to Vercel Blob using the signed URL
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file, // Send the file directly
    });
    
    if (!uploadResponse.ok) {
      throw new Error(`Upload failed with status: ${uploadResponse.status}`);
    }
    
    console.log('File uploaded successfully to:', fileUrl);
    return fileUrl; // Return the public URL of the uploaded file
    
  } catch (error: any) {
    console.error('Upload error:', error);
    throw error;
  }
}
