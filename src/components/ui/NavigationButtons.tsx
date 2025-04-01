// src/components/ui/NavigationButtons.tsx
"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMusic, faChartLine, faRss } from '@fortawesome/free-solid-svg-icons';

interface NavigationButtonsProps {
  onKaraokeClick: () => void;
  showComingSoonMessage: () => void;
}

export default function NavigationButtons({ onKaraokeClick, showComingSoonMessage }: NavigationButtonsProps) {
  return (
    <div style={{ 
      display: "flex", 
      gap: "max(15px, min(30px, 4vw))",
      justifyContent: "center",
      padding: "5px 20px",
      minWidth: "fit-content"
    }}>
      {/* Karaoke Button */}
      <button
        onClick={onKaraokeClick}
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
        <span style={{ fontSize: "clamp(9px, 2vw, 12px)", marginTop: "4px", position: "relative", zIndex: 2 }}>Karaoke</span>
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
        onClick={showComingSoonMessage}
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
        onClick={showComingSoonMessage}
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
        onClick={showComingSoonMessage}
      >
        <div className="glow"></div>
        <FontAwesomeIcon icon={faRss} style={{ fontSize: "clamp(16px, 4vw, 24px)", position: "relative", zIndex: 2 }} />
        <span style={{ fontSize: "clamp(9px, 2vw, 12px)", marginTop: "4px", position: "relative", zIndex: 2 }}>Feed</span>
      </button>
    </div>
  );
}