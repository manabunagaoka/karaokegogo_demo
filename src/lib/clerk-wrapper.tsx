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

// Conditionally import Clerk components
let ClerkProvider: React.ComponentType<any> | null = null;
let useAuth: () => any = () => ({
  isLoaded: true,
  isSignedIn: true,
  user: mockUser,
  userId: "user_mock"
});

// Wrapper component that doesn't require Clerk
export function ClerkProviderWrapper({ children }: { children: React.ReactNode }) {
  // Just pass through the children without Clerk
  return <>{children}</>;
}

// Export the conditional auth hook
export { useAuth };