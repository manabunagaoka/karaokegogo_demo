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
  // Keep track of current state
  let audioElement: HTMLAudioElement | null = null;
  let currentTrackId: number | string | null = null;
  let isPaused = false;
  let pausedTime = 0;
  
  // Function to safely clean up the audio element
  const cleanupAudio = (preserveState = false) => {
    try {
      if (audioElement) {
        // Store the current position if we're preserving state
        if (preserveState && !isPaused) {
          pausedTime = audioElement.currentTime;
          isPaused = true;
        }
        
        // Clean up media session
        if ('mediaSession' in navigator) {
          navigator.mediaSession.setActionHandler('play', null);
          navigator.mediaSession.setActionHandler('pause', null);
          navigator.mediaSession.setActionHandler('stop', null);
        }
        
        // Pause the audio
        audioElement.pause();
        
        // Remove all event listeners by cloning and replacing
        const clone = document.createElement('audio');
        if (audioElement.parentNode) {
          audioElement.parentNode.replaceChild(clone, audioElement);
        }
        
        // Clear the source
        audioElement.removeAttribute('src');
        audioElement.load();
        
        // Only reset track ID and pause state when not preserving state
        if (!preserveState) {
          currentTrackId = null;
          isPaused = false;
          pausedTime = 0;
        }
        
        // Set to null to allow garbage collection
        audioElement = null;
      }
    } catch (error) {
      console.log('Error during audio cleanup:', error);
      
      // Force cleanup but preserve state if requested
      audioElement = null;
      if (!preserveState) {
        currentTrackId = null;
        isPaused = false;
        pausedTime = 0;
      }
    }
  };
  
  const playTrack = (track: Track, onSuccess?: () => void, onError?: (error: Error) => void) => {
    try {
      // Check if it's the same track and we're just resuming
      if (currentTrackId === track.id && isPaused) {
        console.log(`Resuming playback of "${track.title}" from ${pausedTime.toFixed(1)} seconds`);
        
        // Create a fresh audio element
        cleanupAudio(false);
        audioElement = new Audio();
        
        // Add to DOM for better control (but hidden)
        audioElement.style.display = 'none';
        document.body.appendChild(audioElement);
        
        // Enable CORS for cross-origin resources
        audioElement.crossOrigin = "anonymous";
        
        // Set preload to auto to ensure it loads
        audioElement.preload = "auto";
        
        // Set source
        audioElement.src = track.audioUrl;
        
        // Set up event listeners before setting source
        audioElement.addEventListener('canplaythrough', () => {
          if (audioElement) {
            // Set the time to the paused position
            audioElement.currentTime = pausedTime;
            
            audioElement.play()
              .then(() => {
                // Reset pause state
                isPaused = false;
                
                console.log('Playback resumed successfully');
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
                console.error('Resume failed:', playError);
                if (onError) onError(new Error(`Resume failed: ${playError.message || 'Unknown error'}`));
                cleanupAudio(false);
              });
          }
        }, { once: true }); // Only trigger once
        
        // Handle errors
        audioElement.addEventListener('error', (event) => {
          const errorMessage = audioElement?.error?.message || 
                               audioElement?.error?.code?.toString() || 
                               'Audio format not supported';
          
          console.error('Audio error on resume:', event);
          if (onError) onError(new Error(errorMessage));
          cleanupAudio(false);
        });
        
        // Handle natural end of playback
        audioElement.addEventListener('ended', () => {
          console.log('Playback ended naturally');
          cleanupAudio(false);
        });
        
        // Start loading
        audioElement.load();
        
        return;
      }
      
      // If it's a new track, do a full cleanup
      cleanupAudio(false);
      
      // Start fresh with the new track
      currentTrackId = track.id;
      isPaused = false;
      pausedTime = 0;
      
      // Create a new audio element
      audioElement = new Audio();
      
      // Add to DOM for better control (but hidden)
      audioElement.style.display = 'none';
      document.body.appendChild(audioElement);
      
      // Enable CORS for cross-origin resources
      audioElement.crossOrigin = "anonymous";
      
      // Set preload to auto to ensure it loads
      audioElement.preload = "auto";
      
      // Generate a unique URL with cache busting for new track loads
      const timestamp = new Date().getTime();
      const audioUrl = track.audioUrl.includes('?') 
        ? `${track.audioUrl}&t=${timestamp}` 
        : `${track.audioUrl}?t=${timestamp}`;
      
      console.log('Loading new track from:', audioUrl);
      
      // Set up event listeners before setting source
      audioElement.addEventListener('canplaythrough', () => {
        if (audioElement) {
          audioElement.play()
            .then(() => {
              console.log('New track playback started successfully');
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
              cleanupAudio(false);
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
        cleanupAudio(false);
      });
      
      // Handle natural end of playback
      audioElement.addEventListener('ended', () => {
        console.log('Playback ended naturally');
        cleanupAudio(false);
      });
      
      // Set source and load
      audioElement.src = audioUrl;
      audioElement.load();
      
    } catch (error) {
      console.error('Error setting up audio playback:', error);
      if (onError) onError(error instanceof Error ? error : new Error('Failed to set up audio playback'));
      cleanupAudio(false);
    }
  };
  
  const stopPlayback = () => {
    if (!audioElement) return;
    
    try {
      // Save the current position before pausing
      pausedTime = audioElement.currentTime;
      console.log(`Pausing at position: ${pausedTime.toFixed(1)} seconds`);
      
      // Mark as paused (but don't reset the track ID)
      isPaused = true;
      
      // Clean up but preserve state
      cleanupAudio(true);
    } catch (error) {
      console.error('Error in stopPlayback:', error);
      // Do a full cleanup as fallback
      cleanupAudio(false);
    }
  };
  
  const getCurrentTime = () => {
    if (audioElement) {
      return audioElement.currentTime;
    }
    if (isPaused) {
      return pausedTime;
    }
    return undefined;
  };
  
  return {
    playTrack,
    stopPlayback,
    getCurrentTime
  };
}