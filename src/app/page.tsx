"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown, faMicrophone, faMusic, faChartLine, faRss, faUpload, faPlay, faPause, faStar, faSearch, faCheck, faStop, faTrash, faDownload } from '@fortawesome/free-solid-svg-icons';

// Audio manager factory for reliable playback
const createAudioManager = () => {
  let currentTrack = null;
  let isCurrentlyPlaying = false;
  let activeAudio = null;
  
  return {
    playTrack: (track, onSuccess, onError) => {
      // Stop current audio if playing
      if (activeAudio) {
        activeAudio.pause();
        activeAudio = null;
      }
      
      // Reset state
      isCurrentlyPlaying = false;
      currentTrack = null;
      
      // Create new audio
      const audio = new Audio();
      
      // Set up event listeners
      audio.addEventListener('canplay', () => {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              isCurrentlyPlaying = true;
              currentTrack = track.id;
              if (onSuccess) onSuccess();
            })
            .catch(err => {
              console.error("Playback error:", err);
              if (onError) onError(err);
            });
        }
      });
      
      audio.addEventListener('error', (err) => {
        console.error("Audio error:", err);
        if (onError) onError(err);
      });
      
      // Load the track
      audio.src = track.audioUrl;
      activeAudio = audio;
    },
    
    stopPlayback: () => {
      if (activeAudio) {
        activeAudio.pause();
        activeAudio = null;
      }
      isCurrentlyPlaying = false;
      currentTrack = null;
    },
    
    isPlaying: () => isCurrentlyPlaying,
    getCurrentTrack: () => currentTrack
  };
};

