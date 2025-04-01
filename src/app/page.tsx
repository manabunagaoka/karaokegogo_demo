"use client";

import React, { useState, useRef, useEffect } from 'react';
import AppLogo from '@/components/layout/AppLogo';
import NavigationButtons from '@/components/ui/NavigationButtons';
import TrackPanel from '@/components/karaoke/TrackPanel';
import UploadModal from '@/components/karaoke/UploadModal';
import ToastNotification from '@/components/ui/ToastNotification';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import LyricsPanel from '@/components/karaoke/LyricsPanel';
import { createAudioManager, Track } from '@/lib/audio-manager';
import { createTrackStorage } from '@/lib/track-storage';

export default function Home() {
  // Create managers
  const audioManager = useRef(createAudioManager()).current;
  const trackStorage = useRef(createTrackStorage('karaokeTracks')).current;
  
  // UI State
  const [isTrackPanelVisible, setIsTrackPanelVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Upload State
  const [isUploadPanelVisible, setIsUploadPanelVisible] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState("Pop");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadUserName, setUploadUserName] = useState("");
  const [uploadSongTitle, setUploadSongTitle] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [hasSongVersion, setHasSongVersion] = useState(false);
  const [uploadLyrics, setUploadLyrics] = useState("");
  
  // Audio State
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<number | string | null>(null);
  const [isPlaying, setIsPlaying] = useState<number | string | null>(null);
  
  // Lyrics Panel State
  const [isLyricsPanelVisible, setIsLyricsPanelVisible] = useState(false);
  const [currentLyricsTrack, setCurrentLyricsTrack] = useState<Track | null>(null);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  
  // Notification State
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ 
    visible: false, 
    title: '', 
    message: '', 
    onConfirm: () => {}, 
    onCancel: () => {} 
  });

  // Add this helper function for generating unique IDs
  const generateUniqueId = (() => {
    let lastId = 0;
    return () => {
      const newId = Date.now();
      lastId = newId > lastId ? newId : lastId + 1;
      return lastId;
    };
  })();

  // Refs
  const trackPanelRef = useRef(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Categories
  const categories = ["All", "My Tracks", "Pop", "Rock", "Hip-Hop", "Electronic", "R&B", "Rap", "Others"];

  // Show toast notification
  const showToast = (message: string, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: '', type: 'success' });
    }, 3000); // Hide after 3 seconds
  };

  // Load tracks from local storage on mount
  useEffect(() => {
    const loadedTracks = trackStorage.getTracks();
    setTracks(loadedTracks);
  }, []);

  // Save tracks to local storage when updated
  useEffect(() => {
    if (tracks.length > 0) {
      localStorage.setItem('karaokeTracks', JSON.stringify(tracks));
    }
  }, [tracks]);

  // Set up playback time tracking for lyrics
  useEffect(() => {
    if (isPlaying !== null && currentLyricsTrack !== null) {
      const updateInterval = setInterval(() => {
        const currentTime = audioManager.getCurrentTime();
        if (currentTime !== undefined) {
          setCurrentPlaybackTime(currentTime);
        }
      }, 100);
      
      return () => clearInterval(updateInterval);
    }
  }, [isPlaying, currentLyricsTrack]);

  // Toggle track selection panel
  const toggleTrackSelectionPanel = () => {
    setIsTrackPanelVisible(!isTrackPanelVisible);
  };
  
  // Handle track selection
  const handleTrackSelect = (trackId: number | string) => {
    setSelectedTrack(trackId);
    // Don't automatically play when selecting
    if (isPlaying !== null) {
      audioManager.stopPlayback();
      setIsPlaying(null);
    }
  };
  
  // Handle view lyrics
  const handleViewLyrics = (trackId: number | string) => {
    const track = tracks.find(t => t.id === trackId);
    if (track && track.lyrics) {
      setCurrentLyricsTrack(track);
      setIsLyricsPanelVisible(true);
    }
  };
  
  // Handle play/pause toggle for a track
  const togglePlay = (trackId: number | string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      if (isPlaying === trackId) {
        // Currently playing this track, so stop it
        audioManager.stopPlayback();
        setIsPlaying(null);
      } else {
        // Play a different track
        const trackToPlay = tracks.find(track => track.id === trackId);
        if (trackToPlay) {
          audioManager.playTrack(
            trackToPlay,
            () => {
              // Success callback
              setIsPlaying(trackId);
            },
            (err) => {
              // Error callback
              setIsPlaying(null);
              showToast('Unable to play this track. It may be in an unsupported format.', 'error');
            }
          );
        }
      }
    } catch (error) {
      console.error("Error toggling playback:", error);
      setIsPlaying(null);
      showToast('Error playing track. Please try another.', 'error');
    }
  };

  // Toggle play for selected track
  const toggleSelectedTrackPlay = (event: React.MouseEvent) => {
    event.preventDefault();
    if (selectedTrack) {
      const trackToPlay = tracks.find(track => track.id === selectedTrack);
      if (trackToPlay) {
        togglePlay(selectedTrack, event);
      }
    }
  };
  
  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Only accept audio files
    if (!file.type.startsWith('audio/')) {
      showToast('Please upload audio files only', 'error');
      return;
    }
    
    // Validate file format
    const validAudioTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/x-m4a', 'audio/aac'];
    const isValidFormat = validAudioTypes.some(type => file.type === type || file.type.includes(type));
    
    if (!isValidFormat) {
      showToast('Please upload MP3, WAV, OGG or AAC audio files only', 'error');
      return;
    }
    
    // Store file and show upload panel
    setUploadFile(file);
    setUploadSongTitle(file.name.replace(/\.[^/.]+$/, "")); // Set default title to filename
    setIsUploadPanelVisible(true);
    
    // Reset file input
    if (event.target) {
      event.target.value = '';
    }
  };
  
  // Function to perform the actual upload
