// src/components/layout/AppLogo.tsx
"use client";

export default function AppLogo() {
  return (
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
  );
}