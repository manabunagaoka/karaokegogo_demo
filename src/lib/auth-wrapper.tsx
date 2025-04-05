"use client";

import React from 'react';

// Simple demo authentication wrapper that bypasses authentication
export function AuthWrapper({ children }: { children: React.ReactNode }) {
  // Just render children without any authentication checks for the demo
  return <>{children}</>;
}

// Mock authentication hooks that always return "authenticated" for demo
export const useAuth = () => {
  return {
    isAuthenticated: true, // Always authenticated for demo
    user: { 
      id: "demo-user", 
      name: "Demo User",
      email: "demo@example.com"
    },
    login: async () => true,
    logout: async () => true,
    signup: async () => true,
  };
};

// Also export these to satisfy any imports in your code
export const SignIn = () => null;
export const SignUp = () => null;

export default AuthWrapper;