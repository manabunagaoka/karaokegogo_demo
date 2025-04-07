"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Track } from '@/lib/audio-manager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faPlay, 
  faPause,
  faStepBackward,
  faStepForward,
  faBackward,
  faForward,
  faRedo
} from '@fortawesome/free-solid-svg-icons';

interface LyricsPanelProps {
  visible: boolean;
  track: Track | null;
  isPlaying: boolean;
  currentTime: number;
  onClose: () => void;
  onTogglePlay: () => void;
  // Track navigation props
  onNextTrack?: () => void;
  onPreviousTrack?: () => void;
  // Seek functionality props
  onFastForward?: () => void;
  onRewind?: () => void;
  onRestart?: () => void;
}

export default function LyricsPanel({
  visible,
  track,
  isPlaying,
  currentTime,
  onClose,
  onTogglePlay,
  onNextTrack,
  onPreviousTrack,
  onFastForward,
  onRewind,
  onRestart
}: LyricsPanelProps) {
  const [lyrics, setLyrics] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState<number>(0);
  const [parsedLines, setParsedLines] = useState<{time: number, text: string}[]>([]);
  
  // Ref for lyrics container to auto-scroll
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const currentLineRef = useRef<HTMLDivElement>(null);
  
  // Parse lyrics with timestamps [00:00.00] format when the track changes
  useEffect(() => {
    if (!track || !track.lyrics) {
      setLyrics([]);
      setParsedLines([]);
      return;
    }
    
    try {
      const lyricsText = track.lyrics;
      
      // Check if the lyrics have timestamps in format [mm:ss.xx]
      const hasTimestamps = /\[\d{2}:\d{2}\.\d{2}\]/.test(lyricsText);
      
      if (hasTimestamps) {
        // Parse timestamps and lyrics
        const parsedLyrics: {time: number, text: string}[] = [];
        const lines = lyricsText.split('\n');
        
        lines.forEach(line => {
          // Find all timestamp matches in the line
          const matches = [...line.matchAll(/\[(\d{2}):(\d{2})\.(\d{2})\]/g)];
          
          if (matches.length > 0) {
            // Get the text part (after all timestamps)
            const textStart = matches[matches.length - 1].index! + matches[matches.length - 1][0].length;
            const text = line.substring(textStart).trim();
            
            // Process each timestamp in the line
            matches.forEach(match => {
              const minutes = parseInt(match[1]);
              const seconds = parseInt(match[2]);
              const hundredths = parseInt(match[3]);
              const totalSeconds = (minutes * 60) + seconds + (hundredths / 100);
              
              parsedLyrics.push({
                time: totalSeconds,
                text: text
              });
            });
          } else if (line.trim()) {
            // For lines without timestamps but with content
            parsedLyrics.push({
              time: -1, // No timestamp
              text: line.trim()
            });
          }
        });
        
        // Sort by time
        parsedLyrics.sort((a, b) => a.time - b.time);
        setParsedLines(parsedLyrics);
        
        // Also set plain text version for display
        setLyrics(parsedLyrics.map(line => line.text));
      } else {
        // No timestamps, just split by line
        const plainLines = lyricsText.split('\n').filter(line => line.trim().length > 0);
        setLyrics(plainLines);
        setParsedLines([]);
      }
    } catch (error) {
      console.error('Error parsing lyrics:', error);
      setLyrics(track.lyrics.split('\n').filter(line => line.trim().length > 0));
      setParsedLines([]);
    }
  }, [track]);
  
  // Update current line based on playback time
  useEffect(() => {
    if (!isPlaying || parsedLines.length === 0) return;
    
    // Find the current line based on timestamps
    let matchedIndex = 0;
    
    for (let i = 0; i < parsedLines.length; i++) {
      if (parsedLines[i].time <= currentTime) {
        matchedIndex = i;
      } else {
        break;
      }
    }
    
    setCurrentLine(matchedIndex);
  }, [currentTime, isPlaying, parsedLines]);
  
  // Auto-scroll to the current line
  useEffect(() => {
    if (isPlaying && currentLineRef.current && lyricsContainerRef.current) {
      const container = lyricsContainerRef.current;
      const element = currentLineRef.current;
      
      // Calculate positions
      const containerHeight = container.clientHeight;
      const elementTop = element.offsetTop;
      const elementHeight = element.clientHeight;
      
      // Scroll position should put the current line in the middle
      const scrollPosition = elementTop - (containerHeight / 2) + (elementHeight / 2);
      
      // Smooth scroll to position
      container.scrollTo({
        top: Math.max(0, scrollPosition),
        behavior: 'smooth'
      });
    }
  }, [currentLine, isPlaying]);
  
  if (!visible) return null;
  
  // If we have a track, it's selected
  const hasTrack = track !== null;
  
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.95)",
      zIndex: 50,
      display: "flex",
      flexDirection: "column",
      color: "white",
    }}>
      {/* Header with track info and close button */}
      <div style={{
        padding: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        background: "linear-gradient(to right, rgba(36,14,50,0.8) 0%, rgba(18,18,18,0.8) 100%)"
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column"
        }}>
          <h2 style={{
            margin: 0,
            fontSize: "20px",
            background: "linear-gradient(to right, #ff9900, #ff00ff)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent"
          }}>
            {track?.title || "No Track Selected"}
          </h2>
          <p style={{
            margin: "5px 0 0 0",
            fontSize: "16px",
            color: "rgba(255, 255, 255, 0.7)"
          }}>
            {track?.artist || "Unknown Artist"}
          </p>
        </div>
        
        <button
          onClick={onClose}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "white",
            fontSize: "24px",
            cursor: "pointer"
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      
      {/* Lyrics content - Full height */}
      <div 
        ref={lyricsContainerRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          position: "relative",
          paddingBottom: "100px" // Extra padding to make space for controls
        }}
      >
        {lyrics.length > 0 ? (
          <div style={{
            textAlign: "center",
            fontSize: "18px",
            lineHeight: 1.8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            {lyrics.map((line, index) => (
              <div
                key={index}
                ref={index === currentLine ? currentLineRef : null}
                style={{
                  margin: "10px 0",
                  color: index === currentLine && isPlaying ? "#ff66cc" : "rgba(255, 255, 255, 0.8)",
                  fontWeight: index === currentLine && isPlaying ? "bold" : "normal",
                  fontSize: index === currentLine && isPlaying ? "22px" : "18px",
                  transition: "all 0.3s ease",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  backgroundColor: index === currentLine && isPlaying ? "rgba(255, 0, 204, 0.1)" : "transparent"
                }}
              >
                {line}
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            color: "rgba(255, 255, 255, 0.5)",
            textAlign: "center",
            padding: "20px"
          }}>
            {track ? "No lyrics available for this track" : "Select a track to view lyrics"}
          </div>
        )}
      </div>
      
      {/* Track controls at the bottom - UPDATED PLAY BUTTON STYLING */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        padding: "15px 20px",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        background: "linear-gradient(to right, rgba(36,14,50,0.8) 0%, rgba(18,18,18,0.8) 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "15px"
      }}>
        {/* Restart Button */}
        {onRestart && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onRestart) onRestart();
            }}
            disabled={!isPlaying}
            style={{
              backgroundColor: isPlaying ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: isPlaying ? "pointer" : "default",
              color: isPlaying ? "white" : "rgba(255, 255, 255, 0.5)"
            }}
          >
            <FontAwesomeIcon icon={faRedo} style={{ fontSize: "14px" }} />
          </button>
        )}

        {/* Rewind Button */}
        {onRewind && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onRewind) onRewind();
            }}
            disabled={!isPlaying}
            style={{
              backgroundColor: isPlaying ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: isPlaying ? "pointer" : "default",
              color: isPlaying ? "white" : "rgba(255, 255, 255, 0.5)"
            }}
          >
            <FontAwesomeIcon icon={faBackward} style={{ fontSize: "14px" }} />
          </button>
        )}
        
        {/* Previous Track Button */}
        {onPreviousTrack && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onPreviousTrack) onPreviousTrack();
            }}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "white"
            }}
          >
            <FontAwesomeIcon icon={faStepBackward} style={{ fontSize: "14px" }} />
          </button>
        )}
        
        {/* Play/Pause Button - UPDATED: Always show disco pink since track is selected */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePlay();
          }}
          style={{
            background: "linear-gradient(135deg, #ff00cc, #3333ff)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "white",
            boxShadow: "0 0 20px rgba(255, 0, 204, 0.5)"
          }}
        >
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} style={{ fontSize: "20px" }} />
        </button>
        
        {/* Next Track Button */}
        {onNextTrack && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onNextTrack) onNextTrack();
            }}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "white"
            }}
          >
            <FontAwesomeIcon icon={faStepForward} style={{ fontSize: "14px" }} />
          </button>
        )}

        {/* Fast Forward Button */}
        {onFastForward && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onFastForward) onFastForward();
            }}
            disabled={!isPlaying}
            style={{
              backgroundColor: isPlaying ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: isPlaying ? "pointer" : "default",
              color: isPlaying ? "white" : "rgba(255, 255, 255, 0.5)"
            }}
          >
            <FontAwesomeIcon icon={faForward} style={{ fontSize: "14px" }} />
          </button>
        )}
      </div>
    </div>
  );
}