export default function Home() {
  // Create audio manager
  const audioManager = useRef(createAudioManager()).current;
  
  // UI State
  const [isTrackPanelVisible, setIsTrackPanelVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Upload State
  const [isUploadPanelVisible, setIsUploadPanelVisible] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadCategory, setUploadCategory] = useState("Others");
  const [isUploading, setIsUploading] = useState(false);
  
  // Audio State
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  
  // Recording State
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingTimerId, setRecordingTimerId] = useState(null);
  const [isMixing, setIsMixing] = useState(false);
  const [mixProgress, setMixProgress] = useState(0);
  const [voiceGain, setVoiceGain] = useState(80);
  const [trackGain, setTrackGain] = useState(50);
  
  // Notification State
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ 
    visible: false, 
    title: '', 
    message: '', 
    onConfirm: null, 
    onCancel: null 
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
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);
  
  // Categories
  const categories = ["All", "Pop", "Rock", "Hip-Hop", "Electronic", "R&B", "Rap", "Others", "My Tracks"];

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: '', type: 'success' });
    }, 3000); // Hide after 3 seconds
  };

  // Load tracks from local storage on mount
  useEffect(() => {
    const savedTracks = localStorage.getItem('karaokeTracks');
    if (savedTracks) {
      try {
        setTracks(JSON.parse(savedTracks));
      } catch (e) {
        console.error("Error loading saved tracks:", e);
      }
    }
  }, []);

  // Save tracks to local storage when updated
  useEffect(() => {
    if (tracks.length > 0) {
      localStorage.setItem('karaokeTracks', JSON.stringify(tracks));
    }
  }, [tracks]);

  // Toggle track selection panel
  const toggleTrackSelectionPanel = () => {
    setIsTrackPanelVisible(!isTrackPanelVisible);
  };
  
  // Handle track selection
  const handleTrackSelect = (trackId) => {
    setSelectedTrack(trackId);
    // Don't automatically play when selecting
    if (isPlaying !== null) {
      audioManager.stopPlayback();
      setIsPlaying(null);
    }
  };
  
  // Handle play/pause toggle
  const togglePlay = (trackId, event) => {
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
  
  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
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
    setIsUploadPanelVisible(true);
    
    // Reset file input
    event.target.value = null;
  };
  
  // Function to perform the actual upload
  const performUpload = () => {
    if (!uploadFile) return;
    
    setIsUploading(true);
    
    // Create file URL
    const audioUrl = URL.createObjectURL(uploadFile);
    
    // Create audio element to get duration
    const audio = new Audio();
    audio.src = audioUrl;
    
    audio.addEventListener('error', () => {
      showToast('This audio file format is not supported. Please try another format like MP3 or WAV.', 'error');
      URL.revokeObjectURL(audioUrl);
      setIsUploading(false);
      setIsUploadPanelVisible(false);
    });
    
    audio.addEventListener('loadedmetadata', () => {
      if (isNaN(audio.duration)) {
        showToast('Could not determine audio duration. The file might be corrupt.', 'error');
        URL.revokeObjectURL(audioUrl);
        setIsUploading(false);
        setIsUploadPanelVisible(false);
        return;
      }
      
      const duration = audio.duration;
      
      // Format duration
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      // Create new track
      const newTrack = {
        id: generateUniqueId(),
        title: uploadFile.name.replace(/\.[^/.]+$/, ""), // Remove extension
        artist: 'User Upload',
        duration: formattedDuration,
        audioUrl: audioUrl,
        popular: false,
        category: uploadCategory
      };
      
      // Add track to list
      setTracks(prevTracks => [...prevTracks, newTrack]);
      
      // Reset upload state
      setIsUploading(false);
      setIsUploadPanelVisible(false);
      setUploadFile(null);
      
      // Show success message
      showToast(`Track "${newTrack.title}" uploaded successfully!`, 'success');
    });
  };
  
  // Delete a track
  const deleteTrack = (trackId, event) => {
    event.stopPropagation();
    
    const confirmDelete = () => {
      // If currently playing, stop it
      if (isPlaying === trackId) {
        audioManager.stopPlayback();
        setIsPlaying(null);
      }
      
      setTracks(prevTracks => prevTracks.filter(track => track.id !== trackId));
      
      if (selectedTrack === trackId) {
        setSelectedTrack(null);
      }
      
      showToast('Track deleted successfully', 'success');
      
      // Close the dialog
      setConfirmDialog({ visible: false });
    };
    
    // Show a custom confirmation dialog
    setConfirmDialog({
      visible: true,
      title: 'Delete Track',
      message: 'Are you sure you want to delete this track?',
      onConfirm: confirmDelete,
      onCancel: () => setConfirmDialog({ visible: false })
    });
  };
  
  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Replace the startRecording function with this WebAudio mixing approach
  const startRecording = async () => {
    if (!selectedTrack) return;
    
    try {
      // Create a new AudioContext
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Get microphone stream
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const micSource = audioContext.createMediaStreamSource(micStream);
      
      // Create gain nodes for volume control
      const micGainNode = audioContext.createGain();
      micGainNode.gain.value = voiceGain / 100;
      micSource.connect(micGainNode);
      
      // Create a destination to capture the mic input
      const micDestination = audioContext.createMediaStreamDestination();
      micGainNode.connect(micDestination);
      
      // Set up recording of the mic
      mediaRecorderRef.current = new MediaRecorder(micDestination.stream);
      audioChunksRef.current = [];
      
      // Get backing track
      const trackToPlay = tracks.find(track => track.id === selectedTrack);
      
      // Setup audio element for backing track
      if (trackToPlay && audioRef.current) {
        audioRef.current.src = trackToPlay.audioUrl;
        audioRef.current.volume = trackGain / 100;
        
        try {
          // Play the backing track
          await audioRef.current.play();
          
          // Start recording the mic
          mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };
          
          mediaRecorderRef.current.onstop = () => {
            // Create blob from recorded audio
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // Store recorded data
            setRecordedBlob({ 
              blob: audioBlob, 
              url: audioUrl,
              trackId: selectedTrack,
              duration: formatTime(recordingTime),
              trackUrl: trackToPlay.audioUrl  // Store backing track URL for later
            });
            
            audioChunksRef.current = [];
            
            // Reset recording timer
            clearInterval(recordingTimerId);
            setRecordingTimerId(null);
            setRecordingTime(0);
            
            showToast("Recording completed! You can now play it back or save it.", "success");
          };
          
          // Start the recording
          mediaRecorderRef.current.start();
          
          // Start a timer to display recording duration
          const timerId = setInterval(() => {
            setRecordingTime(prev => prev + 1);
          }, 1000);
          
          setRecordingTimerId(timerId);
          setIsRecording(true);
          
          showToast("Now recording! Sing along with the music.", "info");
        } catch (error) {
          console.error("Error playing backing track:", error);
          showToast("Could not play the backing track. Please try another track.", "error");
        }
      } else {
        showToast("No track selected or track not found.", "error");
      }
    } catch (error) {
      console.error("Error starting recording:", error);
      showToast("Could not access microphone. Please check permissions.", "error");
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop the backing track
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      // Stop all tracks on the stream
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      
      // Clear recording timer
      if (recordingTimerId) {
        clearInterval(recordingTimerId);
        setRecordingTimerId(null);
      }
    }
  };
  
  // Replace the mixRecording function with this improved version
  const mixRecording = () => {
    if (!recordedBlob) return;
    
    setIsMixing(true);
    setMixProgress(0);
    
    // Find the original track
    const originalTrack = tracks.find(track => track.id === recordedBlob.trackId);
    const originalTrackName = originalTrack ? originalTrack.title : 'Unknown Track';
    
    // Simulate mixing progress
    const interval = setInterval(() => {
      setMixProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsMixing(false);
            
            // Create a new track from the recording with better metadata
            const now = new Date();
            const formattedDate = `${now.getMonth()+1}/${now.getDate()}/${now.getFullYear()}`;
            const trackName = `${originalTrackName} - My Version (${formattedDate})`;
            
            // Create a fully qualified URL for the recording
            const recordingUrl = recordedBlob.url;
            
            // Check if this recording already exists in the tracks
            const recordingExists = tracks.some(track => 
              track.audioUrl === recordingUrl || 
              (track.title === trackName && track.category === "My Tracks")
            );
            
            // Only add if it doesn't already exist
            if (!recordingExists) {
              const newTrack = {
                id: generateUniqueId(),
                title: trackName,
                artist: 'My Voice',
                duration: recordedBlob.duration || "0:00",
                audioUrl: recordingUrl,
                popular: false,
                category: "My Tracks",
                originalTrackId: recordedBlob.trackId,
                isRecording: true
              };
              
              // Add to tracks
              setTracks(prevTracks => [...prevTracks, newTrack]);
              showToast("Your karaoke track has been saved to My Tracks!", 'success');
            } else {
              showToast("This recording is already saved in My Tracks", 'info');
            }
            
            // Close recording panel and automatically switch to My Tracks category
            setRecordedBlob(null);
            setSelectedCategory("My Tracks");
          }, 500);
        }
        return newProgress;
      });
    }, 100);
  };

  // Add a download function for recordings
  const downloadRecording = () => {
    if (!recordedBlob) return;
    
    // Create a temporary link
    const a = document.createElement('a');
    a.href = recordedBlob.url;
    
    // Create a good filename
    const originalTrack = tracks.find(track => track.id === recordedBlob.trackId);
    const originalTrackName = originalTrack ? originalTrack.title : 'Karaoke';
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    a.download = `${originalTrackName}-MyVoice-${timestamp}.webm`;
    
    // Add to DOM, click, and remove
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    showToast("Your recording has been downloaded!", "success");
  };
  
 // Filter tracks by search query and category
