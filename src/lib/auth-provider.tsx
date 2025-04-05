"use client";

import React from 'react';

// Updated SignUp component that accepts appearance prop
export const SignUp = ({ appearance }: { appearance?: any }) => {
  return (
    <div className="text-white p-8 rounded-lg" style={{ background: 'rgba(20,20,30,0.85)' }}>
      <h2 className="text-xl font-bold mb-4">Sign Up (Demo Mode)</h2>
      <p>Authentication is bypassed for this demo.</p>
      <button 
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => window.location.href = '/'}
      >
        Go to Home
      </button>
    </div>
  );
};

// Updated SignIn component that accepts appearance prop
export const SignIn = ({ appearance }: { appearance?: any }) => {
  return (
    <div className="text-white p-8 rounded-lg" style={{ background: 'rgba(20,20,30,0.85)' }}>
      <h2 className="text-xl font-bold mb-4">Sign In (Demo Mode)</h2>
      <p>Authentication is bypassed for this demo.</p>
      <button 
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => window.location.href = '/'}
      >
        Go to Home
      </button>
    </div>
  );
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