import { SignIn } from "@/lib/auth-provider";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <SignIn 
        appearance={{
          elements: {
            card: "bg-[rgba(20,20,30,0.85)] backdrop-blur-lg shadow-xl",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            formFieldInput: "bg-[rgba(60,60,80,0.7)] border-[rgba(255,255,255,0.2)]",
            footer: "hidden",
            logoBox: "hidden"
          }
        }}
      />
    </div>
  );
}