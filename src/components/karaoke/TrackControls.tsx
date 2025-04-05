"use client";

import React from 'react';

interface TrackControlsProps {
  selectedTrack: number | string | null;
  isPlaying: boolean;
  onTogglePlay: (e: React.MouseEvent) => void;
  onNextTrack?: () => void;
  onPreviousTrack?: () => void;
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
        <i className="fas fa-step-backward" style={{ fontSize: "14px" }}></i>
      </button>
      
      {/* Play/Pause Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onTogglePlay(e);
        }}
        style={{
          backgroundColor: isPlaying ? "rgba(255, 102, 204, 0.8)" : "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "white"
        }}
      >
        <i className={isPlaying ? "fas fa-pause" : "fas fa-play"} style={{ fontSize: "20px" }}></i>
      </button>
      
      {/* Next Track Button */}
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
        <i className="fas fa-step-forward" style={{ fontSize: "14px" }}></i>
      </button>
    </div>
  );
}
