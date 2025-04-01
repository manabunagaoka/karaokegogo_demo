"use client";

import { useState } from "react";
import { SignIn, SignUp, useUser, UserButton } from "@/lib/auth-provider";

export default function AuthButtons() {
  const { isSignedIn, isLoaded } = useUser();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthClick = () => {
    setIsLoading(true);
    // Pre-load the SignIn component
    setShowSignIn(true);
  };

  // Handle sign-in vs sign-up toggle
  const switchToSignUp = () => {
    setShowSignIn(false);
    setShowSignUp(true);
  };

  const switchToSignIn = () => {
    setShowSignUp(false);
    setShowSignIn(true);
  };

  const closeModals = () => {
    setShowSignIn(false);
    setShowSignUp(false);
    setIsLoading(false);
  };

  return (
    <>
      {isLoaded && isSignedIn ? (
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-9 w-9 rounded-full border-2 border-pink-400",
            }
          }}
        />
      ) : (
        <button 
          onClick={handleAuthClick}
          style={{
            display: "block",
            padding: "12px 16px",
            color: "white",
            textDecoration: "none",
            textAlign: "center",
            fontWeight: "bold", 
            background: "linear-gradient(to right, #ff33cc, #3366ff)",
            margin: "8px 16px",
            borderRadius: "5px",
            cursor: "pointer",
            border: "none"
          }}
        >
          {isLoading ? "Loading..." : "Sign In / Sign Up"}
        </button>
      )}

      {/* Custom Auth Modal */}
      {(showSignIn || showSignUp) && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          overflow: "hidden"
        }}>
          {/* Backdrop with background image */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
            backgroundImage: `url('/images/stage.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.3)" // Darken the background
          }} />
          
          {/* Close button */}
          <button 
            onClick={closeModals}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "none",
              border: "none",
              fontSize: "24px",
              color: "white",
              cursor: "pointer",
              zIndex: 11
            }}
          >
            ×
          </button>

          {/* Auth component */}
          <div style={{
            position: "relative",
            zIndex: 10,
            maxWidth: "440px",
            width: "95%"
          }}>
            {showSignIn && <SignIn />}
            {showSignUp && <SignUp />}
          </div>
        </div>
      )}
    </>
  );
}