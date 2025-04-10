'use client';

import { SignIn } from "@clerk/nextjs";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <SignIn 
        appearance={{
          elements: {
            rootBox: "mx-auto w-full max-w-md",
            card: "bg-background shadow-lg",
          }
        }}
      />
    </div>
  );
} 