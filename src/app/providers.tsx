"use client";

import { ClerkProviderWrapper } from '@/lib/clerk-wrapper';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProviderWrapper>
      {/* Your other providers */}
      {children}
    </ClerkProviderWrapper>
  );
}