const performUpload = async () => {
  if (!uploadFile) return;
  
  setIsUploading(true);
  
  try {
    // Create a unique filename
    const uniqueFilename = `${Date.now()}-${uploadFile.name}`;
    
    // Create form data to send to API
    const formData = new FormData();
    formData.append('file', uploadFile);
    
    // Upload to Vercel Blob Storage
    const response = await fetch(`/api/upload?filename=${encodeURIComponent(uniqueFilename)}`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload file');
    }
    
    const blob = await response.json();
    const audioUrl = blob.url; // This URL is permanent and shareable
    
    // Get audio duration
    const audio = new Audio();
    audio.src = audioUrl;
    
    // Handle errors
    const handleAudioError = () => {
      showToast('This audio file format is not supported. Please try another format like MP3 or WAV.', 'error');
      setIsUploading(false);
      setIsUploadPanelVisible(false);
    };

    audio.addEventListener('error', handleAudioError);
    
    // Handle metadata loading
    audio.addEventListener('loadedmetadata', () => {
      if (isNaN(audio.duration)) {
        showToast('Could not determine audio duration. The file might be corrupt.', 'error');
        setIsUploading(false);
        setIsUploadPanelVisible(false);
        return;
      }
      
      const duration = audio.duration;
      
      // Format duration
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      // Create track ID
      const newTrackId = generateUniqueId();
      
      // Create new track
      const newTrack = {
        id: newTrackId,
        title: uploadSongTitle || uploadFile.name.replace(/\.[^/.]+$/, ""),
        artist: uploadUserName || 'User Upload',
        duration: formattedDuration,
        audioUrl: audioUrl, // Permanent URL from Vercel Blob
        popular: false,
        category: uploadCategory,
        description: uploadDescription || '',
        hasSongVersion: hasSongVersion,
        lyrics: uploadLyrics || '',
        isKaraokeTrack: hasSongVersion,
        userTrack: true
      };
      
      // Add track to list
      setTracks(prevTracks => [...prevTracks, newTrack]);
      
      // Reset upload state
      setIsUploading(false);
      setIsUploadPanelVisible(false);
      setUploadFile(null);
      setUploadUserName("");
      setUploadSongTitle("");
      setUploadDescription("");
      setHasSongVersion(false);
      setUploadLyrics("");
      
      // Show success message and select the new track
      showToast(`Track "${newTrack.title}" uploaded successfully!`, 'success');
      setSelectedTrack(newTrackId);
      
      // Switch to "My Tracks" category to show the new track
      setSelectedCategory("My Tracks");
    });
    
    // Load the audio to trigger metadata loading
    audio.load();
    
  } catch (error) {
    console.error("Upload error:", error);
    showToast('Failed to upload track. Please try again.', 'error');
    setIsUploading(false);
    setIsUploadPanelVisible(false);
  }
};
  
  // Delete a track - FIXED VERSION
  const deleteTrack = (trackId: number | string, event: React.MouseEvent) => {
    // Make sure to stop propagation to prevent selecting the track
    event.stopPropagation();
    
    const confirmDelete = () => {
      // If currently playing, stop it
      if (isPlaying === trackId) {
        audioManager.stopPlayback();
        setIsPlaying(null);
      }
      
      // Remove from tracks state
      setTracks(prevTracks => prevTracks.filter(track => track.id !== trackId));
      
      // Also remove from localStorage directly
      const currentTracks = JSON.parse(localStorage.getItem('karaokeTracks') || '[]');
      const updatedTracks = currentTracks.filter((track: any) => track.id !== trackId);
      localStorage.setItem('karaokeTracks', JSON.stringify(updatedTracks));
      
      // If this was the selected track, deselect it
      if (selectedTrack === trackId) {
        setSelectedTrack(null);
      }
      
      showToast('Track deleted successfully', 'success');
      
      // Close the dialog
      setConfirmDialog({ visible: false, title: '', message: '', onConfirm: () => {}, onCancel: () => {} });
    };
    
    // Show a custom confirmation dialog
    setConfirmDialog({
      visible: true,
      title: 'Delete Track',
      message: 'Are you sure you want to delete this track?',
      onConfirm: confirmDelete,
      onCancel: () => setConfirmDialog({ visible: false, title: '', message: '', onConfirm: () => {}, onCancel: () => {} })
    });
  };
  
  // Stub function that shows a Coming Soon message
  const showComingSoonMessage = () => {
    showToast('Recording features coming soon!', 'info');
  };
  
  // Filter and sort tracks
  const filteredTracks = tracks
    .filter(track => {
      // Handle "My Tracks" category specially
      if (selectedCategory === "My Tracks") {
        return track.userTrack === true;
      }
      
      const matchesCategory = selectedCategory === "All" || track.category === selectedCategory;
      const matchesSearch = searchQuery === "" || 
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (a.popular !== b.popular) return a.popular ? -1 : 1;
      return a.title.localeCompare(b.title);
    });

  return (
    <main style={{ 
      position: "relative", 
      minHeight: "100vh",
      overflow: "hidden"
    }}>
      {/* Background image */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0
      }}>
        <img 
          src="/images/stage.jpg" 
          alt="Karaoke stage" 
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top"
          }}
        />
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 1
        }}></div>
      </div>
      
      {/* Main Content */}
      <div style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        padding: "0"
      }}>
        {/* Logo and Tagline */}
        <AppLogo />
        
        {/* Empty flex space to push content to top */}
        <div style={{ flexGrow: 1 }}></div>
      </div>
      
      {/* Hidden file input for uploads */}
      <input 
        type="file" 
        ref={fileInputRef}
        style={{ display: 'none' }} 
        accept="audio/*"
        onChange={handleFileSelect}
      />

      {/* Bottom panel with navigation buttons */}
      <div style={{
        position: "fixed",
        bottom: "0",
        left: 0,
        width: "100%",
        height: "120px",
        background: "linear-gradient(to top, #121212, rgba(18, 18, 18, 0.8))",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 20,
        backdropFilter: "blur(5px)",
        overflow: "hidden"
      }}>
        <NavigationButtons 
          onKaraokeClick={toggleTrackSelectionPanel} 
          showComingSoonMessage={showComingSoonMessage} 
        />
      </div>
      
      {/* Track Panel Component */}
      <TrackPanel 
        visible={isTrackPanelVisible}
        tracks={filteredTracks}
        selectedTrack={selectedTrack}
        isPlaying={isPlaying}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        categories={categories}
        onClose={() => setIsTrackPanelVisible(false)}
        onSelectTrack={handleTrackSelect}
        onTogglePlay={togglePlay}
        onDeleteTrack={deleteTrack}
        onSearchChange={setSearchQuery}
        onSelectCategory={setSelectedCategory}
        onUploadClick={() => fileInputRef.current?.click()}
        onToggleSelectedTrack={toggleSelectedTrackPlay}
        onViewLyrics={handleViewLyrics}
      />
      
      {/* Upload Modal Component */}
      <UploadModal 
        visible={isUploadPanelVisible}
        uploadFile={uploadFile}
        uploadUserName={uploadUserName}
        uploadSongTitle={uploadSongTitle}
        uploadDescription={uploadDescription}
        uploadCategory={uploadCategory}
        hasSongVersion={hasSongVersion}
        uploadLyrics={uploadLyrics}
        isUploading={isUploading}
        categories={categories}
        onClose={() => {
          setIsUploadPanelVisible(false);
          setUploadFile(null);
          setUploadUserName("");
          setUploadSongTitle("");
          setUploadDescription("");
          setHasSongVersion(false);
          setUploadLyrics("");
        }}
        onUserNameChange={setUploadUserName}
        onSongTitleChange={setUploadSongTitle}
        onDescriptionChange={setUploadDescription}
        onCategoryChange={setUploadCategory}
        onHasSongVersionChange={setHasSongVersion}
        onLyricsChange={setUploadLyrics}
        onUpload={performUpload}
        onComingSoon={showComingSoonMessage}
      />
      
      {/* Lyrics Panel Component - FIXED VERSION */}
      <LyricsPanel
        visible={isLyricsPanelVisible}
        track={currentLyricsTrack}
        isPlaying={isPlaying === currentLyricsTrack?.id}
        onClose={() => setIsLyricsPanelVisible(false)}
        onTogglePlay={() => {
          if (currentLyricsTrack) {
            if (isPlaying === currentLyricsTrack.id) {
              // If currently playing, stop it
              audioManager.stopPlayback();
              setIsPlaying(null);
            } else {
              // Start playing
              audioManager.playTrack(
                currentLyricsTrack,
                () => {
                  // Success callback
                  setIsPlaying(currentLyricsTrack.id);
                },
                (err) => {
                  // Error callback
                  console.error("Error playing from lyrics panel:", err);
                  setIsPlaying(null);
                  showToast('Unable to play this track. It may be in an unsupported format.', 'error');
                }
              );
            }
          }
        }}
        currentTime={currentPlaybackTime}
      />
      
      {/* Toast Notification Component */}
      <ToastNotification 
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
      />
      
      {/* Confirmation Dialog Component */}
      <ConfirmDialog 
        visible={confirmDialog.visible}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={confirmDialog.onCancel}
      />
      
      <style jsx global>{`
        /* Body and HTML full height */
        html, body {
          height: 100%;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          overscroll-behavior: none; /* Prevents elastic overscroll */
        }
        
        /* ARROW BUTTON STYLES */
        .arrow-button-container {
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          z-index: 30;
          transition: bottom 0.3s ease-out;
        }
        
        .pink-arrow-button {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #ff00cc, #3333ff);
          color: white;
          border: none;
          border-radius: 50%;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 0 20px rgba(255, 20, 147, 0.5);
          padding: 0; /* Remove default padding */
          overflow: hidden; /* Ensure nothing extends outside button */
          line-height: 1; /* Reset line height */
        }
        
        /* CATEGORY TABS CONTAINER */
        .category-tabs-container {
          position: relative;
          width: 100%;
          background: rgba(0,0,0,0.2);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          overscroll-behavior: none;
          touch-action: pan-x; /* Only allow horizontal scrolling */
        }
        
        /* CATEGORY BUTTON STYLES */
        .category-tabs {
          display: flex;
          overflow-x: auto;
          padding: 10px 15px;
          -ms-overflow-style: none;
          scrollbar-width: none;
          overscroll-behavior-x: none; /* Prevent horizontal overscroll */
          position: relative;
          z-index: 1;
        }
        
        .category-tabs::-webkit-scrollbar {
          display: none;
        }
        
        .category-button {
          flex: 0 0 auto;
          min-width: 70px;
          margin: 0 5px;
          padding: 6px 15px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          borderRadius: 20px;
          color: rgba(255,255,255,0.7);
          font-weight: normal;
          font-size: 14px;
          text-align: center;
          white-space: nowrap;
          cursor: pointer;
        }
        
        /* Assign larger width to Hip-Hop and Electronic */
        .category-button:nth-child(4), .category-button:nth-child(5) {
          min-width: 95px; /* Increased width to ensure text fits */
        }
        
        .category-button.selected {
          background: linear-gradient(135deg, rgba(255,0,204,0.3), rgba(51,51,255,0.3));
          border: 1px solid rgba(255,0,204,0.5);
          color: white;
          font-weight: 500;
        }
        
        /* Disco button styles */
        .disco-button {
          transition: all 0.3s ease;
        }
        
        .disco-button:hover {
          transform: scale(1.1);
        }
        
        .disco-button .glow {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
          top: -50%;
          left: -50%;
          opacity: 0.5;
          animation: disco-spin 3s linear infinite;
        }
        
        @keyframes disco-spin {
          0% {
            transform: rotate(0deg) translate(50%, 50%);
            opacity: 0.7;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: rotate(360deg) translate(50%, 50%);
            opacity: 0.7;
          }
        }
        
        /* Track panel animations */
        .track-selection-panel {
          transition: bottom 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        /* Pulsing animation for recording button */
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }

        /* Spinning animation for upload loader */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Toast animation */
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        
        /* Touch optimization for mobile */
        @media (hover: none) {
          .disco-button {
            -webkit-tap-highlight-color: transparent;
          }
          
          .disco-button:active {
            transform: scale(0.95);
          }
          
          /* Fixed tabs for mobile to prevent elastic behavior */
          .category-tabs-container {
            overflow: hidden;
          }
        }
        
        /* Scrollbar styling - only for content areas */
        div[style*="overflowY: auto"] {
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.2) transparent;
        }
        
        div[style*="overflowY: auto"]::-webkit-scrollbar {
          width: 5px;
        }
        
        div[style*="overflowY: auto"]::-webkit-scrollbar-track {
          background: transparent;
        }
        
        div[style*="overflowY: auto"]::-webkit-scrollbar-thumb {
          background-color: rgba(255,255,255,0.2);
          border-radius: 3px;
        }
        
        /* Additional adjustment for small screens */
        @media (max-height: 500px) {
          div[style*="marginTop: 25px"] {
            margin-top: 15px !important;
          }
        }

        /* Mobile optimizations for track items */
        @media (max-width: 480px) {
          /* Make track items more compact */
          div[style*="flexDirection: column"] {
            padding: 10px 12px;
          }

          /* Adjust font sizes for small screens */
          div[style*="fontSize: 16px"] {
            font-size: 14px !important;
          }

          div[style*="fontSize: 14px"] {
            font-size: 12px !important;
          }

          /* Make buttons smaller */
          button[style*="padding: 6px 12px"] {
            padding: 4px 10px !important;
            font-size: 12px !important;
          }

          button[style*="width: 28px"] {
            width: 24px !important;
            height: 24px !important;
          }
        }
      `}</style>
    </main>
  );
}