"use client";

import React from 'react';

interface TrackControlsProps {
  selectedTrack: number | string | null;
  isPlaying: boolean;
  onTogglePlay: (e: React.MouseEvent) => void;
  onNextTrack?: () => void;  // New prop for next track
  onPreviousTrack?: () => void;  // New prop for previous track
}

export default function TrackControls({
  selectedTrack,
  isPlaying,
  onTogglePlay,
  onNextTrack,
  onPreviousTrack
}: TrackControlsProps) {
  return (
    <div style={{
      padding: "15px 20px",
      borderTop: "1px solid rgba(255,255,255,0.1)",
      background: "linear-gradient(to right, rgba(36,14,50,0.8) 0%, rgba(18,18,18,0.8) 100%)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "15px"
    }}>
      {/* Previous Track Button */}
      <button
        onClick={onPreviousTrack}
        disabled={!selectedTrack || !onPreviousTrack}
        style={{
          backgroundColor: !selectedTrack || !onPreviousTrack ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: !selectedTrack || !onPreviousTrack ? "not-allowed" : "pointer",
          color: !selectedTrack || !onPreviousTrack ? "rgba(255, 255, 255, 0.3)" : "white"
        }}
      >
        <i className="fas fa-step-backward" style={{ fontSize: "14px" }}></i>
      </button>
      
      {/* Play/Pause Button */}
      <button
        onClick={onTogglePlay}
        disabled={!selectedTrack}
        style={{
          backgroundColor: !selectedTrack ? "rgba(255, 255, 255, 0.05)" : 
                          isPlaying ? "rgba(255, 102, 204, 0.8)" : "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: !selectedTrack ? "not-allowed" : "pointer",
          color: !selectedTrack ? "rgba(255, 255, 255, 0.3)" : "white"
        }}
      >
        <i className={isPlaying ? "fas fa-pause" : "fas fa-play"} style={{ fontSize: "20px" }}></i>
      </button>
      
      {/* Next Track Button */}
      <button
        onClick={onNextTrack}
        disabled={!selectedTrack || !onNextTrack}
        style={{
          backgroundColor: !selectedTrack || !onNextTrack ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: !selectedTrack || !onNextTrack ? "not-allowed" : "pointer",
          color: !selectedTrack || !onNextTrack ? "rgba(255, 255, 255, 0.3)" : "white"
        }}
      >
        <i className="fas fa-step-forward" style={{ fontSize: "14px" }}></i>
      </button>
    </div>
  );
}