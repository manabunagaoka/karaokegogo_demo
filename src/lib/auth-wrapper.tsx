import React from 'react';

// Mock user data (same as your auth-wrapper)
const mockUser = {
  id: "user_mock",
  firstName: "Demo",
  lastName: "User",
  imageUrl: "",
  fullName: "Demo User",
  username: "demo"
};

// Conditionally import Clerk components
let ClerkProvider: React.ComponentType<any> | null = null;
let useAuth: () => any = () => ({
  isLoaded: true,
  isSignedIn: true,
  user: mockUser,
  userId: "user_mock"
});

// Only import Clerk if we have the necessary environment variables
if (typeof process !== 'undefined' && 
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
  try {
    // This will only execute if the environment variable exists
    const clerk = require('@clerk/nextjs');
    ClerkProvider = clerk.ClerkProvider;
    useAuth = clerk.useAuth;
  } catch (e) {
    console.warn('Clerk import failed, using mock authentication');
  }
}

// Wrapper component that uses either real Clerk or mock
export function ClerkProviderWrapper({ children }: { children: React.ReactNode }) {
  // If Clerk is properly initialized, use it
  if (ClerkProvider && typeof process !== 'undefined' && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <ClerkProvider>{children}</ClerkProvider>;
  }
  
  // Otherwise just pass through the children without Clerk
  return <>{children}</>;
}

// Export the conditional auth hook
export { useAuth };

// Export your existing AuthWrapper 
export function AuthWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}