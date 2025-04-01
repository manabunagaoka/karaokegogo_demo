import React from 'react';

// Mock user data
const mockUser = {
  id: "user_mock",
  firstName: "Demo",
  lastName: "User",
  imageUrl: "",
  fullName: "Demo User",
  username: "demo"
};

// Mock authentication context
export function useAuth() {
  return {
    isLoaded: true,
    isSignedIn: true,
    user: mockUser,
    userId: "user_mock"
  };
}

// Add proper TypeScript typing to the children prop
export function AuthWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}