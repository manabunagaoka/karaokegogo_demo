"use client";

import { useState } from "react";
import { SignIn, SignUp, useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";

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
            filter: "brightness(0.3)", // Darken the background
          }} />
          
          {/* Animated gradient overlay */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "radial-gradient(circle at center, rgba(255, 0, 204, 0.1) 0%, rgba(0, 0, 0, 0) 70%)",
            animation: "pulse 8s infinite",
            zIndex: 1,
          }} />
          
          {/* Auth Card Wrapper */}
          <div style={{
            position: "relative",
            zIndex: 10,
            maxWidth: "440px",
            width: "95%",
            padding: "20px 0",
            backgroundColor: "transparent"
          }}>
            {/* Close button */}
            <button 
              onClick={closeModals}
              style={{
                position: "absolute",
                top: "-40px",
                right: "0px",
                background: "rgba(0,0,0,0.5)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "34px",
                height: "34px",
                fontSize: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 20,
              }}
            >
              ✕
            </button>
            
            {/* Auth Components */}
            {showSignIn && (
              <div>
                <SignIn 
                  appearance={{
                    elements: {
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      formFieldInput: "bg-opacity-70 bg-gray-800",
                      footerActionText: "Don't have an account?",
                      footerActionLink: "Sign up",
                    }
                  }}
                  afterSignInUrl="/"
                  signUpUrl={null}
                  redirectUrl="/"
                  routing="virtual"
                  afterSignUp={() => setShowSignIn(false)}
                />
                <div style={{ 
                  textAlign: "center", 
                  marginTop: "10px",
                  color: "white"
                }}>
                  <p>Don't have an account? <button 
                    onClick={switchToSignUp}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ff33cc",
                      cursor: "pointer",
                      fontWeight: "bold",
                      padding: 0
                    }}
                  >Sign up</button></p>
                </div>
              </div>
            )}
            
            {showSignUp && (
              <div>
                <SignUp 
                  appearance={{
                    elements: {
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      formFieldInput: "bg-opacity-70 bg-gray-800",
                      footerActionText: "Already have an account?",
                      footerActionLink: "Sign in",
                    }
                  }}
                  afterSignUpUrl="/"
                  signInUrl={null}
                  redirectUrl="/"
                  routing="virtual"
                  afterSignIn={() => setShowSignUp(false)}
                />
                <div style={{ 
                  textAlign: "center", 
                  marginTop: "10px",
                  color: "white"
                }}>
                  <p>Already have an account? <button 
                    onClick={switchToSignIn}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ff33cc",
                      cursor: "pointer",
                      fontWeight: "bold",
                      padding: 0
                    }}
                  >Sign in</button></p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes pulse {
          0% {
            opacity: 0.1;
            transform: scale(0.95);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.05);
          }
          100% {
            opacity: 0.1;
            transform: scale(0.95);
          }
        }
        
        /* Hide Clerk's default headers */
        .cl-headerTitle, 
        .cl-headerSubtitle {
          display: none !important;
        }
        
        /* Custom styling for Clerk form */
        .cl-card {
          background-color: rgba(20, 20, 30, 0.85) !important;
          backdrop-filter: blur(10px) !important;
          border-radius: 16px !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
          padding: 30px !important;
        }
        
        /* Clerk button styling */
        .cl-formButtonPrimary {
          background: linear-gradient(to right, #ff33cc, #3366ff) !important;
          opacity: 1 !important;
          transition: opacity 0.2s !important;
        }
        
        .cl-formButtonPrimary:hover {
          opacity: 0.9 !important;
        }
        
        /* Input styling */
        .cl-formFieldInput {
          background-color: rgba(60, 60, 80, 0.7) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          color: white !important;
        }
        
        /* Hide Clerk logo */
        .cl-logoBox, .cl-logo {
          display: none !important;
        }
        
        /* Hide Clerk's footer */
        .cl-footer {
          display: none !important;
        }
      `}</style>
    </>
  );
}