export interface Track {
  id: number | string;
  title: string;
  artist: string;
  duration: string;
  audioUrl: string;
  popular?: boolean;
  category?: string;
  description?: string;
  hasSongVersion?: boolean;
  lyrics?: string;
  isKaraokeTrack?: boolean;
  userTrack?: boolean;
}

export interface AudioManager {
  playTrack: (track: Track, onSuccess?: () => void, onError?: (error: Error) => void) => void;
  stopPlayback: () => void;
  getCurrentTime: () => number | undefined;
}

export function createAudioManager(): AudioManager {
  // Using a class variable instead of a local variable to ensure better cleanup
  let audioElement: HTMLAudioElement | null = null;
  
  // Function to safely clean up the audio element
  const cleanupAudio = () => {
    try {
      if (audioElement) {
        // Properly clean up media session
        if ('mediaSession' in navigator) {
          navigator.mediaSession.setActionHandler('play', null);
          navigator.mediaSession.setActionHandler('pause', null);
          navigator.mediaSession.setActionHandler('stop', null);
        }
        
        // Remove all event listeners by cloning and replacing
        const clone = document.createElement('audio');
        if (audioElement.parentNode) {
          audioElement.parentNode.replaceChild(clone, audioElement);
        }
        
        // Clear the source and pause
        audioElement.pause();
        audioElement.removeAttribute('src');
        audioElement.load();
        
        // Set to null to allow garbage collection
        audioElement = null;
      }
    } catch (error) {
      console.log('Error during audio cleanup:', error);
      // Force cleanup
      audioElement = null;
    }
  };
  
  const playTrack = (track: Track, onSuccess?: () => void, onError?: (error: Error) => void) => {
    // Always clean up first
    cleanupAudio();
    
    try {
      // Create a new audio element
      audioElement = new Audio();
      
      // Add to DOM for better control (but hidden)
      audioElement.style.display = 'none';
      document.body.appendChild(audioElement);
      
      // Enable CORS for cross-origin resources
      audioElement.crossOrigin = "anonymous";
      
      // Set preload to auto to ensure it loads
      audioElement.preload = "auto";
      
      // Generate a unique URL with cache busting
      const timestamp = new Date().getTime();
      const audioUrl = track.audioUrl.includes('?') 
        ? `${track.audioUrl}&t=${timestamp}` 
        : `${track.audioUrl}?t=${timestamp}`;
      
      console.log('Loading audio from:', audioUrl);
      
      // Set up event listeners before setting source
      audioElement.addEventListener('canplaythrough', () => {
        if (audioElement) {
          audioElement.play()
            .then(() => {
              console.log('Playback started successfully');
              if (onSuccess) onSuccess();
              
              // Set up media session
              if ('mediaSession' in navigator) {
                navigator.mediaSession.metadata = new MediaMetadata({
                  title: track.title,
                  artist: track.artist,
                  album: track.description || 'Karaoke Track',
                });
              }
            })
            .catch((playError) => {
              console.error('Play failed:', playError);
              if (onError) onError(new Error(`Playback failed: ${playError.message || 'Unknown error'}`));
              cleanupAudio();
            });
        }
      }, { once: true }); // Only trigger once
      
      // Handle errors properly
      audioElement.addEventListener('error', (event) => {
        const errorMessage = 
          audioElement?.error?.message || 
          audioElement?.error?.code?.toString() || 
          'Audio format not supported';
        
        console.error('Audio error event:', event);
        console.error('Audio error details:', audioElement?.error);
        
        // Notify caller about the error
        if (onError) onError(new Error(errorMessage));
        
        // Clean up
        cleanupAudio();
      });
      
      // Handle natural end of playback
      audioElement.addEventListener('ended', () => {
        console.log('Playback ended naturally');
        cleanupAudio();
      });
      
      // Set source and load
      audioElement.src = audioUrl;
      audioElement.load();
      
    } catch (error) {
      console.error('Error setting up audio playback:', error);
      if (onError) onError(error instanceof Error ? error : new Error('Failed to set up audio playback'));
      cleanupAudio();
    }
  };
  
  const stopPlayback = () => {
    console.log('Stopping playback');
    cleanupAudio();
  };
  
  const getCurrentTime = () => {
    return audioElement ? audioElement.currentTime : undefined;
  };
  
  return {
    playTrack,
    stopPlayback,
    getCurrentTime
  };
}