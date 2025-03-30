"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#ff00cc",
          colorBackground: "#121212",
          colorInputBackground: "rgba(60, 60, 80, 0.7)",
          colorAlphaShade: "rgba(255, 255, 255, 0.1)",
          colorDanger: "#ff3366",
          colorSuccess: "#33cc99",
          fontFamily: "inherit",
          borderRadius: "8px",
        },
        elements: {
          formButtonPrimary: 
            "bg-gradient-to-r from-[#ff33cc] to-[#3366ff] hover:opacity-90 text-sm normal-case",
          card: "bg-[rgba(20,20,30,0.85)] backdrop-blur-lg shadow-xl",
          headerTitle: "hidden",
          headerSubtitle: "hidden",
          socialButtonsIconButton: "border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.1)]",
          formFieldInput: "bg-[rgba(60,60,80,0.7)] border-[rgba(255,255,255,0.2)]",
          footer: "hidden",
          logoBox: "hidden"
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}