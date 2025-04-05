import axios from 'axios';

// Constants for upload configuration
const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB chunks (reduced from previous size)
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second

/**
 * Handles chunked upload of large files
 * @param file The file to upload
 * @param onProgress Progress callback (0-100)
 * @param onComplete Success callback with file URL
 * @param onError Error callback
 */
export async function uploadLargeFile(
  file: File,
  onProgress: (progress: number) => void,
  onComplete: (url: string) => void,
  onError: (error: string) => void
): Promise<void> {
  try {
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const fileId = generateUniqueId();
    const fileExtension = file.name.split('.').pop() || '';
    const filename = `${fileId}.${fileExtension}`;
    
    let uploadedChunks = 0;
    
    // Initialize the upload
    await axios.post('/api/upload/init', {
      filename,
      totalChunks,
      fileSize: file.size,
      fileType: file.type
    });
    
    // Upload each chunk
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(file.size, start + CHUNK_SIZE);
      const chunk = file.slice(start, end);
      
      let attempt = 0;
      let uploadSuccess = false;
      
      // Retry logic for each chunk
      while (attempt < RETRY_ATTEMPTS && !uploadSuccess) {
        try {
          const formData = new FormData();
          formData.append('chunk', chunk);
          formData.append('filename', filename);
          formData.append('chunkIndex', chunkIndex.toString());
          formData.append('totalChunks', totalChunks.toString());
          
          await axios.post('/api/chunk-upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                // Calculate overall progress including previous chunks
                const chunkProgress = progressEvent.loaded / progressEvent.total;
                const overallProgress = ((chunkIndex + chunkProgress) / totalChunks) * 100;
                onProgress(Math.round(overallProgress));
              }
            },
          });
          
          uploadSuccess = true;
        } catch (error) {
          attempt++;
          if (attempt >= RETRY_ATTEMPTS) {
            throw new Error(`Failed to upload chunk ${chunkIndex}: ${error instanceof Error ? error.message : String(error)}`);
          }
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
      }
      
      uploadedChunks++;
      onProgress(Math.round((uploadedChunks / totalChunks) * 100));
    }
    
    // Complete the upload and get the file URL
    const response = await axios.post('/api/upload/complete', {
      filename,
      totalChunks
    });
    
    if (response.data && response.data.url) {
      onComplete(response.data.url);
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    onError(error instanceof Error ? error.message : String(error));
  }
}

/**
 * Generates a unique ID for filenames
 */
function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}