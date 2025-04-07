"use client";

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStepBackward, 
  faStepForward, 
  faPlay, 
  faPause,
  faForward,
  faBackward,
  faRedo
} from '@fortawesome/free-solid-svg-icons';

interface TrackControlsProps {
  selectedTrack: number | string | null;
  isPlaying: boolean;
  onTogglePlay: (e: React.MouseEvent) => void;
  onNextTrack?: () => void;
  onPreviousTrack?: () => void;
  onFastForward?: () => void;
  onRewind?: () => void;
  onRestart?: () => void;
}

export default function TrackControls({
  selectedTrack,
  isPlaying,
  onTogglePlay,
  onNextTrack,
  onPreviousTrack,
  onFastForward,
  onRewind,
  onRestart
}: TrackControlsProps) {
  // Track is selected if selectedTrack is not null
  const hasSelectedTrack = selectedTrack !== null;

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
      
      {/* Play/Pause Button - Updated with disco pink gradient styling for both selected and playing states */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onTogglePlay(e);
        }}
        disabled={!hasSelectedTrack}
        style={{
          background: isPlaying || hasSelectedTrack ? 
            "linear-gradient(135deg, #ff00cc, #3333ff)" : 
            "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: hasSelectedTrack ? "pointer" : "default",
          color: "white",
          opacity: hasSelectedTrack ? 1 : 0.5,
          boxShadow: isPlaying || hasSelectedTrack ? 
            "0 0 20px rgba(255, 0, 204, 0.5)" : 
            "none"
        }}
      >
        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} style={{ fontSize: "20px" }} />
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
        <FontAwesomeIcon icon={faStepForward} style={{ fontSize: "14px" }} />
      </button>

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
  );
}