const filteredTracks = tracks.filter(track => {
  const matchesCategory = selectedCategory === "All" || track.category === selectedCategory;
  const matchesSearch = searchQuery === "" || 
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    track.artist.toLowerCase().includes(searchQuery.toLowerCase());
  
  return matchesCategory && matchesSearch;
});

// Ensure we have unique IDs using native JavaScript
const uniqueFilteredTracks = filteredTracks.filter((track, index, self) => 
  index === self.findIndex((t) => t.id === track.id)
);

// Sort tracks: popular first, then alphabetically by title
const sortedTracks = [...uniqueFilteredTracks].sort((a, b) => {
  if (a.popular !== b.popular) return a.popular ? -1 : 1;
  return a.title.localeCompare(b.title);
});

  // Toast notification component
  const ToastNotification = () => {
    if (!toast.visible) return null;
    
    const bgColor = toast.type === 'success' ? 'rgba(51,204,51,0.9)' : 
                  toast.type === 'error' ? 'rgba(255,51,51,0.9)' : 
                  'rgba(0,153,255,0.9)';
    
    return (
      <div style={{
        position: 'fixed',
        bottom: '160px', // Above bottom panel
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: bgColor,
        color: 'white',
        padding: '12px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        zIndex: 1000,
        maxWidth: '90%',
        textAlign: 'center',
        animation: 'fadeIn 0.3s ease-out'
      }}>
        {toast.message}
      </div>
    );
  };

  // Confirmation dialog component
  const ConfirmationDialog = () => {
    if (!confirmDialog.visible) return null;
    
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1100
      }}>
        <div style={{
          width: '90%',
          maxWidth: '320px',
          backgroundColor: '#1a1a1a',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 6px 24px rgba(0,0,0,0.3)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: 'white' }}>{confirmDialog.title}</h3>
          <p style={{ margin: '0 0 20px 0', color: 'rgba(255,255,255,0.8)' }}>{confirmDialog.message}</p>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              onClick={confirmDialog.onCancel}
              style={{
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={confirmDialog.onConfirm}
              style={{
                padding: '8px 16px',
                background: 'rgba(255,51,51,0.8)',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

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
        <div style={{
          textAlign: "center",
          marginTop: "25px",
          padding: "0 20px"
        }}>
          {/* Logo with Beta tag */}
          <div style={{ position: "relative", display: "inline-block" }}>
            <h1 style={{
              fontSize: "clamp(32px, 6vw, 38px)",
              fontWeight: "bold",
              margin: "0",
              background: "linear-gradient(to right, #ff9900, #ff00ff, #00ffff)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)"
            }}>
              karaokeGoGo
              <span style={{
                position: "relative",
                top: "clamp(-14px, -3vw, -16px)",
                fontSize: "clamp(12px, 3vw, 15px)",
                fontWeight: "normal",
                background: "linear-gradient(to right, #ff00cc, #00ccff)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                marginLeft: "5px",
                padding: "2px 6px",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "8px"
              }}>
                beta
              </span>
            </h1>
          </div>
          
          {/* Tagline with reduced spacing */}
          <p style={{
            fontSize: "clamp(14px, 3.5vw, 18px)",
            margin: "5px 0 0 0",
            color: "rgba(255,255,255,0.95)",
            fontWeight: "300",
            letterSpacing: "1px",
            textShadow: "0 1px 3px rgba(0,0,0,0.5)"
          }}>
            Pour your soul. Remix your world.
          </p>
        </div>
        
        {/* Empty flex space to push content to top */}
        <div style={{ flexGrow: 1 }}></div>
      </div>
      
      {/* Hidden audio element for playback */}
      <audio ref={audioRef} style={{ display: 'none' }} />
      
      {/* Hidden file input for uploads */}
      <input 
        type="file" 
        ref={fileInputRef}
        style={{ display: 'none' }} 
        accept="audio/*"
        onChange={handleFileSelect}
      />

      {/* Recording indicator */}
      {isRecording && (
        <div style={{
          position: "fixed",
          bottom: "140px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "rgba(0,0,0,0.8)",
          borderRadius: "15px",
          padding: "10px 20px",
          boxShadow: "0 0 20px rgba(255,0,0,0.3)",
          animation: "pulse 1.5s infinite",
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          gap: "15px"
        }}>
          <div style={{ 
            width: "15px", 
            height: "15px", 
            borderRadius: "50%", 
            backgroundColor: "red" 
          }}></div>
          <span style={{ fontWeight: "bold" }}>Recording: {formatTime(recordingTime)}</span>
        </div>
      )}
      
      {/* Bottom panel with four disco-style circle buttons - Always visible */}
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
        <div style={{ 
          display: "flex", 
          gap: "max(15px, min(30px, 4vw))",
          justifyContent: "center",
          padding: "5px 20px",
          minWidth: "fit-content"
        }}>
          {/* Sing-Along Button */}
          <button
            onClick={toggleTrackSelectionPanel}
            style={{
              width: "clamp(60px, 15vw, 75px)",
              height: "clamp(60px, 15vw, 75px)",
              minWidth: "60px",
              background: "radial-gradient(circle, #ff00cc, #660066)",
              color: "white",
              borderRadius: "50%",
              border: "2px solid #ff66cc",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 0 20px #ff00cc, inset 0 0 10px rgba(255,255,255,0.3)",
              position: "relative",
              overflow: "hidden"
            }}
            className="disco-button"
          >
            <div className="glow"></div>
            <FontAwesomeIcon icon={faMicrophone} style={{ fontSize: "clamp(16px, 4vw, 24px)", position: "relative", zIndex: 2 }} />
            <span style={{ fontSize: "clamp(9px, 2vw, 12px)", marginTop: "4px", position: "relative", zIndex: 2 }}>Sing-Along</span>
          </button>
          
          <button
            style={{
              width: "clamp(60px, 15vw, 75px)",
              height: "clamp(60px, 15vw, 75px)",
              minWidth: "60px",
              background: "radial-gradient(circle, #00ccff, #0066cc)",
              color: "white",
              borderRadius: "50%",
              border: "2px solid #66ccff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 0 20px #00ccff, inset 0 0 10px rgba(255,255,255,0.3)",
              position: "relative",
              overflow: "hidden"
            }}
            className="disco-button"
            onClick={() => setSelectedCategory("My Tracks")}
          >
            <div className="glow"></div>
            <FontAwesomeIcon icon={faMusic} style={{ fontSize: "clamp(16px, 4vw, 24px)", position: "relative", zIndex: 2 }} />
            <span style={{ fontSize: "clamp(9px, 2vw, 12px)", marginTop: "4px", position: "relative", zIndex: 2 }}>My Mix</span>
          </button>
          
          <button
            style={{
              width: "clamp(60px, 15vw, 75px)",
              height: "clamp(60px, 15vw, 75px)",
              minWidth: "60px",
              background: "radial-gradient(circle, #ffcc00, #cc6600)",
              color: "white",
              borderRadius: "50%",
              border: "2px solid #ffdd66",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 0 20px #ffcc00, inset 0 0 10px rgba(255,255,255,0.3)",
              position: "relative",
              overflow: "hidden"
            }}
            className="disco-button"
          >
            <div className="glow"></div>
            <FontAwesomeIcon icon={faChartLine} style={{ fontSize: "clamp(16px, 4vw, 24px)", position: "relative", zIndex: 2 }} />
            <span style={{ fontSize: "clamp(9px, 2vw, 12px)", marginTop: "4px", position: "relative", zIndex: 2 }}>Top Charts</span>
          </button>
          
          <button
            style={{
              width: "clamp(60px, 15vw, 75px)",
              height: "clamp(60px, 15vw, 75px)",
              minWidth: "60px",
              background: "radial-gradient(circle, #33cc33, #006600)",
              color: "white",
              borderRadius: "50%",
              border: "2px solid #66dd66",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 0 20px #33cc33, inset 0 0 10px rgba(255,255,255,0.3)",
              position: "relative",
              overflow: "hidden"
            }}
            className="disco-button"
          >
            <div className="glow"></div>
            <FontAwesomeIcon icon={faRss} style={{ fontSize: "clamp(16px, 4vw, 24px)", position: "relative", zIndex: 2 }} />
            <span style={{ fontSize: "clamp(9px, 2vw, 12px)", marginTop: "4px", position: "relative", zIndex: 2 }}>Feed</span>
          </button>
        </div>
      </div>
      
      {/* Track Selection Panel - Slide up when triggered */}
      <div 
        ref={trackPanelRef}
        style={{
          position: "fixed",
          bottom: isTrackPanelVisible ? "0" : "-100%",
          left: 0,
          width: "100%",
          height: "85%", // Make it partial screen height
          background: "rgba(18, 18, 18, 0.95)",
          zIndex: 25, // Higher than bottom panel
          display: "flex",
          flexDirection: "column",
          color: "white",
          transition: "bottom 0.3s ease-out",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          boxShadow: "0 -5px 20px rgba(0,0,0,0.5)"
        }}
        className="track-selection-panel"
      >
        {/* Panel header with drag handle */}
        <div style={{
          padding: "8px 0",
          display: "flex",
          justifyContent: "center",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          background: "linear-gradient(to right, rgba(36,14,50,1) 0%, rgba(18,18,18,1) 100%)"
        }}>
          <div style={{
            width: "40px",
            height: "5px",
            backgroundColor: "rgba(255,255,255,0.3)",
            borderRadius: "3px"
          }}></div>
        </div>
        
        {/* Panel title with close button */}
        <div style={{
          padding: "15px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          background: "linear-gradient(to right, rgba(36,14,50,0.8) 0%, rgba(18,18,18,0.8) 100%)"
        }}>
          <h2 style={{
            margin: 0,
            fontSize: "24px",
            fontWeight: "bold",
            background: "linear-gradient(to right, #ff9900, #ff00ff)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent"
          }}>
            Select Karaoke Track
          </h2>
          
          {/* Close button for track panel */}
          <button 
            className="pink-arrow-button"
            onClick={() => {
              setIsTrackPanelVisible(false);
            }}
            style={{
              width: "40px",
              height: "40px",
              fontSize: "18px"
            }}
          >
            <FontAwesomeIcon icon={faChevronDown} />
          </button>
        </div>
        
        {/* Search and upload bar */}
        <div style={{
          padding: "15px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(0,0,0,0.3)"
        }}>
          <div style={{
            position: "relative",
            width: "60%"
          }}>
            <input 
              type="text"
              placeholder="Search for tracks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 15px 8px 35px",
                borderRadius: "20px",
                border: "none",
                background: "rgba(255,255,255,0.15)",
                color: "white",
                fontSize: "14px"
              }}
            />
            <span style={{ position: "absolute", left: "12px", top: "10px", color: "rgba(255,255,255,0.5)" }}>
              <FontAwesomeIcon icon={faSearch} />
            </span>
          </div>
          <button 
            style={{
              background: "rgba(255,0,204,0.2)",
              border: "1px solid #ff00cc",
              borderRadius: "20px",
              padding: "8px 15px",
              color: "#ff66cc",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer"
            }}
            onClick={() => fileInputRef.current.click()}
          >
            <FontAwesomeIcon icon={faUpload} />
            <span>Upload Track</span>
          </button>
        </div>
        
        {/* Category tabs */}
        <div className="category-tabs-container">
          <div className="category-tabs">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`category-button ${selectedCategory === category ? 'selected' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Tracks section */}
        <div style={{ 
          padding: "15px 20px", 
          overflowY: "auto", 
          flexGrow: 1
        }}>
          {sortedTracks.length > 0 ? (
            <>
              <h3 style={{ margin: "0 0 15px 0", fontSize: "18px", color: "rgba(255,255,255,0.9)" }}>
                <FontAwesomeIcon icon={faStar} style={{ marginRight: "8px", color: "#ffcc00" }} />
                Available Tracks
              </h3>
              
              {/* Track list */}
              <div>
                {sortedTracks.map(track => (
                  <div 
                    key={track.id}
                    style={{
                      padding: "12px 15px",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "8px",
                      marginBottom: "10px",
                      background: track.id === selectedTrack 
                        ? "rgba(255,0,204,0.15)"
                        : "rgba(255,255,255,0.05)",
                      border: track.id === selectedTrack 
                        ? "1px solid rgba(255,0,204,0.3)"
                        : "1px solid transparent",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                    onClick={() => handleTrackSelect(track.id)}
                  >
                    {/* First row with track info */}
                    <div style={{ 
                      display: "flex",
                      alignItems: "center",
                      width: "100%"
                    }}>
                      <button
                        onClick={(e) => togglePlay(track.id, e)}
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background: "rgba(255,0,204,0.2)",
                          border: "none",
                          color: "#ff66cc",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: "15px",
                          cursor: "pointer",
                          flexShrink: 0
                        }}
                      >
                        <FontAwesomeIcon icon={isPlaying === track.id ? faPause : faPlay} />
                      </button>
                      <div style={{ 
                        flexGrow: 1,
                        minWidth: 0 // Allows text to properly truncate
                      }}>
                        <div style={{ 
                          fontSize: "16px", 
                          fontWeight: "500",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}>
                          {track.title}
                        </div>
                        <div style={{ 
                          fontSize: "14px", 
                          color: "rgba(255,255,255,0.6)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}>
                          {track.artist}
                        </div>
                      </div>
                      <div style={{ 
                        color: "rgba(255,255,255,0.6)", 
                        fontSize: "14px",
                        marginLeft: "15px",
                        flexShrink: 0
                      }}>
                        {track.duration}
                      </div>
                    </div>
                    
                    {/* Second row with actions */}
                    <div style={{ 
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "8px",
                      alignItems: "center"
                    }}>
                      <div style={{ 
                        fontSize: "12px", 
                        color: "rgba(255,255,255,0.5)",
                        background: "rgba(255,255,255,0.1)",
                        padding: "2px 8px",
                        borderRadius: "10px"
                      }}>
                        {track.category}
                      </div>
                      <div style={{ 
                        display: "flex",
                        gap: "10px"
                      }}>
                        <button
                          onClick={(e) => deleteTrack(track.id, e)}
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            background: "rgba(255,0,0,0.2)",
                            border: "none",
                            color: "rgba(255,100,100,0.9)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer"
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} style={{ fontSize: "14px" }} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTrackSelect(track.id);
                          }}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "15px",
                            background: track.id === selectedTrack 
                              ? "linear-gradient(135deg, #ff00cc, #660066)" 
                              : "rgba(255,255,255,0.1)",
                            border: "none",
                            color: "white",
                            fontSize: "14px",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            cursor: "pointer"
                          }}
                        >
                          {track.id === selectedTrack ? (
                            <>
                              <FontAwesomeIcon icon={faCheck} />
                              <span>Selected</span>
                            </>
                          ) : (
                            <span>Select</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ 
              textAlign: "center", 
              marginTop: "40px", 
              color: "rgba(255,255,255,0.6)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px"
            }}>
              <div style={{ fontSize: "24px", marginBottom: "10px" }}>
                <FontAwesomeIcon icon={faMusic} />
              </div>
              <p>No tracks available. Upload some tracks to get started!</p>
              <button
                onClick={() => fileInputRef.current.click()}
                style={{
                  background: "rgba(255,0,204,0.2)",
                  border: "1px solid #ff00cc",
                  borderRadius: "20px",
                  padding: "12px 25px",
                  color: "#ff66cc",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                  fontSize: "16px"
                }}
              >
                <FontAwesomeIcon icon={faUpload} />
                <span>Upload Your First Track</span>
              </button>
            </div>
          )}
          
          {/* Recording configuration sliders */}
          {selectedTrack && !isRecording && !recordedBlob && (
            <div style={{
              marginBottom: "20px",
              padding: "15px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.1)"
            }}>
              <h3 style={{ marginTop: 0, marginBottom: "15px", fontSize: "16px" }}>Configure Recording</h3>
              
              <div style={{ marginBottom: "15px" }}>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "5px"
                }}>
                  <label style={{ fontSize: "14px" }}>Your Voice: {voiceGain}%</label>
                  <span style={{ 
                    width: "30px", 
                    textAlign: "center", 
                    fontSize: "12px",
                    padding: "2px 5px",
                    background: "rgba(255,0,204,0.2)",
                    borderRadius: "4px"
                  }}>
                    {voiceGain}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={voiceGain}
                  onChange={(e) => setVoiceGain(parseInt(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>
              
              <div style={{ marginBottom: "10px" }}>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "5px"
                }}>
                  <label style={{ fontSize: "14px" }}>Backing Track: {trackGain}%</label>
                  <span style={{ 
                    width: "30px", 
                    textAlign: "center", 
                    fontSize: "12px",
                    padding: "2px 5px",
                    background: "rgba(51,51,255,0.2)",
                    borderRadius: "4px"
                  }}>
                    {trackGain}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={trackGain}
                  onChange={(e) => setTrackGain(parseInt(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          )}
          
          {/* Recording preview if available */}
          {recordedBlob && (
            <div style={{
              marginTop: "20px",
              padding: "15px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.1)"
            }}>
              <h3 style={{ marginTop: 0, marginBottom: "15px", fontSize: "18px", color: "#ff66cc" }}>
                Your Karaoke Recording
              </h3>
              
              <audio controls src={recordedBlob.url} style={{ width: "100%", marginBottom: "15px" }} />
              
              {!isMixing ? (
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  gap: "10px" 
                }}>
                  <button
                    style={{
                      flex: 1,
                      padding: "10px 15px",
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "15px",
                      color: "white",
                      cursor: "pointer"
                    }}
                    onClick={() => setRecordedBlob(null)}
                  >
                    <FontAwesomeIcon icon={faTrash} style={{ marginRight: "8px" }} />
                    Delete Recording
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: "10px 15px",
                      background: "rgba(0,153,255,0.3)",
                      border: "1px solid rgba(0,153,255,0.5)",
                      borderRadius: "15px",
                      color: "white",
                      cursor: "pointer"
                    }}
                    onClick={downloadRecording}
                  >
                    <FontAwesomeIcon icon={faDownload} style={{ marginRight: "8px" }} />
                    Download
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: "10px 15px",
                      background: "linear-gradient(135deg, #ff00cc, #990099)",
                      border: "none",
                      borderRadius: "15px",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: "bold"
                    }}
                    onClick={mixRecording}
                  >
                    <FontAwesomeIcon icon={faMusic} style={{ marginRight: "8px" }} />
                    Save to My Tracks
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: "10px" }}>
                    <div style={{ 
                      fontSize: "14px", 
                      marginBottom: "5px", 
                      display: "flex", 
                      justifyContent: "space-between" 
                    }}>
                      <span>Mixing your karaoke track...</span>
                      <span>{mixProgress}%</span>
                    </div>
                    <div style={{ 
                      height: "10px", 
                      background: "rgba(255,255,255,0.1)", 
                      borderRadius: "5px",
                      overflow: "hidden"
                    }}>
                      <div style={{ 
                        height: "100%", 
                        width: `${mixProgress}%`, 
                        background: "linear-gradient(to right, #ff00cc, #9900ff)",
                        transition: "width 0.3s ease-out"
                      }}></div>
                    </div>
                  </div>
                  <p style={{ 
                    fontSize: "12px", 
                    color: "rgba(255,255,255,0.6)",
                    textAlign: "center" 
                  }}>
                    Please wait while we process your recording...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Record button at bottom - only shows when track is selected */}
        {selectedTrack && (
          <div style={{
            padding: "15px 20px",
            background: "linear-gradient(to top, rgba(18,18,18,1), rgba(18,18,18,0.8))",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            justifyContent: "center"
          }}>
            {!isRecording ? (
              <button
                style={{
                  background: "linear-gradient(135deg, #ff00cc, #660066)",
                  border: "none",
                  borderRadius: "30px",
                  padding: "12px 25px",
                  width: "100%",
                  maxWidth: "400px",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "16px",
                  cursor: "pointer",
                  boxShadow: "0 0 20px rgba(255, 0, 204, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px"
                }}
                onClick={startRecording}
              >
                <FontAwesomeIcon icon={faMicrophone} />
                Sing with this track
              </button>
            ) : (
              <button
                style={{
                  background: "linear-gradient(135deg, #ff3333, #990000)",
                  border: "none",
                  borderRadius: "30px",
                  padding: "12px 25px",
                  width: "100%",
                  maxWidth: "400px",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "16px",
                  cursor: "pointer",
                  boxShadow: "0 0 20px rgba(255, 51, 51, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  animation: "pulse 1.5s infinite"
                }}
                onClick={stopRecording}
              >
                <FontAwesomeIcon icon={faStop} />
                Stop Recording
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Upload Panel Modal */}
      {isUploadPanelVisible && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.8)',
          zIndex: 100,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            width: '90%',
            maxWidth: '500px',
            background: 'linear-gradient(to bottom, rgba(36,14,50,1) 0%, rgba(18,18,18,1) 100%)',
            borderRadius: '15px',
            padding: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <h3 style={{
              fontSize: '20px',
              margin: '0 0 20px 0',
              color: 'white',
              textAlign: 'center',
              background: 'linear-gradient(to right, #ff9900, #ff00ff)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent'
            }}>
              Upload Track
            </h3>
            
            <div style={{
              marginBottom: '20px'
            }}>
              <p style={{ 
                margin: '0 0 5px 0',
                color: 'rgba(255,255,255,0.7)'
              }}>
                Selected file: <span style={{ color: 'white' }}>{uploadFile?.name}</span>
              </p>
            </div>
            
            <div style={{
              marginBottom: '20px'
            }}>
              <p style={{ 
                margin: '0 0 10px 0',
                color: 'rgba(255,255,255,0.7)'
              }}>
                Select category:
              </p>
              
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                {categories.filter(cat => cat !== "All" && cat !== "My Tracks").map(category => (
                  <button
                    key={category}
                    onClick={() => setUploadCategory(category)}
                    style={{
                      padding: '8px 15px',
                      borderRadius: '20px',
                      background: uploadCategory === category
                        ? 'linear-gradient(135deg, rgba(255,0,204,0.3), rgba(51,51,255,0.3))'
                        : 'rgba(255,255,255,0.1)',
                      border: uploadCategory === category
                        ? '1px solid rgba(255,0,204,0.5)'
                        : '1px solid rgba(255,255,255,0.1)',
                      color: uploadCategory === category ? 'white' : 'rgba(255,255,255,0.7)',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '30px'
            }}>
              <button
                onClick={() => {
                  setIsUploadPanelVisible(false);
                  setUploadFile(null);
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer'
                }}
                disabled={isUploading}
              >
                Cancel
              </button>
              
              <button
                onClick={performUpload}
                style={{
                  padding: '10px 25px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #ff00cc, #660066)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <div style={{ 
                      width: '16px', 
                      height: '16px', 
                      border: '2px solid rgba(255,255,255,0.3)', 
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faUpload} />
                    <span>Upload Track</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Notification */}
      <ToastNotification />
      
      {/* Confirmation Dialog */}
      <ConfirmationDialog />
      
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