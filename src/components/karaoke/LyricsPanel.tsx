// src/components/karaoke/LyricsPanel.tsx
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

interface LyricsPanelProps {
  visible: boolean;
  track: any;
  isPlaying: boolean;
  onClose: () => void;
  onTogglePlay: () => void;
  currentTime?: number; // Current playback time in seconds
}

// Interface for parsed lyrics
interface LyricLine {
  time: number; // Time in seconds
  text: string; // The lyric text
}

export default function LyricsPanel({
  visible,
  track,
  isPlaying,
  onClose,
  onTogglePlay,
  currentTime = 0
}: LyricsPanelProps) {
  const [activeLineIndex, setActiveLineIndex] = useState<number>(-1);
  const [parsedLyrics, setParsedLyrics] = useState<LyricLine[]>([]);
  const activeLyricRef = useRef<HTMLDivElement>(null);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  
  // Parse lyrics when track changes
  useEffect(() => {
    if (track?.lyrics) {
      // Check if lyrics have timestamps [00:00.00]
      const hasTimestamps = /\[\d{2}:\d{2}\.\d{2}\]/.test(track.lyrics);
      
      if (hasTimestamps) {
        // Parse timestamped lyrics
        const lines = track.lyrics.split('\n');
        const parsed: LyricLine[] = [];
        
        lines.forEach(line => {
          // Match timestamp pattern [mm:ss.ms]
          const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2})\](.*)/);
          
          if (match) {
            const minutes = parseInt(match[1], 10);
            const seconds = parseInt(match[2], 10);
            const milliseconds = parseInt(match[3], 10) * 10; // Convert to milliseconds
            
            const timeInSeconds = minutes * 60 + seconds + milliseconds / 1000;
            const text = match[4].trim();
            
            parsed.push({
              time: timeInSeconds,
              text: text
            });
          } else if (line.trim()) {
            // Handle lines without timestamps (like headers)
            parsed.push({
              time: -1, // Special marker for non-timed lines
              text: line.trim()
            });
          }
        });
        
        // Sort by time
        const sortedLyrics = parsed.sort((a, b) => {
          // Keep non-timed lines at the top
          if (a.time === -1) return -1;
          if (b.time === -1) return 1;
          return a.time - b.time;
        });
        
        setParsedLyrics(sortedLyrics);
      } else {
        // Handle plain lyrics without timestamps
        const lines = track.lyrics.split('\n');
        const parsed: LyricLine[] = lines
          .filter(line => line.trim())
          .map(line => ({
            time: -1,
            text: line.trim()
          }));
        
        setParsedLyrics(parsed);
      }
    } else {
      setParsedLyrics([]);
    }
  }, [track]);
  
  // Update active line based on current playback time
  useEffect(() => {
    if (!isPlaying || parsedLyrics.length === 0) {
      return;
    }
    
    // Find the appropriate line based on current time
    let foundIndex = -1;
    
    for (let i = parsedLyrics.length - 1; i >= 0; i--) {
      const line = parsedLyrics[i];
      if (line.time !== -1 && line.time <= currentTime) {
        foundIndex = i;
        break;
      }
    }
    
    setActiveLineIndex(foundIndex);
    
    // Scroll to active line
    if (foundIndex !== -1 && activeLyricRef.current && lyricsContainerRef.current) {
      activeLyricRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [currentTime, isPlaying, parsedLyrics]);
  
  if (!visible) return null;
  
  // Handle play button click with proper error prevention
  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Call the provided onTogglePlay function
    onTogglePlay();
  };
  
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.9)",
      backdropFilter: "blur(10px)",
      zIndex: 50,
      display: "flex",
      flexDirection: "column",
      color: "white"
    }}>
      {/* Header */}
      <div style={{
        padding: "15px 20px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <h2 style={{ 
            margin: 0,
            fontSize: "20px",
            fontWeight: "600",
            background: "linear-gradient(to right, #ff9900, #ff00ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Lyrics
          </h2>
          {track && (
            <p style={{
              margin: "5px 0 0 0",
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.7)"
            }}>
              {track.title} - {track.artist}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            cursor: "pointer"
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      
      {/* Lyrics Content */}
      <div 
        ref={lyricsContainerRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          textAlign: "center",
          background: "linear-gradient(to bottom, rgba(36,14,50,0.7) 0%, rgba(18,18,18,0.7) 100%)"
        }}
      >
        {parsedLyrics.length > 0 ? (
          parsedLyrics.map((line, index) => (
            <div
              key={index}
              ref={index === activeLineIndex ? activeLyricRef : null}
              style={{
                fontSize: index === activeLineIndex ? "22px" : "18px",
                marginBottom: "20px",
                transition: "all 0.3s ease",
                color: index === activeLineIndex 
                  ? "white" 
                  : line.time === -1 
                    ? "rgba(255, 255, 255, 0.5)"  // Header/non-timestamped lines
                    : "rgba(255, 255, 255, 0.8)",
                fontWeight: index === activeLineIndex ? "bold" : "normal",
                opacity: line.time >= 0 && line.time > currentTime + 60 ? 0.3 : 1, // Dim far future lines
                textShadow: index === activeLineIndex ? "0 0 10px rgba(255, 102, 204, 0.8)" : "none"
              }}
            >
              {line.text}
            </div>
          ))
        ) : (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            opacity: 0.7
          }}>
            <p>No lyrics available for this track.</p>
          </div>
        )}
      </div>
      
      {/* Playback Controls */}
      <div style={{
        padding: "20px",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        display: "flex",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.3)"
      }}>
        <button
          onClick={handlePlayClick}
          style={{
            background: "linear-gradient(135deg, #ff00cc, #660066)",
            border: "none",
            borderRadius: "30px",
            padding: "10px 25px",
            color: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "16px",
            boxShadow: "0 0 20px rgba(255, 0, 204, 0.3)"
          }}
          type="button"
        >
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
}