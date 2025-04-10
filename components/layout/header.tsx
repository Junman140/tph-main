'use client';

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

export function LayoutHeader() {
  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16 border-b">
      <SignedOut>
        <SignInButton mode="modal">
          <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
            Sign In
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground">
            Sign Up
          </button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <UserButton 
          afterSignOutUrl="/sign-in"
          appearance={{
            elements: {
              avatarBox: "w-10 h-10"
            }
          }}
        />
      </SignedIn>
    </header>
  )
} 