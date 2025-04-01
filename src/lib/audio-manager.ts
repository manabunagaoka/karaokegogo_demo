// src/lib/audio-manager.ts

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
  [key: string]: any; // Allow additional properties
}

export interface AudioManager {
  playTrack: (track: Track, onSuccess?: () => void, onError?: (error: any) => void) => void;
  pausePlayback: () => void;
  resumePlayback: () => void;
  stopPlayback: () => void;
  getCurrentTime: () => number | undefined;
  getDuration: () => number | undefined;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  isPlaying: () => boolean;
}

export const createAudioManager = (): AudioManager => {
  let audioElement: HTMLAudioElement | null = null;
  let currentTrack: Track | null = null;
  let isCurrentlyPlaying = false;
  
  const createAudio = () => {
    try {
      if (audioElement) {
        // Clean up existing audio element
        audioElement.pause();
        audioElement.src = '';
        audioElement.load();
      }
      
      audioElement = new Audio();
      
      // Add error handler
      audioElement.onerror = (event) => {
        // Convert MediaError to a more descriptive error
        const mediaError = audioElement?.error;
        let errorMessage = "Unknown audio error";
        
        if (mediaError) {
          switch (mediaError.code) {
            case MediaError.MEDIA_ERR_ABORTED:
              errorMessage = "Playback aborted by the user";
              break;
            case MediaError.MEDIA_ERR_NETWORK:
              errorMessage = "Network error occurred while loading the audio";
              break;
            case MediaError.MEDIA_ERR_DECODE:
              errorMessage = "Audio decoding error";
              break;
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMessage = "Audio format not supported";
              break;
            default:
              errorMessage = `Audio error: ${mediaError.message || "Unknown"}`;
              break;
          }
        }
        
        console.error(errorMessage);
        isCurrentlyPlaying = false;
      };
      
      return true;
    } catch (error) {
      console.error("Error creating audio element:", error);
      return false;
    }
  };
  
  const playTrack = (track: Track, onSuccess?: () => void, onError?: (error: any) => void) => {
    try {
      // Create a new audio element
      const success = createAudio();
      if (!success || !audioElement) {
        const error = new Error("Could not create audio element");
        if (onError) onError(error);
        return;
      }
      
      // Set the current track
      currentTrack = track;
      
      // Reset any previous error handlers
      const errorHandler = (event: Event | string) => {
        // Get error from the audio element
        const mediaError = audioElement?.error;
        let errorMessage = "Failed to play audio";
        
        if (mediaError) {
          switch (mediaError.code) {
            case MediaError.MEDIA_ERR_ABORTED:
              errorMessage = "Playback aborted by the user";
              break;
            case MediaError.MEDIA_ERR_NETWORK:
              errorMessage = "Network error occurred while loading the audio";
              break;
            case MediaError.MEDIA_ERR_DECODE:
              errorMessage = "Audio decoding error";
              break;
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMessage = "Audio format not supported";
              break;
            default:
              errorMessage = `Audio error (${mediaError.code})`;
              break;
          }
        }
        
        console.error(errorMessage);
        isCurrentlyPlaying = false;
        
        if (onError) onError(new Error(errorMessage));
      };
      
      // Set up event handlers
      audioElement.onerror = errorHandler;
      
      // Safely load and play
      audioElement.src = track.audioUrl;
      audioElement.load();
      
      // Set up play handling
      const playAudio = () => {
        if (!audioElement) return;
        
        audioElement.play()
          .then(() => {
            isCurrentlyPlaying = true;
            if (onSuccess) onSuccess();
          })
          .catch((error) => {
            console.error("Play failed:", error.message);
            isCurrentlyPlaying = false;
            if (onError) onError(error);
          });
      };
      
      // Handle the canplaythrough event
      audioElement.oncanplaythrough = () => {
        playAudio();
      };
      
      // Set a timeout in case canplaythrough doesn't fire
      const timeout = setTimeout(() => {
        if (audioElement && !isCurrentlyPlaying) {
          // Try to play even if canplaythrough hasn't fired
          playAudio();
        }
      }, 2000);
      
      // Clean up timeout when playback starts or errors
      audioElement.onplaying = () => {
        clearTimeout(timeout);
      };
      
      // Handle end of playback
      audioElement.onended = () => {
        isCurrentlyPlaying = false;
        stopPlayback();
      };
      
    } catch (error) {
      console.error("Error in playTrack:", error);
      isCurrentlyPlaying = false;
      if (onError) onError(error);
    }
  };
  
  const pausePlayback = () => {
    try {
      if (audioElement && !audioElement.paused) {
        audioElement.pause();
        isCurrentlyPlaying = false;
      }
    } catch (error) {
      console.error("Error in pausePlayback:", error);
      isCurrentlyPlaying = false;
    }
  };
  
  const resumePlayback = () => {
    try {
      if (audioElement && audioElement.paused) {
        audioElement.play()
          .then(() => {
            isCurrentlyPlaying = true;
          })
          .catch((error) => {
            console.error("Resume error:", error);
            isCurrentlyPlaying = false;
          });
      }
    } catch (error) {
      console.error("Error in resumePlayback:", error);
      isCurrentlyPlaying = false;
    }
  };
  
  const stopPlayback = () => {
    try {
      if (audioElement) {
        audioElement.pause();
        try {
          audioElement.currentTime = 0;
        } catch (err) {
          // Some browsers throw errors when setting currentTime if the audio is not loaded
          console.log("Could not reset currentTime:", err);
        }
        isCurrentlyPlaying = false;
      }
    } catch (error) {
      console.error("Error in stopPlayback:", error);
      isCurrentlyPlaying = false;
    }
  };
  
  const getCurrentTime = (): number | undefined => {
    try {
      if (audioElement) {
        return audioElement.currentTime;
      }
    } catch (error) {
      console.error("Error getting current time:", error);
    }
    return undefined;
  };
  
  const getDuration = (): number | undefined => {
    try {
      if (audioElement && !isNaN(audioElement.duration)) {
        return audioElement.duration;
      }
    } catch (error) {
      console.error("Error getting duration:", error);
    }
    return undefined;
  };
  
  const setVolume = (volume: number) => {
    try {
      if (audioElement) {
        // Ensure volume is between 0 and 1
        audioElement.volume = Math.max(0, Math.min(1, volume));
      }
    } catch (error) {
      console.error("Error setting volume:", error);
    }
  };
  
  const getVolume = (): number => {
    try {
      return audioElement ? audioElement.volume : 1;
    } catch (error) {
      console.error("Error getting volume:", error);
      return 1;
    }
  };
  
  const isPlaying = (): boolean => {
    return isCurrentlyPlaying;
  };
  
  return {
    playTrack,
    pausePlayback,
    resumePlayback,
    stopPlayback,
    getCurrentTime,
    getDuration,
    setVolume,
    getVolume,
    isPlaying
  };
};