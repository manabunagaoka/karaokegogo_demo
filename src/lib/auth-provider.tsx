"use client";

import React from 'react';

// Updated SignUp component that accepts appearance prop
export const SignUp = ({ appearance }: { appearance?: any }) => {
  return <div className="text-white p-8 rounded-lg" style={{ background: 'rgba(20,20,30,0.85)' }}>Sign Up functionality bypassed for demo</div>;
};

// Updated SignIn component that accepts appearance prop
export const SignIn = ({ appearance }: { appearance?: any }) => {
  return <div className="text-white p-8 rounded-lg" style={{ background: 'rgba(20,20,30,0.85)' }}>Sign In functionality bypassed for demo</div>;
};

// Include any existing exports or functionality your application needs
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

// Update useAuth to return authenticated user for demo
export const useAuth = () => {
  return {
    isAuthenticated: true, // Always authenticated for demo
    user: {
      id: "demo-user",
      firstName: "Demo",
      lastName: "User",
      imageUrl: "",
      fullName: "Demo User",
      username: "demo"
    },
    isLoaded: true,
    isSignedIn: true,
    login: async () => {},
    logout: async () => {},
    signup: async () => {},
  };
};

export default AuthProvider;