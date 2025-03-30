// src/components/NavBar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

// Placeholder logo component
function LogoPlaceholder() {
  return (
    <div className="w-10 h-10 bg-gradient-to-br from-pink-600 to-purple-600 rounded-full flex items-center justify-center">
      <span className="text-white font-bold text-sm">K</span>
    </div>
  );
}

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();
  
  return (
    <nav className="bg-black/30 backdrop-blur-md py-4 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <LogoPlaceholder />
          <span className="text-white font-bold text-xl">KaraokeGoGo</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/#features" className="text-white hover:text-pink-400 transition-colors">
            Features
          </Link>
          <Link href="/#pricing" className="text-white hover:text-pink-400 transition-colors">
            Pricing
          </Link>
          <Link href="/#about" className="text-white hover:text-pink-400 transition-colors">
            About
          </Link>
          
          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <Link 
                href="/dashboard" 
                className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-full transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-white hover:text-pink-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-full transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-md mt-4 py-4 px-6 rounded-lg">
          <div className="flex flex-col space-y-4">
            <Link 
              href="/#features" 
              className="text-white hover:text-pink-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="/#pricing" 
              className="text-white hover:text-pink-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="/#about" 
              className="text-white hover:text-pink-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            
            <hr className="border-gray-700" />
            
            {/* Auth Buttons */}
            {isSignedIn ? (
              <Link 
                href="/dashboard" 
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-full text-center transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link 
                  href="/login" 
                  className="px-4 py-2 border border-white text-white font-medium rounded-full text-center hover:bg-white/10 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-full text-center transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}