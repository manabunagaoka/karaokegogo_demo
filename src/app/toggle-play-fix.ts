// These are the fixed versions of the functions to include in your page.tsx

// Handle play/pause toggle for a track
const togglePlay = (trackId: number | string, event: React.MouseEvent) => {
  // Ensure the event doesn't bubble
  event.stopPropagation();
  event.preventDefault();
  
  console.log('Toggle play called for track:', trackId);
  
  try {
    if (isPlaying === trackId) {
      // Currently playing this track, so pause it
      audioManager.stopPlayback();
      setIsPlaying(null);
      console.log('Playback stopped for track:', trackId);
    } else {
      // Start playing this track
      if (isPlaying !== null) {
        // Stop current playback first
        audioManager.stopPlayback();
      }
      
      const trackToPlay = tracks.find(track => track.id === trackId);
      if (!trackToPlay) {
        console.error('Track not found:', trackId);
        return;
      }
      
      console.log('Starting playback for track:', trackId);
      
      // Set playing state immediately
      setIsPlaying(trackId);
      
      audioManager.playTrack(
        trackToPlay,
        () => {
          console.log('Playback started successfully');
        },
        (error) => {
          console.error('Playback error:', error);
          setIsPlaying(null);
          showToast('Error playing track: ' + error.message, 'error');
        }
      );
    }
  } catch (error) {
    console.error('Error in togglePlay:', error);
    setIsPlaying(null);
    showToast('An unexpected error occurred', 'error');
  }
};

// Toggle play for selected track
const toggleSelectedTrackPlay = (event: React.MouseEvent) => {
  // Prevent default behavior
  event.preventDefault();
  event.stopPropagation();
  
  if (selectedTrack) {
    console.log('Toggle selected track play:', selectedTrack);
    togglePlay(selectedTrack, event);
  } else {
    console.log('No track selected');
  }
};
