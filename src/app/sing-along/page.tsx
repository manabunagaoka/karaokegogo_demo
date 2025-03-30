"use client";
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown, faMicrophone, faMusic, faChartLine, faRss, faUpload, faPlay, faPause, faStar, faSearch } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [activePanelContent, setActivePanelContent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Example track data
  const tracks = [
    { id: 1, title: "Bohemian Rhapsody", artist: "Queen", duration: "5:55", popular: true },
    { id: 2, title: "Sweet Caroline", artist: "Neil Diamond", duration: "3:21", popular: true },
    { id: 3, title: "Don't Stop Believin'", artist: "Journey", duration: "4:10", popular: true },
    { id: 4, title: "Wonderwall", artist: "Oasis", duration: "4:18", popular: false },
    { id: 5, title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", duration: "4:30", popular: true }
  ];
  
  // Navigation functions
  const navigateTo = (path) => {
    if (path === '/sing-along') {
      setActivePanelContent('sing-along');
      setIsPanelVisible(true);
    } else {
      window.location.href = path;
    }
  };
  
  // Close the panel
  const closePanel = () => {
    setIsPanelVisible(false);
    setTimeout(() => {
      setActivePanelContent(null);
    }, 300); // Wait for animation to finish
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
          backgroundColor: "rgba(0,0,0,0.4)", // Lightened overlay
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
      
      {/* Arrow Button */}
      <button 
        style={{
          position: "fixed",
          bottom: isPanelVisible ? "135px" : "20px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "60px",
          height: "60px",
          background: "linear-gradient(135deg, #ff00cc, #3333ff)",
          color: "white",
          border: "none",
          borderRadius: "50%",
          fontSize: "24px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 0 20px rgba(255, 20, 147, 0.5)",
          zIndex: 30,
          transition: "bottom 0.3s ease-out" 
        }}
        onClick={() => setIsPanelVisible(!isPanelVisible)}
      >
        <FontAwesomeIcon icon={isPanelVisible ? faChevronDown : faChevronUp} />
      </button>
      
      {/* Bottom panel with four disco-style circle buttons */}
      <div style={{
        position: "fixed",
        bottom: isPanelVisible ? "0" : "-120px",
        left: 0,
        width: "100%",
        height: "120px",
        background: "linear-gradient(to top, #121212, rgba(18, 18, 18, 0.8))",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "bottom 0.3s ease-out",
        zIndex: 20,
        backdropFilter: "blur(5px)",
        overflow: "auto"
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
            onClick={() => navigateTo('/sing-along')}
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
            onClick={() => navigateTo('/my-mix')}
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
          >
            <div className="glow"></div>
            <FontAwesomeIcon icon={faMusic} style={{ fontSize: "clamp(16px, 4vw, 24px)", position: "relative", zIndex: 2 }} />
            <span style={{ fontSize: "clamp(9px, 2vw, 12px)", marginTop: "4px", position: "relative", zIndex: 2 }}>My Mix</span>
          </button>
          
          <button
            onClick={() => navigateTo('/top-charts')}
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
            onClick={() => navigateTo('/feed')}
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
      
      {/* Full screen overlay for Sing-Along panel */}
      {isPanelVisible && activePanelContent === 'sing-along' && (
        <div 
          className="full-panel"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(18, 18, 18, 0.95)",
            zIndex: 50,
            display: "flex",
            flexDirection: "column",
            color: "white",
            animation: "slideUp 0.3s ease-out forwards"
          }}
        >
          {/* Panel header */}
          <div style={{
            padding: "15px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            background: "linear-gradient(to right, rgba(36,14,50,1) 0%, rgba(18,18,18,1) 100%)"
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
              Sing-Along
            </h2>
            <button 
              onClick={closePanel}
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontSize: "24px",
                cursor: "pointer"
              }}
            >
              <FontAwesomeIcon icon={faChevronDown} />
            </button>
          </div>
          
          {/* Search and control bar */}
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
              <FontAwesomeIcon icon={faSearch} style={{ position: "absolute", left: "12px", top: "10px", color: "rgba(255,255,255,0.5)" }} />
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
            >
              <FontAwesomeIcon icon={faUpload} />
              <span>Upload Track</span>
            </button>
          </div>
          
          {/* Popular Tracks section */}
          <div style={{ padding: "15px 20px" }}>
            <h3 style={{ margin: "0 0 15px 0", fontSize: "18px", color: "rgba(255,255,255,0.9)" }}>
              <FontAwesomeIcon icon={faStar} style={{ marginRight: "8px", color: "#ffcc00" }} />
              Popular Tracks
            </h3>
            
            {/* Track list */}
            <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 250px)" }}>
              {tracks.filter(track => track.popular).map(track => (
                <div 
                  key={track.id}
                  style={{
                    padding: "12px 15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: "8px",
                    marginBottom: "10px",
                    background: "rgba(255,255,255,0.05)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    hover: {
                      background: "rgba(255,255,255,0.1)"
                    }
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button
                      onClick={() => setIsPlaying(prev => !prev)}
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
                        cursor: "pointer"
                      }}
                    >
                      <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
                    </button>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: "500" }}>{track.title}</div>
                      <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>{track.artist}</div>
                    </div>
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
                    {track.duration}
                  </div>
                </div>
              ))}
              
              <h3 style={{ margin: "20px 0 15px 0", fontSize: "18px", color: "rgba(255,255,255,0.9)" }}>
                Other Tracks
              </h3>
              
              {tracks.filter(track => !track.popular).map(track => (
                <div 
                  key={track.id}
                  style={{
                    padding: "12px 15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: "8px",
                    marginBottom: "10px",
                    background: "rgba(255,255,255,0.05)",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.1)",
                        border: "none",
                        color: "white",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: "15px",
                        cursor: "pointer"
                      }}
                    >
                      <FontAwesomeIcon icon={faPlay} />
                    </button>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: "500" }}>{track.title}</div>
                      <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>{track.artist}</div>
                    </div>
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
                    {track.duration}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Action buttons at bottom */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            padding: "15px 20px",
            background: "linear-gradient(to top, rgba(18,18,18,1), rgba(18,18,18,0.8))",
            display: "flex",
            justifyContent: "space-between"
          }}>
            <button
              style={{
                background: "linear-gradient(135deg, #00ccff, #0066cc)",
                border: "none",
                borderRadius: "30px",
                padding: "12px 25px",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 0 15px rgba(0, 204, 255, 0.4)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flex: 1,
                justifyContent: "center",
                margin: "0 5px"
              }}
            >
              <FontAwesomeIcon icon={faPlay} />
              Preview
            </button>
            
            <button
              style={{
                background: "linear-gradient(135deg, #ff00cc, #660066)",
                border: "none",
                borderRadius: "30px",
                padding: "12px 25px",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 0 15px rgba(255, 0, 204, 0.4)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flex: 1,
                justifyContent: "center",
                margin: "0 5px"
              }}
            >
              <FontAwesomeIcon icon={faMicrophone} />
              Sing Now
            </button>
          </div>
        </div>
      )}
      
      <style jsx global>{`
        /* Body and HTML full height */
        html, body {
          height: 100%;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
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
        
        /* Panel animation */
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        /* Touch optimization for mobile */
        @media (hover: none) {
          .disco-button {
            -webkit-tap-highlight-color: transparent;
          }
          
          .disco-button:active {
            transform: scale(0.95);
          }
        }
        
        /* Scrollbar styling */
        div[style*="overflowY: auto"] {
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.2) transparent;
        }
        
        div[style*="overflowY: auto"]::-webkit-scrollbar {
          width: 6px;
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
      `}</style>
    </main>
  );
}